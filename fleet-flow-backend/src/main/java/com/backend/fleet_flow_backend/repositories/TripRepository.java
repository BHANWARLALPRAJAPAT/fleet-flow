package com.backend.fleet_flow_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.fleet_flow_backend.entities.Trip;
import com.backend.fleet_flow_backend.entities.TripStatus;

@RepositoryRestResource(exported = false)
public interface TripRepository extends JpaRepository<Trip, Long> {

    List<Trip> findByStatus(TripStatus status);

    List<Trip> findByVehicleId(Long vehicleId);

    List<Trip> findByDriverId(Long driverId);

    long countByStatus(TripStatus status);

    @Query("SELECT t FROM Trip t WHERE (:status IS NULL OR t.status = :status) AND (:vehicleId IS NULL OR t.vehicle.id = :vehicleId) AND (:driverId IS NULL OR t.driver.id = :driverId)")
    List<Trip> findFiltered(TripStatus status, Long vehicleId, Long driverId);

    boolean existsByVehicleIdAndStatus(Long vehicleId, TripStatus status);

    boolean existsByDriverIdAndStatus(Long driverId, TripStatus status);
}
