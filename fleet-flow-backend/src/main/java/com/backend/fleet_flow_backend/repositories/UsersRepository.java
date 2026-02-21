package com.backend.fleet_flow_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import com.backend.fleet_flow_backend.entities.Users;

@RepositoryRestResource(path = "users", collectionResourceRel = "users")
public interface UsersRepository extends JpaRepository<Users, Long> {
	Optional<Users> findByEmailIgnoreCase(String email);
}
