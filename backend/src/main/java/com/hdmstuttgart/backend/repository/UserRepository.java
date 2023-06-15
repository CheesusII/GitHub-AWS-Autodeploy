package com.hdmstuttgart.backend.repository;

import com.hdmstuttgart.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface UserRepository extends JpaRepository<User, Long>{
    @Override
    List<User> findAll();
}
