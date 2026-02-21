package com.backend.fleet_flow_backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.fleet_flow_backend.entities.Driver;
import com.backend.fleet_flow_backend.entities.DriverStatus;
import com.backend.fleet_flow_backend.entities.Trip;
import com.backend.fleet_flow_backend.entities.TripStatus;
import com.backend.fleet_flow_backend.entities.Vehicle;
import com.backend.fleet_flow_backend.entities.VehicleStatus;
import com.backend.fleet_flow_backend.exception.BusinessRuleException;
import com.backend.fleet_flow_backend.exception.ResourceNotFoundException;
import com.backend.fleet_flow_backend.repositories.DriverRepository;
import com.backend.fleet_flow_backend.repositories.TripRepository;
import com.backend.fleet_flow_backend.repositories.VehicleRepository;
import com.backend.fleet_flow_backend.web.dto.TripCompleteDto;
import com.backend.fleet_flow_backend.web.dto.TripCreateDto;
import com.backend.fleet_flow_backend.web.dto.TripDispatchDto;
import com.backend.fleet_flow_backend.web.dto.TripDto;

@Service
@Transactional(readOnly = true)
public class TripService {

    private final TripRepository tripRepo;
    private final VehicleRepository vehicleRepo;
    private final DriverRepository driverRepo;

    public TripService(TripRepository tripRepo, VehicleRepository vehicleRepo, DriverRepository driverRepo) {
        this.tripRepo = tripRepo;
        this.vehicleRepo = vehicleRepo;
        this.driverRepo = driverRepo;
    }

    public List<TripDto> findAll(String status, Long vehicleId, Long driverId) {
        TripStatus ts = null;
        if (status != null && !status.isBlank()) {
            try {
                ts = TripStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }
        return tripRepo.findFiltered(ts, vehicleId, driverId)
                .stream().map(this::toDto).toList();
    }

    public TripDto findById(Long id) {
        return toDto(getOrThrow(id));
    }

    @Transactional
    public TripDto create(TripCreateDto dto) {
        Trip trip = new Trip();
        trip.setOrigin(dto.origin());
        trip.setDestination(dto.destination());
        trip.setCargoWeightKg(dto.cargoWeightKg());
        trip.setStatus(TripStatus.DRAFT);

        if (dto.vehicleId() != null) {
            trip.setVehicle(vehicleRepo.findById(dto.vehicleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Vehicle", dto.vehicleId())));
        }
        if (dto.driverId() != null) {
            trip.setDriver(driverRepo.findById(dto.driverId())
                    .orElseThrow(() -> new ResourceNotFoundException("Driver", dto.driverId())));
        }
        return toDto(tripRepo.save(trip));
    }

    @Transactional
    public TripDto dispatch(Long id, TripDispatchDto dto) {
        Trip trip = getOrThrow(id);
        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessRuleException("Only DRAFT trips can be dispatched");
        }

        Vehicle vehicle = vehicleRepo.findById(dto.vehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle", dto.vehicleId()));
        Driver driver = driverRepo.findById(dto.driverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver", dto.driverId()));

        // Business rules
        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BusinessRuleException("Vehicle is not AVAILABLE (current: " + vehicle.getStatus() + ")");
        }
        if (driver.getStatus() != DriverStatus.ON_DUTY) {
            throw new BusinessRuleException("Driver is not ON_DUTY (current: " + driver.getStatus() + ")");
        }
        if (driver.getLicenseExpiry().isBefore(LocalDate.now())) {
            throw new BusinessRuleException("Driver license has expired (" + driver.getLicenseExpiry() + ")");
        }
        if (trip.getCargoWeightKg().compareTo(vehicle.getMaxCapacityKg()) > 0) {
            throw new BusinessRuleException("Cargo weight (" + trip.getCargoWeightKg()
                    + " kg) exceeds vehicle capacity (" + vehicle.getMaxCapacityKg() + " kg)");
        }

        // Concurrency check (application-level, DB unique index is the ultimate guard)
        if (tripRepo.existsByVehicleIdAndStatus(vehicle.getId(), TripStatus.DISPATCHED)) {
            throw new BusinessRuleException("Vehicle already assigned to a dispatched trip");
        }
        if (tripRepo.existsByDriverIdAndStatus(driver.getId(), TripStatus.DISPATCHED)) {
            throw new BusinessRuleException("Driver already assigned to a dispatched trip");
        }

        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setStatus(TripStatus.DISPATCHED);
        trip.setDispatchedAt(OffsetDateTime.now());
        if (dto.odometerStartKm() != null) {
            trip.setOdometerStartKm(dto.odometerStartKm());
        }

        vehicle.setStatus(VehicleStatus.ON_TRIP);
        vehicleRepo.save(vehicle);

        return toDto(tripRepo.save(trip));
    }

    @Transactional
    public TripDto complete(Long id, TripCompleteDto dto) {
        Trip trip = getOrThrow(id);
        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessRuleException("Only DISPATCHED trips can be completed");
        }

        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(OffsetDateTime.now());
        if (dto != null) {
            if (dto.odometerEndKm() != null)
                trip.setOdometerEndKm(dto.odometerEndKm());
            if (dto.revenue() != null)
                trip.setRevenue(dto.revenue());
        }

        // Free up vehicle
        if (trip.getVehicle() != null) {
            Vehicle vehicle = trip.getVehicle();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            if (dto != null && dto.odometerEndKm() != null) {
                vehicle.setOdometerKm(dto.odometerEndKm());
            }
            vehicleRepo.save(vehicle);
        }

        return toDto(tripRepo.save(trip));
    }

    @Transactional
    public TripDto cancel(Long id) {
        Trip trip = getOrThrow(id);
        if (trip.getStatus() != TripStatus.DRAFT && trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessRuleException("Only DRAFT or DISPATCHED trips can be cancelled");
        }

        // Free up vehicle if dispatched
        if (trip.getStatus() == TripStatus.DISPATCHED && trip.getVehicle() != null) {
            Vehicle vehicle = trip.getVehicle();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepo.save(vehicle);
        }

        trip.setStatus(TripStatus.CANCELLED);
        trip.setCancelledAt(OffsetDateTime.now());

        return toDto(tripRepo.save(trip));
    }

    // ── helpers ──

    private Trip getOrThrow(Long id) {
        return tripRepo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Trip", id));
    }

    private TripDto toDto(Trip t) {
        return new TripDto(
                t.getId(), t.getStatus().name(),
                t.getVehicle() != null ? t.getVehicle().getId() : null,
                t.getVehicle() != null ? t.getVehicle().getNameModel() : null,
                t.getDriver() != null ? t.getDriver().getId() : null,
                t.getDriver() != null ? t.getDriver().getFullName() : null,
                t.getOrigin(), t.getDestination(), t.getCargoWeightKg(),
                t.getRevenue(), t.getOdometerStartKm(), t.getOdometerEndKm(),
                t.getDispatchedAt(), t.getCompletedAt(), t.getCancelledAt(),
                t.getCreatedAt());
    }
}
