package com.jamhuriya.library.config;

import com.jamhuriya.library.entity.AppUser;
import com.jamhuriya.library.entity.Role;
import com.jamhuriya.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminName;
    private final String adminEmail;
    private final String adminPassword;

    public DataInitializer(UserRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.bootstrap.admin.name}") String adminName,
                           @Value("${app.bootstrap.admin.email}") String adminEmail,
                           @Value("${app.bootstrap.admin.password}") String adminPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminName = adminName;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Async
    @EventListener(ApplicationReadyEvent.class)
    public void initializeAdmin() {
        if (userRepository.existsByEmailIgnoreCase(adminEmail)) {
            return;
        }

        AppUser admin = new AppUser();
        admin.setFullName(adminName.trim());
        admin.setEmail(adminEmail.trim().toLowerCase());
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        userRepository.save(admin);
    }
}
