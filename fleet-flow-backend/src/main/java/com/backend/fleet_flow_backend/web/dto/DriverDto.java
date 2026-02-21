package com.backend.fleet_flow_backend.web.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record DriverDto(
        Long id,
        @NotBlank(message = "Full name is required") String fullName,
        String phone,
        @NotBlank(message = "License number is required") String licenseNo,
        @NotNull(message = "License expiry is required") LocalDate licenseExpiry,
        String licenseCategory,
        BigDecimal safetyScore,
        String status) {
}
