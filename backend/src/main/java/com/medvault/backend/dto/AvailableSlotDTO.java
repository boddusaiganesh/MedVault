// src/main/java/com/medvault/backend/dto/AvailableSlotDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AvailableSlotDTO {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}