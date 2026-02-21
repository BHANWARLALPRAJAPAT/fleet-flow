package com.backend.fleet_flow_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.fleet_flow_backend.entities.Driver;

@RepositoryRestResource(path = "drivers", collectionResourceRel = "drivers")
public interface DriverRepository extends JpaRepository<Driver, Long> {
}
