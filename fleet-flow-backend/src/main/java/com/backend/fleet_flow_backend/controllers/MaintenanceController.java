package com.backend.fleet_flow_backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.fleet_flow_backend.service.MaintenanceService;
import com.backend.fleet_flow_backend.web.dto.MaintenanceLogDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    private final MaintenanceService service;

    public MaintenanceController(MaintenanceService service) {
        this.service = service;
    }

    @GetMapping
    public List<MaintenanceLogDto> list(@RequestParam(required = false) Long vehicleId) {
        return service.findAll(vehicleId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceLogDto create(@Valid @RequestBody MaintenanceLogDto dto) {
        return service.create(dto);
    }
}
