package com.jamhuriya.library.controller;

import com.jamhuriya.library.dto.PurchaseResponse;
import com.jamhuriya.library.dto.PurchaseRequest;
import jakarta.validation.Valid;
import java.util.List;
import com.jamhuriya.library.dto.PageResponse;
import com.jamhuriya.library.dto.UpdatePurchaseStatusRequest;
import com.jamhuriya.library.entity.PurchaseStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import com.jamhuriya.library.service.PurchaseService;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {
    private final PurchaseService service;
    public PurchaseController(PurchaseService service) { this.service = service; }

    @PostMapping("/{bookId}")
    public ResponseEntity<PurchaseResponse> buy(@PathVariable Long bookId, Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.buy(bookId, authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<List<PurchaseResponse>> buyAll(@Valid @RequestBody PurchaseRequest request,
                                                          Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.buyAll(request, authentication.getName()));
    }

    @GetMapping
    public ResponseEntity<PageResponse<PurchaseResponse>> all(@RequestParam(required = false) PurchaseStatus status,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(service.getAll(status, page, size));
    }

    @GetMapping("/me")
    public ResponseEntity<PageResponse<PurchaseResponse>> mine(Authentication authentication,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "20") @Min(1) @Max(100) int size) {
        return ResponseEntity.ok(service.getMine(authentication.getName(), page, size));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PurchaseResponse> updateStatus(@PathVariable Long id,
            @Valid @RequestBody UpdatePurchaseStatusRequest request) {
        return ResponseEntity.ok(service.updateStatus(id, request));
    }
}
