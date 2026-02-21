package com.backend.fleet_flow_backend.web.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record TripDto(
        Long id,
        String status,
        Long vehicleId,
        String vehicleName,
        Long driverId,
        String driverName,
        String origin,
        String destination,
        BigDecimal cargoWeightKg,
        BigDecimal revenue,
        BigDecimal odometerStartKm,
        BigDecimal odometerEndKm,
        OffsetDateTime dispatchedAt,
        OffsetDateTime completedAt,
        OffsetDateTime cancelledAt,
        OffsetDateTime createdAt) {
}
