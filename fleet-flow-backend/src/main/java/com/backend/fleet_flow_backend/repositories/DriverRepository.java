package com.backend.fleet_flow_backend.repositories;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.fleet_flow_backend.entities.Driver;
import com.backend.fleet_flow_backend.entities.DriverStatus;

public interface DriverRepository extends JpaRepository<Driver, Long> {

    List<Driver> findByStatus(DriverStatus status);

    List<Driver> findByLicenseExpiryBefore(LocalDate date);

    long countByStatus(DriverStatus status);
}
