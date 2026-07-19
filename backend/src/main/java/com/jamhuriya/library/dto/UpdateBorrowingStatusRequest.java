package com.jamhuriya.library.dto;

import com.jamhuriya.library.entity.BorrowingStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateBorrowingStatusRequest(
        @NotNull(message = "Status is required")
        BorrowingStatus status
) {
}
