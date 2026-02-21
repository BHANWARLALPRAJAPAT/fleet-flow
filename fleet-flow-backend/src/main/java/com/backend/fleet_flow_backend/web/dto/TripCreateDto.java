package com.backend.fleet_flow_backend.web.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record TripCreateDto(
        @NotBlank(message = "Origin is required") String origin,
        @NotBlank(message = "Destination is required") String destination,
        @NotNull(message = "Cargo weight is required") @PositiveOrZero(message = "Cargo weight must be >= 0") BigDecimal cargoWeightKg,
        Long vehicleId,
        Long driverId) {
}
