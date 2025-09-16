// src/main/java/com/medvault/backend/dto/PatientDashboardStatsDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class PatientDashboardStatsDTO {
    // This is more efficient than making two separate API calls
    private boolean profileComplete;
    private long upcomingAppointments;
    private long medicalRecordsCount;
}