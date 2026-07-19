package com.jamhuriya.library.controller;

import com.jamhuriya.library.dto.BorrowRequest;
import com.jamhuriya.library.dto.BorrowingResponse;
import com.jamhuriya.library.dto.PageResponse;
import com.jamhuriya.library.dto.UpdateBorrowingStatusRequest;
import com.jamhuriya.library.entity.BorrowingStatus;
import com.jamhuriya.library.service.BorrowingService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Validated
@RestController
@RequestMapping("/api/borrowings")
public class BorrowingController {

    private final BorrowingService borrowingService;

    public BorrowingController(BorrowingService borrowingService) {
        this.borrowingService = borrowingService;
    }

    @PostMapping
    public ResponseEntity<List<BorrowingResponse>> create(
            @Valid @RequestBody BorrowRequest request,
            Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(borrowingService.createRequests(request, authentication.getName()));
    }

    @GetMapping("/me")
    public ResponseEntity<PageResponse<BorrowingResponse>> mine(
            Authentication authentication,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(
                borrowingService.getMine(authentication.getName(), page, size)
        );
    }

    @GetMapping
    public ResponseEntity<PageResponse<BorrowingResponse>> all(
            @RequestParam(required = false) BorrowingStatus status,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(borrowingService.getAll(status, page, size));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BorrowingResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateBorrowingStatusRequest request) {
        return ResponseEntity.ok(borrowingService.updateStatus(id, request));
    }
}
