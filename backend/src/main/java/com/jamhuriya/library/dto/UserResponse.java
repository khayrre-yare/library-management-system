package com.jamhuriya.library.dto;

import com.jamhuriya.library.entity.AppUser;
import com.jamhuriya.library.entity.Role;

public record UserResponse(Long id, String fullName, String email, Role role) {
    public static UserResponse from(AppUser user) {
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }
}
