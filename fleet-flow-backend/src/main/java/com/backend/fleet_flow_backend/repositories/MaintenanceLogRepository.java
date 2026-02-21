package com.backend.fleet_flow_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.fleet_flow_backend.entities.MaintenanceLog;

public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {

    List<MaintenanceLog> findByVehicleIdOrderByLogDateDesc(Long vehicleId);
}
