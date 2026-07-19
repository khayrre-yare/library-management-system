package com.jamhuriya.library.controller;

import com.jamhuriya.library.dto.UserDashboardResponse;
import com.jamhuriya.library.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<UserDashboardResponse> dashboard(Authentication authentication) {
        return ResponseEntity.ok(dashboardService.getUserDashboard(authentication.getName()));
    }
}
