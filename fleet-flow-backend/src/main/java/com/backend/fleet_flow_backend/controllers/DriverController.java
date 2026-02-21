package com.backend.fleet_flow_backend.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.fleet_flow_backend.service.DriverService;
import com.backend.fleet_flow_backend.web.dto.DriverDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService service;

    public DriverController(DriverService service) {
        this.service = service;
    }

    @GetMapping
    public List<DriverDto> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Boolean licenseExpiringSoon) {
        return service.findAll(status, licenseExpiringSoon);
    }

    @GetMapping("/{id}")
    public DriverDto get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DriverDto create(@Valid @RequestBody DriverDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public DriverDto update(@PathVariable Long id, @Valid @RequestBody DriverDto dto) {
        return service.update(id, dto);
    }

    @PatchMapping("/{id}/status")
    public DriverDto changeStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            throw new IllegalArgumentException("status is required");
        }
        return service.changeStatus(id, newStatus);
    }
}
