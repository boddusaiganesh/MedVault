// src/main/java/com/medvault/backend/dto/DocumentViewDTO.java
package com.medvault.backend.dto;

import com.medvault.backend.entity.VerificationStatus;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class DocumentViewDTO {
    private Long id;
    private String documentName;
    private LocalDateTime uploadedAt;
    private VerificationStatus verificationStatus;
    private String doctorNotes;
}