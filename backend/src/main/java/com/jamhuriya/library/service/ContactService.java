package com.jamhuriya.library.service;

import com.jamhuriya.library.dto.ContactRequest;
import com.jamhuriya.library.dto.ContactResponse;
import com.jamhuriya.library.dto.PageResponse;
import com.jamhuriya.library.entity.ContactMessage;
import com.jamhuriya.library.exception.ResourceNotFoundException;
import com.jamhuriya.library.repository.ContactMessageRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {

    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @Transactional
    public ContactResponse create(ContactRequest request) {
        ContactMessage message = new ContactMessage();
        message.setName(request.name().trim());
        message.setEmail(request.email().trim().toLowerCase());
        message.setSubject(request.subject().trim());
        message.setMessage(request.message().trim());
        return ContactResponse.from(contactMessageRepository.save(message));
    }

    @Transactional(readOnly = true)
    public PageResponse<ContactResponse> list(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ContactMessage> result = contactMessageRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PageResponse.from(result, ContactResponse::from);
    }

    @Transactional
    public ContactResponse markRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found"));
        message.setRead(true);
        return ContactResponse.from(contactMessageRepository.save(message));
    }
}
