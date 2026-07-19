package com.jamhuriya.library.dto;

import com.jamhuriya.library.entity.Borrowing;
import com.jamhuriya.library.entity.BorrowingStatus;

import java.time.Instant;

public record BorrowingResponse(
        Long id,
        Long bookId,
        String bookTitle,
        String bookAuthor,
        String coverUrl,
        BorrowingStatus status,
        Instant requestedAt,
        Instant approvedAt,
        Instant dueDate,
        Instant returnedAt,
        Long userId,
        String userName,
        String userEmail
) {
    public static BorrowingResponse from(Borrowing borrowing) {
        return new BorrowingResponse(
                borrowing.getId(),
                borrowing.getBook().getId(),
                borrowing.getBook().getTitle(),
                borrowing.getBook().getAuthor(),
                borrowing.getBook().getCoverUrl(),
                borrowing.getStatus(),
                borrowing.getRequestedAt(),
                borrowing.getApprovedAt(),
                borrowing.getDueDate(),
                borrowing.getReturnedAt(),
                borrowing.getUser().getId(),
                borrowing.getUser().getFullName(),
                borrowing.getUser().getEmail()
        );
    }
}
