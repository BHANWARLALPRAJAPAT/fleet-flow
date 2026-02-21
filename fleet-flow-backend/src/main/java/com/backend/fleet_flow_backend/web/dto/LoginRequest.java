package com.backend.fleet_flow_backend.web.dto;

public record LoginRequest(String email, String password, String role) {
}
