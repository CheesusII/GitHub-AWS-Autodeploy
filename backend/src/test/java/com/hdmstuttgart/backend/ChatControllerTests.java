package com.hdmstuttgart.backend;

import com.hdmstuttgart.backend.model.enums.MessageType;
import com.hdmstuttgart.backend.service.ChatMessageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import com.hdmstuttgart.backend.controller.ChatController;
import com.hdmstuttgart.backend.model.ChatMessage;
import com.hdmstuttgart.backend.service.ChatMessageService;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ChatControllerTests {

    private ChatController chatController;
    private ChatMessageService chatMessageService;
    private SimpMessagingTemplate simpMessagingTemplate;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.initMocks(this);
        chatMessageService = mock(ChatMessageService.class);
        simpMessagingTemplate = mock(SimpMessagingTemplate.class);
        chatController = new ChatController(chatMessageService, simpMessagingTemplate);
        chatController.onlineUsers = new ArrayList<>();
    }

    @Test
    public void testReceiveMessage() {

        // Create and set up regular test message
        ChatMessage message = new ChatMessage();
        message.setSenderName("Max");
        message.setReceiverName("Mustermann");
        message.setMessage("Ich bin ein Max");
        message.setDate("heute");
        message.setStatus(MessageType.MESSAGE);

        ChatMessage returnedMessage = chatController.receiveMessage(message);

        // Verify that the message is returned
        assertEquals(message, returnedMessage);

        // Verify that SimpMessagingTemplate's convertAndSendToUser method was not called (not private message)
        verifyNoInteractions(simpMessagingTemplate);
    }

    @Test
    public void testRecMessage() {

        // Create and set up regular test message
        ChatMessage message = new ChatMessage();
        message.setSenderName("Max");
        message.setReceiverName("Mustermann");
        message.setMessage("Ich bin ein Max");
        message.setDate("heute");
        message.setStatus(MessageType.MESSAGE);

        ChatMessage recmessage = chatController.recMessage(message);

        // Verify that SimpMessagingTemplate's convertAndSendToUser method was called with the expected arguments
        verify(simpMessagingTemplate).convertAndSendToUser(
                message.getReceiverName(),
                "/private",
                message
        );

        // Verify that the message is returned
        assertEquals(message, recmessage);
    }

    @Test
    public void testJoinAndLeaveMessage() {

        // Create and send test message for joining
        ChatMessage message1 = new ChatMessage();
        message1.setSenderName("Join Wick");
        message1.setStatus(MessageType.JOIN);
        chatController.receiveMessage(message1);

        // Verify that the sender name is added into onlineUsers list
        assert(chatController.onlineUsers.contains("Join Wick"));

        // Create and semd test message for leaving
        ChatMessage message2 = new ChatMessage();
        message2.setSenderName("Join Wick");
        message2.setStatus(MessageType.LEAVE);
        chatController.receiveMessage(message2);

        // Verify that the send name is removed from onlineUsers list
        assertFalse(chatController.onlineUsers.contains("Join Wick"));

        // Verify that SimpMessagingTemplate's convertAndSendToUser method was not called (not private message)
        verifyNoInteractions(simpMessagingTemplate);
    }

    @Test
    public void testReceivePicture() {

        // Create and set up regular test message
        ChatMessage message = new ChatMessage();
        message.setSenderName("Max");
        message.setReceiverName("Mustermann");
        message.setPicture("base64encodedimage");
        message.setDate("heute");
        message.setStatus(MessageType.PICTURE);

        ChatMessage returnedMessage = chatController.receiveMessage(message);

        // Verify that the message is returned
        assertEquals(message, returnedMessage);

        // Verify that SimpMessagingTemplate's convertAndSendToUser method was not called (not private message)
        verifyNoInteractions(simpMessagingTemplate);
    }
}

