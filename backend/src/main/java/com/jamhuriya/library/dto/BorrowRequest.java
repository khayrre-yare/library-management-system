package com.jamhuriya.library.dto;

import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record BorrowRequest(
        @NotEmpty(message = "Select at least one book")
        List<Long> bookIds
) {
}
