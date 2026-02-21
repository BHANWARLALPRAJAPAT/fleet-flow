package com.backend.fleet_flow_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.fleet_flow_backend.entities.Vehicle;
import com.backend.fleet_flow_backend.entities.VehicleStatus;
import com.backend.fleet_flow_backend.entities.VehicleType;
import com.backend.fleet_flow_backend.exception.BusinessRuleException;
import com.backend.fleet_flow_backend.exception.ResourceNotFoundException;
import com.backend.fleet_flow_backend.repositories.VehicleRepository;
import com.backend.fleet_flow_backend.web.dto.VehicleDto;

@Service
@Transactional(readOnly = true)
public class VehicleService {

    private final VehicleRepository repo;

    public VehicleService(VehicleRepository repo) {
        this.repo = repo;
    }

    public List<VehicleDto> findAll(String status, String type, String region) {
        VehicleStatus vs = parseEnum(VehicleStatus.class, status);
        VehicleType vt = parseEnum(VehicleType.class, type);
        List<Vehicle> vehicles = repo.findFiltered(vs, vt, region);
        return vehicles.stream().map(this::toDto).toList();
    }

    public VehicleDto findById(Long id) {
        return toDto(getOrThrow(id));
    }

    @Transactional
    public VehicleDto create(VehicleDto dto) {
        Vehicle v = new Vehicle();
        applyDto(v, dto);
        return toDto(repo.save(v));
    }

    @Transactional
    public VehicleDto update(Long id, VehicleDto dto) {
        Vehicle v = getOrThrow(id);
        applyDto(v, dto);
        return toDto(repo.save(v));
    }

    @Transactional
    public VehicleDto retire(Long id) {
        Vehicle v = getOrThrow(id);
        if (v.isRetired()) {
            throw new BusinessRuleException("Vehicle is already retired");
        }
        v.setRetired(true);
        v.setStatus(VehicleStatus.OUT_OF_SERVICE);
        return toDto(repo.save(v));
    }

    // ── helpers ──

    private Vehicle getOrThrow(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Vehicle", id));
    }

    private void applyDto(Vehicle v, VehicleDto dto) {
        v.setNameModel(dto.nameModel());
        v.setLicensePlate(dto.licensePlate());
        v.setType(parseEnum(VehicleType.class, dto.type()));
        v.setRegion(dto.region());
        v.setMaxCapacityKg(dto.maxCapacityKg());
        if (dto.odometerKm() != null)
            v.setOdometerKm(dto.odometerKm());
        if (dto.acquisitionCost() != null)
            v.setAcquisitionCost(dto.acquisitionCost());
        if (dto.acquisitionDate() != null)
            v.setAcquisitionDate(dto.acquisitionDate());
    }

    private VehicleDto toDto(Vehicle v) {
        return new VehicleDto(
                v.getId(), v.getNameModel(), v.getLicensePlate(),
                v.getType().name(), v.getRegion(), v.getMaxCapacityKg(),
                v.getOdometerKm(), v.getStatus().name(), v.isRetired(),
                v.getAcquisitionCost(), v.getAcquisitionDate());
    }

    @SuppressWarnings("unchecked")
    private <E extends Enum<E>> E parseEnum(Class<E> cls, String val) {
        if (val == null || val.isBlank())
            return null;
        try {
            return Enum.valueOf(cls, val.toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
