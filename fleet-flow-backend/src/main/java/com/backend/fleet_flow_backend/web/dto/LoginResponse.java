package com.backend.fleet_flow_backend.web.dto;

public record LoginResponse(String token, UserDto user) {
}
