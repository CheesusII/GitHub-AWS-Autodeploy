package com.hdmstuttgart.backend.service;

import com.hdmstuttgart.backend.controller.ChatController;
import com.hdmstuttgart.backend.model.ChatMessage;
import com.hdmstuttgart.backend.repository.ChatMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatController.class);

    public ChatMessageService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public ChatMessage createChatMessage(ChatMessage chatMessage) {
        LOGGER.warn("Created new database entry at table message_log --- Caution database is not properly implemented yet! Some fields might be null!");
        return chatMessageRepository.save(chatMessage);
    }
}
