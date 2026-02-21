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

import com.backend.fleet_flow_backend.service.ExpenseService;
import com.backend.fleet_flow_backend.web.dto.ExpenseDto;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    @GetMapping
    public List<ExpenseDto> list(
            @RequestParam(required = false) Long vehicleId,
            @RequestParam(required = false) Long tripId,
            @RequestParam(required = false) String type) {
        return service.findAll(vehicleId, tripId, type);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseDto create(@Valid @RequestBody ExpenseDto dto) {
        return service.create(dto);
    }
}
