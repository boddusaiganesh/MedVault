// src/main/java/com/medvault/backend/dto/CreateRecordRequestDTO.java
package com.medvault.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateRecordRequestDTO {
    private String recordName;
    private LocalDate recordDate;
}