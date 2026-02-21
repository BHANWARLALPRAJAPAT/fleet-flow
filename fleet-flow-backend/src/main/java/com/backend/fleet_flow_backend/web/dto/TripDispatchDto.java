package com.backend.fleet_flow_backend.web.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotNull;

public record TripDispatchDto(
        @NotNull(message = "Vehicle ID is required") Long vehicleId,
        @NotNull(message = "Driver ID is required") Long driverId,
        BigDecimal odometerStartKm) {
}
