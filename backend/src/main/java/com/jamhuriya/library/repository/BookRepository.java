package com.jamhuriya.library.repository;

import com.jamhuriya.library.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Lock;
import jakarta.persistence.LockModeType;

import java.util.Optional;

public interface BookRepository extends JpaRepository<Book, Long> {

    Optional<Book> findByIsbnIgnoreCase(String isbn);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT b FROM Book b WHERE b.id = :id")
    Optional<Book> findByIdForUpdate(@Param("id") Long id);

    boolean existsByIsbnIgnoreCase(String isbn);

    @Query("""
        SELECT b
        FROM Book b
        WHERE (
            :search = ''
            OR LOWER(b.title) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(b.author) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        AND (
            :category = ''
            OR LOWER(b.category.name) = LOWER(:category)
        )
        """)
    Page<Book> search(
            @Param("search") String search,
            @Param("category") String category,
            Pageable pageable
    );
    @Query("SELECT COALESCE(SUM(b.availableCopies), 0) FROM Book b")
    long countAvailableCopies();
}
