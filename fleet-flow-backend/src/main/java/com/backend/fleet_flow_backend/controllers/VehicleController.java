package com.backend.fleet_flow_backend.controllers;

import java.util.List;

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

import com.backend.fleet_flow_backend.service.VehicleService;
import com.backend.fleet_flow_backend.web.dto.VehicleDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService service;

    public VehicleController(VehicleService service) {
        this.service = service;
    }

    @GetMapping
    public List<VehicleDto> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String region) {
        return service.findAll(status, type, region);
    }

    @GetMapping("/{id}")
    public VehicleDto get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public VehicleDto create(@Valid @RequestBody VehicleDto dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public VehicleDto update(@PathVariable Long id, @Valid @RequestBody VehicleDto dto) {
        return service.update(id, dto);
    }

    @PatchMapping("/{id}/retire")
    public VehicleDto retire(@PathVariable Long id) {
        return service.retire(id);
    }
}
