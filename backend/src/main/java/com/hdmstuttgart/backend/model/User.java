package com.hdmstuttgart.backend.model;


import com.hdmstuttgart.backend.model.enums.UserRole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import javax.validation.constraints.Email;
import javax.validation.constraints.Size;
import java.util.Date;


/**
 * Defines a user with its properties.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "users")
public class User /*implements UserDetails */{

    @Id
    @GeneratedValue
    private Long id;

    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @Size(min = 8)
    @Column(nullable = false)
    private String password;

    private String username;

    @CreationTimestamp
    private Date createdAt;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    //Security changes for future purpose
/*    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }*/
}

