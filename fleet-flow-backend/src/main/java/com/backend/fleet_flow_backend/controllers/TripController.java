package com.backend.fleet_flow_backend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.backend.fleet_flow_backend.service.TripService;
import com.backend.fleet_flow_backend.web.dto.TripCompleteDto;
import com.backend.fleet_flow_backend.web.dto.TripCreateDto;
import com.backend.fleet_flow_backend.web.dto.TripDispatchDto;
import com.backend.fleet_flow_backend.web.dto.TripDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService service;

    public TripController(TripService service) {
        this.service = service;
    }

    @GetMapping
    public List<TripDto> list(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) Long driverId) {
        return service.findAll(status, vehicleId, driverId);
    }

    @GetMapping("/{id}")
    public TripDto get(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TripDto create(@Valid @RequestBody TripCreateDto dto) {
        return service.create(dto);
    }

    @PostMapping("/{id}/dispatch")
    public TripDto dispatch(@PathVariable Long id, @Valid @RequestBody TripDispatchDto dto) {
        return service.dispatch(id, dto);
    }

    @PostMapping("/{id}/complete")
    public TripDto complete(@PathVariable Long id, @RequestBody(required = false) TripCompleteDto dto) {
        return service.complete(id, dto);
    }

    @PostMapping("/{id}/cancel")
    public TripDto cancel(@PathVariable Long id) {
        return service.cancel(id);
    }
}
