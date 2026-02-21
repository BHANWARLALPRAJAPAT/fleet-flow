package com.backend.fleet_flow_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.fleet_flow_backend.entities.MaintenanceLog;
import com.backend.fleet_flow_backend.entities.MaintenanceType;
import com.backend.fleet_flow_backend.entities.Vehicle;
import com.backend.fleet_flow_backend.entities.VehicleStatus;
import com.backend.fleet_flow_backend.exception.ResourceNotFoundException;
import com.backend.fleet_flow_backend.repositories.MaintenanceLogRepository;
import com.backend.fleet_flow_backend.repositories.VehicleRepository;
import com.backend.fleet_flow_backend.web.dto.MaintenanceLogDto;

@Service
@Transactional(readOnly = true)
public class MaintenanceService {

    private final MaintenanceLogRepository repo;
    private final VehicleRepository vehicleRepo;

    public MaintenanceService(MaintenanceLogRepository repo, VehicleRepository vehicleRepo) {
        this.repo = repo;
        this.vehicleRepo = vehicleRepo;
    }

    public List<MaintenanceLogDto> findAll(Long vehicleId) {
        if (vehicleId != null) {
            return repo.findByVehicleIdOrderByLogDateDesc(vehicleId)
                    .stream().map(this::toDto).toList();
        }
        return repo.findAll().stream().map(this::toDto).toList();
    }

    @Transactional
    public MaintenanceLogDto create(MaintenanceLogDto dto) {
        Vehicle vehicle = vehicleRepo.findById(dto.vehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", dto.vehicleId()));

        MaintenanceLog log = new MaintenanceLog();
        log.setVehicle(vehicle);
        if (dto.logDate() != null)
            log.setLogDate(dto.logDate());
        if (dto.type() != null) {
            try {
                log.setType(MaintenanceType.valueOf(dto.type().toUpperCase()));
            } catch (IllegalArgumentException ignored) {
            }
        }
        log.setDescription(dto.description());
        if (dto.cost() != null)
            log.setCost(dto.cost());

        // Business rule: logging maintenance puts vehicle IN_SHOP
        vehicle.setStatus(VehicleStatus.IN_SHOP);
        vehicleRepo.save(vehicle);

        return toDto(repo.save(log));
    }

    private MaintenanceLogDto toDto(MaintenanceLog m) {
        return new MaintenanceLogDto(
                m.getId(),
                m.getVehicle().getId(),
                m.getVehicle().getNameModel(),
                m.getLogDate(),
                m.getType().name(),
                m.getDescription(),
                m.getCost(),
                m.getCreatedAt());
    }
}
