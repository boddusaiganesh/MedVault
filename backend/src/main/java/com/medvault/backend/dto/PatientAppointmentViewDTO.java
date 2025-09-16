// src/main/java/com/medvault/backend/dto/PatientAppointmentViewDTO.java
package com.medvault.backend.dto;

import com.medvault.backend.entity.AppointmentStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class PatientAppointmentViewDTO {
    private Long id;
    private LocalDateTime appointmentDateTime;
    private AppointmentStatus status;
    private String doctorFirstName;
    private String doctorLastName;
    private String doctorSpecialization;
    private boolean hasFeedbackBeenSubmitted; // NEW FIELD
    private Long doctorId; // --- THIS IS THE FIX ---
}