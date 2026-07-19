package com.jamhuriya.library.dto;

import com.jamhuriya.library.entity.Book;

import java.time.Instant;
import java.math.BigDecimal;

public record BookResponse(
        Long id,
        String title,
        String author,
        String isbn,
        String category,
        String description,
        String coverUrl,
        Integer publishedYear,
        Integer totalCopies,
        Integer availableCopies,
        BigDecimal price,
        Instant createdAt,
        Instant updatedAt
) {
    public static BookResponse from(Book book) {
        return new BookResponse(
                book.getId(),
                book.getTitle(),
                book.getAuthor(),
                book.getIsbn(),
                book.getCategory().getName(),
                book.getDescription(),
                book.getCoverUrl(),
                book.getPublishedYear(),
                book.getTotalCopies(),
                book.getAvailableCopies(),
                book.getPrice(),
                book.getCreatedAt(),
                book.getUpdatedAt()
        );
    }
}
