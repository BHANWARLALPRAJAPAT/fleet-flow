package com.backend.fleet_flow_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.fleet_flow_backend.entities.MaintenanceLog;

@RepositoryRestResource(path = "maintenance-logs", collectionResourceRel = "maintenance-logs")
public interface MaintenanceLogRepository extends JpaRepository<MaintenanceLog, Long> {
}
