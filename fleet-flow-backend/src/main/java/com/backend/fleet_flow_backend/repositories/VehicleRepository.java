package com.backend.fleet_flow_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.fleet_flow_backend.entities.Vehicle;

@RepositoryRestResource(path = "vehicles", collectionResourceRel = "vehicles")
public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
}
