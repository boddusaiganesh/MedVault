// src/main/java/com/medvault/backend/dto/AppointmentRequestViewDTO.java
package com.medvault.backend.dto;

import com.medvault.backend.entity.AppointmentStatus;
import com.medvault.backend.entity.RescheduleStatus;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AppointmentRequestViewDTO {
    private Long id;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
    private String notes;
    
    // We will include the patient's name for display on the frontend
    private String patientFirstName;
    private String patientLastName;

       // --- NEW FIELDS ---
    private RescheduleStatus rescheduleStatus;
    private LocalDateTime newlyRequestedTime;
}