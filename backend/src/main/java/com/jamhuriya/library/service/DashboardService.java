package com.jamhuriya.library.service;

import com.jamhuriya.library.dto.AdminDashboardResponse;
import com.jamhuriya.library.dto.AdminNotificationResponse;
import com.jamhuriya.library.dto.BorrowingResponse;
import com.jamhuriya.library.dto.UserDashboardResponse;
import com.jamhuriya.library.entity.BorrowingStatus;
import com.jamhuriya.library.entity.Role;
import com.jamhuriya.library.repository.BookRepository;
import com.jamhuriya.library.repository.BorrowingRepository;
import com.jamhuriya.library.repository.ContactMessageRepository;
import com.jamhuriya.library.repository.UserRepository;
import com.jamhuriya.library.repository.PurchaseRepository;
import com.jamhuriya.library.entity.PurchaseStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
public class DashboardService {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final BorrowingRepository borrowingRepository;
    private final ContactMessageRepository contactMessageRepository;
    private final PurchaseRepository purchaseRepository;

    public DashboardService(BookRepository bookRepository,
                            UserRepository userRepository,
                            BorrowingRepository borrowingRepository,
                            ContactMessageRepository contactMessageRepository,
                            PurchaseRepository purchaseRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.borrowingRepository = borrowingRepository;
        this.contactMessageRepository = contactMessageRepository;
        this.purchaseRepository = purchaseRepository;
    }

    @Transactional(readOnly = true)
    public UserDashboardResponse getUserDashboard(String email) {
        return new UserDashboardResponse(
                borrowingRepository.countByUserEmailIgnoreCaseAndStatus(email, BorrowingStatus.APPROVED),
                borrowingRepository.countByUserEmailIgnoreCaseAndStatus(email, BorrowingStatus.PENDING),
                borrowingRepository.countByUserEmailIgnoreCaseAndStatusAndDueDateBefore(
                        email, BorrowingStatus.APPROVED, Instant.now()),
                borrowingRepository.countByUserEmailIgnoreCase(email),
                borrowingRepository.findTop5ByUserEmailIgnoreCaseOrderByRequestedAtDesc(email)
                        .stream()
                        .map(BorrowingResponse::from)
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getAdminDashboard() {
        return new AdminDashboardResponse(
                bookRepository.count(),
                userRepository.countByRole(Role.USER),
                borrowingRepository.countByStatus(BorrowingStatus.APPROVED),
                borrowingRepository.countByStatus(BorrowingStatus.PENDING),
                contactMessageRepository.countByReadFalse(),
                bookRepository.countAvailableCopies(),
                borrowingRepository.findTop5ByOrderByRequestedAtDesc()
                        .stream()
                        .map(BorrowingResponse::from)
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public AdminNotificationResponse getNotifications() {
        return new AdminNotificationResponse(
                borrowingRepository.countByStatus(BorrowingStatus.PENDING),
                purchaseRepository.countByStatus(PurchaseStatus.PENDING),
                contactMessageRepository.countByReadFalse()
        );
    }
}
