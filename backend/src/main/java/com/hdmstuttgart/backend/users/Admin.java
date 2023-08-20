package com.hdmstuttgart.backend.users;

import com.hdmstuttgart.backend.users.interfaces.User;

public class Admin implements User {
    @Override
    public String joinMessage(String userName) {
        return "Team Member " + userName + " joined the room!";
    }

}
