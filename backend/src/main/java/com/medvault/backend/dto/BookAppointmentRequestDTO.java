// src/main/java/com/medvault/backend/dto/BookAppointmentRequestDTO.java
package com.medvault.backend.dto;

import lombok.Data;

@Data
public class BookAppointmentRequestDTO {
    private Long slotId;
    private String notes; // Optional reason for visit
}