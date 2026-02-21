package com.backend.fleet_flow_backend.web.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record VehicleDto(
        Long id,
        @NotBlank(message = "Name/model is required") String nameModel,
        @NotBlank(message = "License plate is required") String licensePlate,
        @NotNull(message = "Vehicle type is required") String type,
        String region,
        @NotNull(message = "Max capacity is required") @Positive(message = "Max capacity must be positive") BigDecimal maxCapacityKg,
        BigDecimal odometerKm,
        String status,
        Boolean isRetired,
        BigDecimal acquisitionCost,
        LocalDate acquisitionDate) {
}
