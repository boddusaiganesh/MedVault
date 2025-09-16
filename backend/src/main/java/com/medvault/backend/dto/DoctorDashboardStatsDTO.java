// src/main/java/com/medvault/backend/dto/DoctorDashboardStatsDTO.java
package com.medvault.backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class DoctorDashboardStatsDTO {
    private boolean profileComplete;
    private String verificationStatus;
    private long pendingAppointmentRequests;
    private long upcomingAppointments;
}