package com.hdmstuttgart.backend.repository;

import com.hdmstuttgart.backend.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Override
    List<ChatMessage> findAll();
}
