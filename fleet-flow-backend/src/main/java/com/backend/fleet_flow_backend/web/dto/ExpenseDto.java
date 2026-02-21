package com.backend.fleet_flow_backend.web.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ExpenseDto(
        Long id,
        @NotNull(message = "Vehicle ID is required") Long vehicleId,
        String vehicleName,
        Long tripId,
        @NotNull(message = "Expense type is required") String type,
        BigDecimal liters,
        @NotNull(message = "Amount is required") @Positive(message = "Amount must be positive") BigDecimal amount,
        OffsetDateTime expTs,
        BigDecimal odometerKm,
        String description,
        OffsetDateTime createdAt) {
}
