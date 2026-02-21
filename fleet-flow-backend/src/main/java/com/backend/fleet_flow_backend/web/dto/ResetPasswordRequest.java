package com.backend.fleet_flow_backend.web.dto;

public record ResetPasswordRequest(String token, String newPassword) {
}
