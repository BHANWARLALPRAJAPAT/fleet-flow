package com.backend.fleet_flow_backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.backend.fleet_flow_backend.entities.Expense;
import com.backend.fleet_flow_backend.entities.ExpenseType;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByVehicleId(Long vehicleId);

    List<Expense> findByTripId(Long tripId);

    List<Expense> findByType(ExpenseType type);

    @Query("SELECT e FROM Expense e WHERE (:vehicleId IS NULL OR e.vehicle.id = :vehicleId) AND (:tripId IS NULL OR e.trip.id = :tripId) AND (:type IS NULL OR e.type = :type) ORDER BY e.expTs DESC")
    List<Expense> findFiltered(Long vehicleId, Long tripId, ExpenseType type);
}
