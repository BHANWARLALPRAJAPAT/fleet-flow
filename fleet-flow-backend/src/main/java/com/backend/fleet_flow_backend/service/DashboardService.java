package com.backend.fleet_flow_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.fleet_flow_backend.entities.TripStatus;
import com.backend.fleet_flow_backend.entities.VehicleStatus;
import com.backend.fleet_flow_backend.repositories.TripRepository;
import com.backend.fleet_flow_backend.repositories.VehicleRepository;
import com.backend.fleet_flow_backend.web.dto.DashboardKpiDto;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final VehicleRepository vehicleRepo;
    private final TripRepository tripRepo;

    public DashboardService(VehicleRepository vehicleRepo, TripRepository tripRepo) {
        this.vehicleRepo = vehicleRepo;
        this.tripRepo = tripRepo;
    }

    public DashboardKpiDto getKpis() {
        long totalVehicles = vehicleRepo.countByIsRetiredFalse();
        long inShop = vehicleRepo.countByStatus(VehicleStatus.IN_SHOP);
        long onTrip = vehicleRepo.countByStatus(VehicleStatus.ON_TRIP);
        long pendingCargo = tripRepo.countByStatus(TripStatus.DRAFT);

        String utilization = totalVehicles > 0
                ? String.format("%.0f%%", (double) onTrip / totalVehicles * 100)
                : "0%";

        return new DashboardKpiDto(totalVehicles - inShop, inShop, utilization, pendingCargo);
    }
}
