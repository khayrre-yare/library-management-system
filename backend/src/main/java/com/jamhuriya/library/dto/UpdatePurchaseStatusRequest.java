package com.jamhuriya.library.dto;

import com.jamhuriya.library.entity.PurchaseStatus;
import jakarta.validation.constraints.NotNull;

public record UpdatePurchaseStatusRequest(@NotNull PurchaseStatus status) {}
