package com.hdmstuttgart.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.hdmstuttgart.backend.model.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;

import javax.validation.constraints.Size;
import java.util.ArrayList;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "MessageLog")
public class ChatMessage {
    @Id
    private String msgId;
    private String senderName;
    private String receiverName;
    @Size(max = 500)
    private String message;
    private String date;
    @Enumerated(EnumType.STRING)
    private MessageType status;
    @Transient
    private ArrayList<String> onlineUsers;
    @Lob
    private String picture;
}
