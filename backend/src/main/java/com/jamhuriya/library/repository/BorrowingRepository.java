package com.jamhuriya.library.repository;

import com.jamhuriya.library.entity.Borrowing;
import com.jamhuriya.library.entity.BorrowingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Collection;
import java.util.List;

public interface BorrowingRepository extends JpaRepository<Borrowing, Long> {

    Page<Borrowing> findByUserEmailIgnoreCaseOrderByRequestedAtDesc(String email, Pageable pageable);

    Page<Borrowing> findByStatusOrderByRequestedAtDesc(BorrowingStatus status, Pageable pageable);

    Page<Borrowing> findAllByOrderByRequestedAtDesc(Pageable pageable);

    boolean existsByUserIdAndBookIdAndStatusIn(Long userId,
                                                Long bookId,
                                                Collection<BorrowingStatus> statuses);

    boolean existsByBookIdAndStatusIn(Long bookId, Collection<BorrowingStatus> statuses);

    long countByUserEmailIgnoreCase(String email);

    long countByUserEmailIgnoreCaseAndStatus(String email, BorrowingStatus status);

    long countByUserEmailIgnoreCaseAndStatusAndDueDateBefore(String email,
                                                             BorrowingStatus status,
                                                             Instant dueDate);

    long countByStatus(BorrowingStatus status);

    List<Borrowing> findTop5ByUserEmailIgnoreCaseOrderByRequestedAtDesc(String email);

    List<Borrowing> findTop5ByOrderByRequestedAtDesc();
}
