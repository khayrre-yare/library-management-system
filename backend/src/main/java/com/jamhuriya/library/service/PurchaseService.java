package com.jamhuriya.library.service;

import com.jamhuriya.library.dto.PurchaseResponse;
import com.jamhuriya.library.dto.PurchaseRequest;
import com.jamhuriya.library.entity.*;
import com.jamhuriya.library.exception.*;
import com.jamhuriya.library.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import com.jamhuriya.library.dto.PageResponse;
import com.jamhuriya.library.dto.UpdatePurchaseStatusRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@Service
public class PurchaseService {
    private final BookRepository books;
    private final UserRepository users;
    private final PurchaseRepository purchases;

    public PurchaseService(BookRepository books, UserRepository users, PurchaseRepository purchases) {
        this.books = books; this.users = users; this.purchases = purchases;
    }

    @Transactional
    public PurchaseResponse buy(Long bookId, String email) {
        AppUser user = users.findByEmailIgnoreCase(email).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Book book = books.findByIdForUpdate(bookId).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
        if (book.getAvailableCopies() <= 0) throw new BadRequestException("This book is currently unavailable");
        if (book.getPrice() == null || book.getPrice().signum() <= 0) throw new BadRequestException("This book does not have a valid sale price yet");
        Purchase purchase = new Purchase();
        purchase.setUser(user); purchase.setBook(book); purchase.setPrice(book.getPrice());
        purchase.setStatus(PurchaseStatus.PENDING); purchase.setPurchasedAt(Instant.now());
        return PurchaseResponse.from(purchases.save(purchase));
    }

    @Transactional
    public List<PurchaseResponse> buyAll(PurchaseRequest request, String email) {
        if (new HashSet<>(request.bookIds()).size() != request.bookIds().size()) {
            throw new BadRequestException("The same book cannot be purchased more than once");
        }
        return request.bookIds().stream().map(bookId -> buy(bookId, email)).toList();
    }

    @Transactional(readOnly = true)
    public PageResponse<PurchaseResponse> getAll(PurchaseStatus status, int page, int size) {
        Page<Purchase> result = status == null
                ? purchases.findAllByOrderByPurchasedAtDesc(PageRequest.of(page, size))
                : purchases.findByStatusOrderByPurchasedAtDesc(status, PageRequest.of(page, size));
        return PageResponse.from(result, PurchaseResponse::from);
    }

    @Transactional(readOnly = true)
    public PageResponse<PurchaseResponse> getMine(String email, int page, int size) {
        return PageResponse.from(
                purchases.findByUserEmailIgnoreCaseOrderByPurchasedAtDesc(email, PageRequest.of(page, size)),
                PurchaseResponse::from
        );
    }

    @Transactional
    public PurchaseResponse updateStatus(Long id, UpdatePurchaseStatusRequest request) {
        Purchase purchase = purchases.findById(id).orElseThrow(() -> new ResourceNotFoundException("Purchase request not found"));
        if (purchase.getStatus() != PurchaseStatus.PENDING) throw new BadRequestException("Only pending purchase requests can be reviewed");
        if (request.status() == PurchaseStatus.APPROVED) {
            Book book = books.findByIdForUpdate(purchase.getBook().getId()).orElseThrow(() -> new ResourceNotFoundException("Book not found"));
            if (book.getAvailableCopies() <= 0) throw new BadRequestException("This book is currently unavailable");
            book.setAvailableCopies(book.getAvailableCopies() - 1);
            books.save(book);
        } else if (request.status() != PurchaseStatus.REJECTED) {
            throw new BadRequestException("Purchase requests can only be approved or rejected");
        }
        purchase.setStatus(request.status());
        purchase.setDecidedAt(Instant.now());
        return PurchaseResponse.from(purchases.save(purchase));
    }
}
