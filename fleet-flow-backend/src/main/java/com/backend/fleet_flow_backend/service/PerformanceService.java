package com.backend.fleet_flow_backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.fleet_flow_backend.entities.DriverStatus;
import com.backend.fleet_flow_backend.entities.TripStatus;
import com.backend.fleet_flow_backend.repositories.DriverRepository;
import com.backend.fleet_flow_backend.repositories.TripRepository;
import com.backend.fleet_flow_backend.repositories.VehicleRepository;
import com.backend.fleet_flow_backend.web.dto.PerformanceSummaryDto;

@Service
@Transactional(readOnly = true)
public class PerformanceService {

    private final TripRepository tripRepo;
    private final DriverRepository driverRepo;
    private final VehicleRepository vehicleRepo;

    public PerformanceService(TripRepository tripRepo, DriverRepository driverRepo, VehicleRepository vehicleRepo) {
        this.tripRepo = tripRepo;
        this.driverRepo = driverRepo;
        this.vehicleRepo = vehicleRepo;
    }

    public PerformanceSummaryDto getSummary() {
        long totalTrips = tripRepo.count();
        long completed = tripRepo.countByStatus(TripStatus.COMPLETED);
        long cancelled = tripRepo.countByStatus(TripStatus.CANCELLED);
        long activeDrivers = driverRepo.countByStatus(DriverStatus.ON_DUTY);
        long totalVehicles = vehicleRepo.countByIsRetiredFalse();
        long onTrip = tripRepo.countByStatus(TripStatus.DISPATCHED);

        String utilization = totalVehicles > 0
                ? String.format("%.1f%%", (double) onTrip / totalVehicles * 100)
                : "0%";
        String onTimeRate = totalTrips > 0
                ? String.format("%.1f%%", (double) completed / totalTrips * 100)
                : "0%";

        return new PerformanceSummaryDto(utilization, onTimeRate, totalTrips, completed, cancelled, activeDrivers);
    }
}
