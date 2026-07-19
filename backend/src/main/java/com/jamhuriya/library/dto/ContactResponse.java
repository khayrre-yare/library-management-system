package com.jamhuriya.library.dto;

import com.jamhuriya.library.entity.ContactMessage;

import java.time.Instant;

public record ContactResponse(
        Long id,
        String name,
        String email,
        String subject,
        String message,
        boolean read,
        Instant createdAt
) {
    public static ContactResponse from(ContactMessage message) {
        return new ContactResponse(
                message.getId(),
                message.getName(),
                message.getEmail(),
                message.getSubject(),
                message.getMessage(),
                message.isRead(),
                message.getCreatedAt()
        );
    }
}
