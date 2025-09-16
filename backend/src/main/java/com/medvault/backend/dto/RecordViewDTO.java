// src/main/java/com/medvault/backend/dto/RecordViewDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class RecordViewDTO {
    private Long id;
    private String recordName;
    private LocalDate recordDate;
    private List<DocumentViewDTO> documents;
}