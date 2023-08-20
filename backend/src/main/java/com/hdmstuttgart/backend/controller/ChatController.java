package com.hdmstuttgart.backend.controller;

import com.hdmstuttgart.backend.model.ChatMessage;
import com.hdmstuttgart.backend.service.ChatMessageService;
import com.hdmstuttgart.backend.users.Admin;
import com.hdmstuttgart.backend.users.Guest;
import com.hdmstuttgart.backend.users.factories.UserFactory;
import com.hdmstuttgart.backend.users.interfaces.User;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;

@Controller
public class ChatController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ChatController.class);

    private final ChatMessageService chatMessageService;
    private SimpMessagingTemplate simpMessagingTemplate;


    //TODO: Implement a db entry for users etc.
    //String array that saves all the usernames that are currently online
    ArrayList<String> onlineUsers = new ArrayList<String>();
    ArrayList<Admin> onlineAdmins = new ArrayList<Admin>();
    ArrayList<Guest> onlineGuests = new ArrayList<Guest>();

    public ChatController(ChatMessageService chatMessageService, SimpMessagingTemplate simpMessagingTemplate) {
        this.chatMessageService = chatMessageService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @MessageMapping("/message")
    @SendTo("/chatroom/public")
    public ChatMessage receiveMessage(@Payload ChatMessage message){
        if(message.getStatus().toString().equals("JOIN")){

            if(!(message.getSenderName().toString().equals("Server"))){
                User user = UserFactory.createUser(message.getSenderName().toString());

                if(user instanceof Admin){
                    onlineAdmins.add((Admin) user);
                } else {
                    onlineGuests.add((Guest) user);
                }
                onlineUsers.add(message.getSenderName().toString());
                message.setOnlineUsers(onlineUsers);
                message.setMessage(user.joinMessage(message.getSenderName().toString()));
                message.setReceiverName("Server");
                LOGGER.info("Send message as Server to all clients: " + message.getMessage());
            }
        }

        if(message.getStatus().toString().equals("LEAVE")){
            for(int i = 0; i < onlineUsers.size(); i++){
                if(onlineUsers.get(i).equals(message.getSenderName().toString())){
                    onlineUsers.remove(i);
                    message.setOnlineUsers(onlineUsers);
                    LOGGER.info("Following user left the chat: " + message.getSenderName());
                    //TODO: Remove user from onlineAdmins or onlineGuests
                }
            }
        }

        if(message.getStatus().toString().equals("PICTURE")){
            LOGGER.info("Following user transmitted a picture: " + message.getSenderName());
            //TODO: Check for big data so it can fit in the database
        }

        chatMessageService.createChatMessage(message);
        return message;
    }

    @MessageMapping("/private-message")
    public ChatMessage recMessage(@Payload ChatMessage message){
        simpMessagingTemplate.convertAndSendToUser(message.getReceiverName(),"/private",message);
        chatMessageService.createChatMessage(message);
        LOGGER.info("User: [" + message.getSenderName() + "] sent a private message to User [" + message.getReceiverName() + "]: " + message.getMessage());
        return message;
    }
}
