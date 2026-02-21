package com.backend.fleet_flow_backend.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.backend.fleet_flow_backend.entities.PasswordResetToken;
import com.backend.fleet_flow_backend.entities.Users;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
	Optional<PasswordResetToken> findByTokenAndUsedAtIsNull(String token);

	void deleteByUser(Users user);
}
