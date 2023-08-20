package com.hdmstuttgart.backend;

import com.hdmstuttgart.backend.model.enums.MessageType;
import com.hdmstuttgart.backend.model.ChatMessage;
import org.junit.jupiter.api.Test;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;

public class ChatMessageTest {

    @Test
    public void testNoArgsConstructor() {
        ChatMessage chatMessage = new ChatMessage();
        assertNotNull(chatMessage);
    }

    @Test
    public void testAllArgsConstructor() {
        String msgId = "123456789";
        String senderName = "Max Mustermann";
        String receiverName = "Join Wick";
        String message = "Ich bin ein Max";
        String date = "heute";
        MessageType status = MessageType.MESSAGE;
        ArrayList<String> onlineUsers = new ArrayList<>();
        onlineUsers.add("Max Mustermann");
        onlineUsers.add("Join Wick");
        String picture = "base64encodedimage";

        ChatMessage chatMessage = new ChatMessage(msgId, senderName, receiverName, message, date, status, onlineUsers, picture);

        assertNotNull(chatMessage);
        assertEquals(msgId, chatMessage.getMsgId());
        assertEquals(senderName, chatMessage.getSenderName());
        assertEquals(receiverName, chatMessage.getReceiverName());
        assertEquals(message, chatMessage.getMessage());
        assertEquals(date, chatMessage.getDate());
        assertEquals(status, chatMessage.getStatus());
        assertEquals(onlineUsers, chatMessage.getOnlineUsers());
        assertEquals(picture, chatMessage.getPicture());
    }

    @Test
    public void testGettersAndSetters() {
        ChatMessage chatMessage = new ChatMessage();

        // Use setters to set values
        chatMessage.setMsgId("123456789");
        chatMessage.setSenderName("Max Mustermann");
        chatMessage.setReceiverName("Join Wick");
        chatMessage.setMessage("Ich bin ein Max");
        chatMessage.setDate("heute");
        chatMessage.setStatus(MessageType.MESSAGE);
        chatMessage.setOnlineUsers(new ArrayList<>());
        chatMessage.getOnlineUsers().add("Max Mustermann");
        chatMessage.getOnlineUsers().add("Join Wick");
        chatMessage.setPicture("base64encodedimage");

        // Use getters to verify that the values are correct
        assertEquals("123456789", chatMessage.getMsgId());
        assertEquals("Max Mustermann", chatMessage.getSenderName());
        assertEquals("Join Wick", chatMessage.getReceiverName());
        assertEquals("Ich bin ein Max", chatMessage.getMessage());
        assertEquals("heute", chatMessage.getDate());
        assertEquals(MessageType.MESSAGE, chatMessage.getStatus());
        assertEquals(2, chatMessage.getOnlineUsers().size());
        assertEquals("Max Mustermann", chatMessage.getOnlineUsers().get(0));
        assertEquals("base64encodedimage", chatMessage.getPicture());
    }

    @Test
    public void testToString() {
        ChatMessage chatMessage = new ChatMessage("123456789","Max Mustermann", "Join Wick", "Ich bin ein Max", "heute",
                MessageType.MESSAGE, new ArrayList<>(), "base64encodedimage");

        String expectedToString = "ChatMessage(msgId=123456789, senderName=Max Mustermann, receiverName=Join Wick, message=Ich bin ein Max, " +
                "date=heute, status=MESSAGE, onlineUsers=[], picture=base64encodedimage)";

        assertEquals(expectedToString, chatMessage.toString());
    }
}

