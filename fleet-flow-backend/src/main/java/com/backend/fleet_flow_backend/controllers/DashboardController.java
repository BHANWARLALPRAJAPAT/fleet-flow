package com.backend.fleet_flow_backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.fleet_flow_backend.service.DashboardService;
import com.backend.fleet_flow_backend.web.dto.DashboardKpiDto;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService service;

    public DashboardController(DashboardService service) {
        this.service = service;
    }

    @GetMapping("/kpis")
    public DashboardKpiDto getKpis() {
        return service.getKpis();
    }
}
