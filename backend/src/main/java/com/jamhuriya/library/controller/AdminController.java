package com.jamhuriya.library.controller;

import com.jamhuriya.library.dto.AdminDashboardResponse;
import com.jamhuriya.library.dto.AdminNotificationResponse;
import com.jamhuriya.library.service.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final DashboardService dashboardService;

    public AdminController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> dashboard() {
        return ResponseEntity.ok(dashboardService.getAdminDashboard());
    }

    @GetMapping("/notifications")
    public ResponseEntity<AdminNotificationResponse> notifications() {
        return ResponseEntity.ok(dashboardService.getNotifications());
    }
}
