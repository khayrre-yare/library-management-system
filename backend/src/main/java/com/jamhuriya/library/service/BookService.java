package com.jamhuriya.library.service;

import com.jamhuriya.library.dto.BookRequest;
import com.jamhuriya.library.dto.BookResponse;
import com.jamhuriya.library.dto.PageResponse;
import com.jamhuriya.library.entity.Book;
import com.jamhuriya.library.entity.BorrowingStatus;
import com.jamhuriya.library.entity.Category;
import com.jamhuriya.library.exception.BadRequestException;
import com.jamhuriya.library.exception.ResourceNotFoundException;
import com.jamhuriya.library.repository.BookRepository;
import com.jamhuriya.library.repository.BorrowingRepository;
import com.jamhuriya.library.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class BookService {

    private static final Set<BorrowingStatus> ACTIVE_STATUSES =
            Set.of(
                    BorrowingStatus.PENDING,
                    BorrowingStatus.APPROVED
            );

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowingRepository borrowingRepository;

    public BookService(
            BookRepository bookRepository,
            CategoryRepository categoryRepository,
            BorrowingRepository borrowingRepository
    ) {
        this.bookRepository = bookRepository;
        this.categoryRepository = categoryRepository;
        this.borrowingRepository = borrowingRepository;
    }

    @Transactional(readOnly = true)
    public PageResponse<BookResponse> listBooks(
            String search,
            String category,
            int page,
            int size
    ) {
        String normalizedSearch = normalizeFilter(search);
        String normalizedCategory = normalizeFilter(category);

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Book> result = bookRepository.search(
                normalizedSearch,
                normalizedCategory,
                pageable
        );

        return PageResponse.from(result, BookResponse::from);
    }

    @Transactional(readOnly = true)
    public BookResponse getBook(Long id) {
        return BookResponse.from(findBook(id));
    }

    @Transactional(readOnly = true)
    public List<String> getCategories() {
        return categoryRepository.findAllByOrderByNameAsc()
                .stream()
                .map(Category::getName)
                .toList();
    }

    @Transactional
    public BookResponse createBook(BookRequest request) {
        String isbn = request.isbn().trim();

        if (bookRepository.existsByIsbnIgnoreCase(isbn)) {
            throw new BadRequestException(
                    "A book with this ISBN already exists"
            );
        }

        Book book = new Book();

        applyRequest(book, request);
        book.setAvailableCopies(request.totalCopies());

        Book savedBook = bookRepository.save(book);

        return BookResponse.from(savedBook);
    }

    @Transactional
    public BookResponse updateBook(Long id, BookRequest request) {
        Book book = findBook(id);
        String isbn = request.isbn().trim();

        bookRepository.findByIsbnIgnoreCase(isbn)
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> {
                    throw new BadRequestException(
                            "A book with this ISBN already exists"
                    );
                });

        int borrowedCopies =
                book.getTotalCopies() - book.getAvailableCopies();

        if (request.totalCopies() < borrowedCopies) {
            throw new BadRequestException(
                    "Total copies cannot be lower than the number " +
                            "of currently borrowed copies"
            );
        }

        applyRequest(book, request);

        book.setAvailableCopies(
                request.totalCopies() - borrowedCopies
        );

        Book updatedBook = bookRepository.save(book);

        return BookResponse.from(updatedBook);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = findBook(id);

        boolean hasActiveBorrowings =
                borrowingRepository.existsByBookIdAndStatusIn(
                        id,
                        ACTIVE_STATUSES
                );

        if (hasActiveBorrowings) {
            throw new BadRequestException(
                    "This book has pending or active borrowings " +
                            "and cannot be deleted"
            );
        }

        bookRepository.delete(book);
    }

    Book findBook(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(
                        () -> new ResourceNotFoundException(
                                "Book not found"
                        )
                );
    }

    private void applyRequest(Book book, BookRequest request) {
        book.setTitle(request.title().trim());
        book.setAuthor(request.author().trim());
        book.setIsbn(request.isbn().trim());

        book.setCategory(
                findOrCreateCategory(request.category())
        );

        book.setDescription(
                normalizeOptional(request.description())
        );

        book.setCoverUrl(
                normalizeOptional(request.coverUrl())
        );

        book.setPublishedYear(request.publishedYear());
        book.setTotalCopies(request.totalCopies());
        book.setPrice(request.price());
    }

    private Category findOrCreateCategory(String categoryName) {
        String normalizedCategoryName = categoryName.trim();

        return categoryRepository
                .findByNameIgnoreCase(normalizedCategoryName)
                .orElseGet(() -> {
                    Category category = new Category();
                    category.setName(normalizedCategoryName);

                    return categoryRepository.save(category);
                });
    }

    private String normalizeOptional(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String normalizeFilter(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }

        return value.trim();
    }
}
