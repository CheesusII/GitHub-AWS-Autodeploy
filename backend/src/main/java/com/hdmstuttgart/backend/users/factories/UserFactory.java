package com.hdmstuttgart.backend.users.factories;
import com.hdmstuttgart.backend.users.Admin;
import com.hdmstuttgart.backend.users.Guest;
import com.hdmstuttgart.backend.users.interfaces.User;
public class UserFactory {
    public static User createUser(String userName) {
        if (userName.startsWith("Admin")) {
            return new Admin();
        } else {
            return new Guest();
        }
    }
}
