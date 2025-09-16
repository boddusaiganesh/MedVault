// src/main/java/com/medvault/backend/repository/DoctorAvailabilitySlotRepository.java
package com.medvault.backend.repository;

import com.medvault.backend.entity.DoctorAvailabilitySlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.medvault.backend.entity.Doctor;
import java.util.List;

@Repository
public interface DoctorAvailabilitySlotRepository extends JpaRepository<DoctorAvailabilitySlot, Long> {
    // We can add custom query methods here later if needed
    List<DoctorAvailabilitySlot> findByDoctorAndIsBooked(Doctor doctor, boolean isBooked);
}