package com.backend.fleet_flow_backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.fleet_flow_backend.service.PerformanceService;
import com.backend.fleet_flow_backend.web.dto.PerformanceSummaryDto;

@RestController
@RequestMapping("/api/performance")
public class PerformanceController {

    private final PerformanceService service;

    public PerformanceController(PerformanceService service) {
        this.service = service;
    }

    @GetMapping("/summary")
    public PerformanceSummaryDto getSummary() {
        return service.getSummary();
    }
}
