package com.jamhuriya.library.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import java.math.BigDecimal;

public record BookRequest(
        @NotBlank(message = "Title is required")
        @Size(min = 2, max = 150, message = "Title must be between 2 and 150 characters")
        String title,

        @NotBlank(message = "Author is required")
        @Size(min = 2, max = 120, message = "Author must be between 2 and 120 characters")
        String author,

        @NotBlank(message = "ISBN is required")
        @Size(min = 10, max = 20, message = "ISBN must be between 10 and 20 characters")
        String isbn,

        @NotBlank(message = "Category is required")
        @Size(min = 2, max = 80, message = "Category must be between 2 and 80 characters")
        String category,

        @Size(max = 3000, message = "Description cannot exceed 3000 characters")
        String description,

        @Size(max = 1000, message = "Cover URL is too long")
        String coverUrl,

        @Min(value = 1000, message = "Published year must be at least 1000")
        @Max(value = 2100, message = "Published year cannot exceed 2100")
        Integer publishedYear,

        @NotNull(message = "Total copies is required")
        @Min(value = 1, message = "Total copies must be at least 1")
        @Max(value = 999, message = "Total copies cannot exceed 999")
        Integer totalCopies,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be greater than zero")
        @Digits(integer = 8, fraction = 2, message = "Price can have at most two decimal places")
        BigDecimal price
) {
}
