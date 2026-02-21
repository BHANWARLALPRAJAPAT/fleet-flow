package com.backend.fleet_flow_backend.service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.backend.fleet_flow_backend.entities.Driver;
import com.backend.fleet_flow_backend.entities.DriverStatus;
import com.backend.fleet_flow_backend.exception.ResourceNotFoundException;
import com.backend.fleet_flow_backend.repositories.DriverRepository;
import com.backend.fleet_flow_backend.web.dto.DriverDto;

@Service
@Transactional(readOnly = true)
public class DriverService {

    private final DriverRepository repo;

    public DriverService(DriverRepository repo) {
        this.repo = repo;
    }

    public List<DriverDto> findAll(String status, Boolean licenseExpiringSoon) {
        if (Boolean.TRUE.equals(licenseExpiringSoon)) {
            return repo.findByLicenseExpiryBefore(LocalDate.now().plusDays(30))
                    .stream().map(this::toDto).toList();
        }
        if (status != null && !status.isBlank()) {
            try {
                DriverStatus ds = DriverStatus.valueOf(status.toUpperCase());
                return repo.findByStatus(ds).stream().map(this::toDto).toList();
            } catch (IllegalArgumentException ignored) {
            }
        }
        return repo.findAll().stream().map(this::toDto).toList();
    }

    public DriverDto findById(Long id) {
        return toDto(getOrThrow(id));
    }

    @Transactional
    public DriverDto create(DriverDto dto) {
        Driver d = new Driver();
        applyDto(d, dto);
        return toDto(repo.save(d));
    }

    @Transactional
    public DriverDto update(Long id, DriverDto dto) {
        Driver d = getOrThrow(id);
        applyDto(d, dto);
        return toDto(repo.save(d));
    }

    @Transactional
    public DriverDto changeStatus(Long id, String newStatus) {
        Driver d = getOrThrow(id);
        d.setStatus(DriverStatus.valueOf(newStatus.toUpperCase()));
        return toDto(repo.save(d));
    }

    // ── helpers ──

    private Driver getOrThrow(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Driver", id));
    }

    private void applyDto(Driver d, DriverDto dto) {
        d.setFullName(dto.fullName());
        d.setPhone(dto.phone());
        d.setLicenseNo(dto.licenseNo());
        d.setLicenseExpiry(dto.licenseExpiry());
        d.setLicenseCategory(dto.licenseCategory());
        if (dto.safetyScore() != null)
            d.setSafetyScore(dto.safetyScore());
        if (dto.status() != null) {
            try {
                d.setStatus(DriverStatus.valueOf(dto.status().toUpperCase()));
            } catch (IllegalArgumentException ignored) {
            }
        }
    }

    private DriverDto toDto(Driver d) {
        return new DriverDto(d.getId(), d.getFullName(), d.getPhone(),
                d.getLicenseNo(), d.getLicenseExpiry(), d.getLicenseCategory(),
                d.getSafetyScore(), d.getStatus().name());
    }
}
