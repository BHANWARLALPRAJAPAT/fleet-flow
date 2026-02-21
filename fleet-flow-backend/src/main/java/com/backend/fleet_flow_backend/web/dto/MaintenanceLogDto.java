package com.backend.fleet_flow_backend.web.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record MaintenanceLogDto(
        Long id,
        @NotNull(message = "Vehicle ID is required") Long vehicleId,
        String vehicleName,
        LocalDate logDate,
        @NotNull(message = "Maintenance type is required") String type,
        String description,
        @PositiveOrZero(message = "Cost must be >= 0") BigDecimal cost,
        OffsetDateTime createdAt) {
}
