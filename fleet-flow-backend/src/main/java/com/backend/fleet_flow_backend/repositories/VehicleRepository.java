package com.backend.fleet_flow_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.fleet_flow_backend.entities.Vehicle;
import com.backend.fleet_flow_backend.entities.VehicleStatus;
import com.backend.fleet_flow_backend.entities.VehicleType;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {

    List<Vehicle> findByStatus(VehicleStatus status);

    List<Vehicle> findByType(VehicleType type);

    long countByStatus(VehicleStatus status);

    long countByIsRetiredFalse();

    @Query("SELECT v FROM Vehicle v WHERE (:status IS NULL OR v.status = :status) AND (:type IS NULL OR v.type = :type) AND (:region IS NULL OR LOWER(v.region) = LOWER(:region))")
    List<Vehicle> findFiltered(VehicleStatus status, VehicleType type, String region);
}
