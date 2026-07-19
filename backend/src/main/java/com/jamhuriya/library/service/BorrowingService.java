package com.jamhuriya.library.service;

import com.jamhuriya.library.dto.BorrowRequest;
import com.jamhuriya.library.dto.BorrowingResponse;
import com.jamhuriya.library.dto.PageResponse;
import com.jamhuriya.library.dto.UpdateBorrowingStatusRequest;
import com.jamhuriya.library.entity.AppUser;
import com.jamhuriya.library.entity.Book;
import com.jamhuriya.library.entity.Borrowing;
import com.jamhuriya.library.entity.BorrowingStatus;
import com.jamhuriya.library.exception.BadRequestException;
import com.jamhuriya.library.exception.ResourceNotFoundException;
import com.jamhuriya.library.repository.BookRepository;
import com.jamhuriya.library.repository.BorrowingRepository;
import com.jamhuriya.library.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class BorrowingService {

    private static final Set<BorrowingStatus> ACTIVE_STATUSES =
            Set.of(BorrowingStatus.PENDING, BorrowingStatus.APPROVED);

    private final BorrowingRepository borrowingRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public BorrowingService(BorrowingRepository borrowingRepository,
                            UserRepository userRepository,
                            BookRepository bookRepository) {
        this.borrowingRepository = borrowingRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Transactional
    public List<BorrowingResponse> createRequests(BorrowRequest request, String email) {
        Set<Long> uniqueIds = new HashSet<>(request.bookIds());
        if (uniqueIds.size() != request.bookIds().size()) {
            throw new BadRequestException("The same book cannot be requested more than once");
        }

        AppUser user = findUser(email);
        return request.bookIds().stream()
                .map(bookId -> createRequest(user, bookId))
                .map(BorrowingResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<BorrowingResponse> getMine(String email, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Borrowing> result = borrowingRepository
                .findByUserEmailIgnoreCaseOrderByRequestedAtDesc(email, pageable);
        return PageResponse.from(result, BorrowingResponse::from);
    }

    @Transactional(readOnly = true)
    public PageResponse<BorrowingResponse> getAll(BorrowingStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Borrowing> result = status == null
                ? borrowingRepository.findAllByOrderByRequestedAtDesc(pageable)
                : borrowingRepository.findByStatusOrderByRequestedAtDesc(status, pageable);
        return PageResponse.from(result, BorrowingResponse::from);
    }

    @Transactional
    public BorrowingResponse updateStatus(Long id, UpdateBorrowingStatusRequest request) {
        Borrowing borrowing = borrowingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Borrowing request not found"));

        BorrowingStatus nextStatus = request.status();
        switch (nextStatus) {
            case APPROVED -> approve(borrowing);
            case REJECTED -> reject(borrowing);
            case RETURNED -> returnBook(borrowing);
            default -> throw new BadRequestException("The requested status change is not allowed");
        }

        return BorrowingResponse.from(borrowingRepository.save(borrowing));
    }

    private Borrowing createRequest(AppUser user, Long bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException(book.getTitle() + " is currently unavailable");
        }
        if (borrowingRepository.existsByUserIdAndBookIdAndStatusIn(
                user.getId(), book.getId(), ACTIVE_STATUSES)) {
            throw new BadRequestException("You already have a pending or active request for " + book.getTitle());
        }

        Borrowing borrowing = new Borrowing();
        borrowing.setUser(user);
        borrowing.setBook(book);
        borrowing.setStatus(BorrowingStatus.PENDING);
        borrowing.setRequestedAt(Instant.now());
        return borrowingRepository.save(borrowing);
    }

    private void approve(Borrowing borrowing) {
        if (borrowing.getStatus() != BorrowingStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be approved");
        }
        Book book = borrowing.getBook();
        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("No copy of this book is currently available");
        }

        Instant now = Instant.now();
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        borrowing.setStatus(BorrowingStatus.APPROVED);
        borrowing.setApprovedAt(now);
        borrowing.setDueDate(now.plus(14, ChronoUnit.DAYS));
        bookRepository.save(book);
    }

    private void reject(Borrowing borrowing) {
        if (borrowing.getStatus() != BorrowingStatus.PENDING) {
            throw new BadRequestException("Only pending requests can be rejected");
        }
        borrowing.setStatus(BorrowingStatus.REJECTED);
    }

    private void returnBook(Borrowing borrowing) {
        if (borrowing.getStatus() != BorrowingStatus.APPROVED) {
            throw new BadRequestException("Only approved borrowings can be marked as returned");
        }
        Book book = borrowing.getBook();
        book.setAvailableCopies(Math.min(book.getTotalCopies(), book.getAvailableCopies() + 1));
        borrowing.setStatus(BorrowingStatus.RETURNED);
        borrowing.setReturnedAt(Instant.now());
        bookRepository.save(book);
    }

    private AppUser findUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
