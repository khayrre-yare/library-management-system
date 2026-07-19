package com.jamhuriya.library.dto;

import com.jamhuriya.library.entity.Purchase;
import java.math.BigDecimal;
import java.time.Instant;
import com.jamhuriya.library.entity.PurchaseStatus;

public record PurchaseResponse(Long id, Long bookId, String bookTitle, String bookAuthor, String coverUrl,
                               Long userId, String userName, String userEmail, BigDecimal price,
                               PurchaseStatus status, Instant requestedAt, Instant decidedAt) {
    public static PurchaseResponse from(Purchase purchase) {
        return new PurchaseResponse(purchase.getId(), purchase.getBook().getId(), purchase.getBook().getTitle(),
                purchase.getBook().getAuthor(), purchase.getBook().getCoverUrl(), purchase.getUser().getId(),
                purchase.getUser().getFullName(), purchase.getUser().getEmail(), purchase.getPrice(),
                purchase.getStatus(), purchase.getPurchasedAt(), purchase.getDecidedAt());
    }
}
