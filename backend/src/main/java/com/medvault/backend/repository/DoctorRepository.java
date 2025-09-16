// src/main/java/com/medvault/backend/repository/DoctorRepository.java
package com.medvault.backend.repository;

import com.medvault.backend.entity.Doctor;
import com.medvault.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUser(User user);
}