package com.jamhuriya.library.repository;

import com.jamhuriya.library.entity.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import com.jamhuriya.library.entity.PurchaseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    Page<Purchase> findAllByOrderByPurchasedAtDesc(Pageable pageable);
    Page<Purchase> findByStatusOrderByPurchasedAtDesc(PurchaseStatus status, Pageable pageable);
    Page<Purchase> findByUserEmailIgnoreCaseOrderByPurchasedAtDesc(String email, Pageable pageable);
    long countByStatus(PurchaseStatus status);
}
