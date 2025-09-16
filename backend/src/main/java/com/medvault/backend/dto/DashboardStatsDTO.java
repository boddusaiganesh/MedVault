// src/main/java/com/medvault/backend/dto/DashboardStatsDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DashboardStatsDTO {
    
    private long pendingPatientRequests;
    private long pendingDoctorRequests;
    private long pendingDoctorVerifications;
    private long totalPatients; // NEW
    private long totalDoctors;  // NEW
}