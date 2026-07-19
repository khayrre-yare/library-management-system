package com.jamhuriya.library.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PurchaseRequest(
        @NotEmpty(message = "Select at least one book")
        @Size(max = 20, message = "A purchase can contain at most 20 books")
        List<Long> bookIds
) {}
