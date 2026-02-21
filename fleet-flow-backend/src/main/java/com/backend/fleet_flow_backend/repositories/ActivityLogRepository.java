package com.backend.fleet_flow_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.fleet_flow_backend.entities.ActivityLog;

@RepositoryRestResource(path = "activity-log", collectionResourceRel = "activity-log")
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}
