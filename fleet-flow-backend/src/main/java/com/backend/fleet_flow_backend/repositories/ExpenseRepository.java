package com.backend.fleet_flow_backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.fleet_flow_backend.entities.Expense;

@RepositoryRestResource(path = "expenses", collectionResourceRel = "expenses")
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
}
