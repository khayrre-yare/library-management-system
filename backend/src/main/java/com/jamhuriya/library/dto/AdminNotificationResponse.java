package com.jamhuriya.library.dto;

public record AdminNotificationResponse(
        long pendingBorrowRequests,
        long pendingPurchaseRequests,
        long unreadContactMessages
) {
}
