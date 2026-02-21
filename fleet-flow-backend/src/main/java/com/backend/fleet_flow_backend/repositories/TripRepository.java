package com.backend.fleet_flow_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.fleet_flow_backend.entities.Trip;

@RepositoryRestResource(path = "trips", collectionResourceRel = "trips")
public interface TripRepository extends JpaRepository<Trip, Long> {
}
