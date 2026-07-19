package com.jamhuriya.library.dto;

import java.util.List;

public record AdminDashboardResponse(
        long totalBooks,
        long totalMembers,
        long activeLoans,
        long pendingRequests,
        long unreadMessages,
        long availableCopies,
        List<BorrowingResponse> recentBorrowings
) {
}
