package com.hdmstuttgart.backend.model;

import com.hdmstuttgart.backend.model.enums.MessageType;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
public class ChatMessage {
    private String senderName;
    private String receiverName;
    private String message;
    private String date;
    private MessageType status;
}
