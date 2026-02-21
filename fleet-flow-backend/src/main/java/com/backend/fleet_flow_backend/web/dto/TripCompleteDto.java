package com.backend.fleet_flow_backend.web.dto;

import java.math.BigDecimal;

public record TripCompleteDto(
        BigDecimal odometerEndKm,
        BigDecimal revenue) {
}
