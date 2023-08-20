package com.hdmstuttgart.backend.users;

import com.hdmstuttgart.backend.users.interfaces.User;

public class Guest implements User {
    @Override
    public String joinMessage(String userName) {
        return "Guest " + userName + " joined the room!";
    }
}
