package com.backend.fleet_flow_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.fleet_flow_backend.entities.Expense;
import com.backend.fleet_flow_backend.entities.ExpenseType;
import com.backend.fleet_flow_backend.entities.Vehicle;
import com.backend.fleet_flow_backend.exception.ResourceNotFoundException;
import com.backend.fleet_flow_backend.repositories.ExpenseRepository;
import com.backend.fleet_flow_backend.repositories.TripRepository;
import com.backend.fleet_flow_backend.repositories.VehicleRepository;
import com.backend.fleet_flow_backend.web.dto.ExpenseDto;

@Service
@Transactional(readOnly = true)
public class ExpenseService {

    private final ExpenseRepository repo;
    private final VehicleRepository vehicleRepo;
    private final TripRepository tripRepo;

    public ExpenseService(ExpenseRepository repo, VehicleRepository vehicleRepo, TripRepository tripRepo) {
        this.repo = repo;
        this.vehicleRepo = vehicleRepo;
        this.tripRepo = tripRepo;
    }

    public List<ExpenseDto> findAll(Long vehicleId, Long tripId, String type) {
        ExpenseType et = null;
        if (type != null && !type.isBlank()) {
            try {
                et = ExpenseType.valueOf(type.toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }
        return repo.findFiltered(vehicleId, tripId, et)
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public ExpenseDto create(ExpenseDto dto) {
        Vehicle vehicle = vehicleRepo.findById(dto.vehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", dto.vehicleId()));

        Expense exp = new Expense();
        exp.setVehicle(vehicle);
        if (dto.tripId() != null) {
            exp.setTrip(tripRepo.findById(dto.tripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip", dto.tripId())));
        }
        if (dto.type() != null) {
            try {
                exp.setType(ExpenseType.valueOf(dto.type().toUpperCase()));
            } catch (IllegalArgumentException ignored) {
            }
        }
        exp.setLiters(dto.liters());
        exp.setAmount(dto.amount());
        if (dto.expTs() != null)
            exp.setExpTs(dto.expTs());
        exp.setOdometerKm(dto.odometerKm());
        exp.setDescription(dto.description());

        return toDto(repo.save(exp));
    }

    private ExpenseDto toDto(Expense e) {
        return new ExpenseDto(
                e.getId(),
                e.getVehicle().getId(),
                e.getVehicle().getNameModel(),
                e.getTrip() != null ? e.getTrip().getId() : null,
                e.getType().name(),
                e.getLiters(), e.getAmount(), e.getExpTs(),
                e.getOdometerKm(), e.getDescription(), e.getCreatedAt());
    }
}
