package com.jamhuriya.library.dto;

import java.util.List;

public record UserDashboardResponse(
        long activeLoans,
        long pendingRequests,
        long overdueLoans,
        long totalHistory,
        List<BorrowingResponse> recentBorrowings
) {
}
