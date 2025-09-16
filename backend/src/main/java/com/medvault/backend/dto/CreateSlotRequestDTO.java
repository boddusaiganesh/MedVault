package com.medvault.backend.dto;
import lombok.Data;
import java.time.LocalDateTime;
@Data
public class CreateSlotRequestDTO {
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private int slotDurationMinutes; // e.g., 30
}