package com.backend.fleet_flow_backend.web.dto;

public record PerformanceSummaryDto(
        String fleetUtilization,
        String onTimeDeliveryRate,
        long totalTrips,
        long completedTrips,
        long cancelledTrips,
        long activeDrivers) {
}
