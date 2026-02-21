package com.backend.fleet_flow_backend.web.dto;

public record DashboardKpiDto(
        long activeFleet,
        long maintenanceAlerts,
        String utilizationRate,
        long pendingCargo) {
}
