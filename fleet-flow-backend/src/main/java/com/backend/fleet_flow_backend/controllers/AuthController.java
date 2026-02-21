package com.backend.fleet_flow_backend.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.fleet_flow_backend.entities.UserRole;
import com.backend.fleet_flow_backend.entities.Users;
import com.backend.fleet_flow_backend.repositories.UsersRepository;
import com.backend.fleet_flow_backend.security.JwtService;
import com.backend.fleet_flow_backend.web.dto.LoginRequest;
import com.backend.fleet_flow_backend.web.dto.LoginResponse;
import com.backend.fleet_flow_backend.web.dto.RegisterRequest;
import com.backend.fleet_flow_backend.web.dto.UserDto;

@RestController
@RequestMapping("/auth")
public class AuthController {
	private final AuthenticationManager authenticationManager;
	private final UsersRepository usersRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;

	public AuthController(AuthenticationManager authenticationManager, UsersRepository usersRepository,
			JwtService jwtService, PasswordEncoder passwordEncoder) {
		this.authenticationManager = authenticationManager;
		this.usersRepository = usersRepository;
		this.jwtService = jwtService;
		this.passwordEncoder = passwordEncoder;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
		if (request == null || request.email() == null || request.password() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing email/password");
		}

		String email = request.email().trim();
		if (email.isEmpty() || request.password().isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing email/password");
		}

		if (usersRepository.findByEmailIgnoreCase(email).isPresent()) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
		}

		UserRole role = UserRole.DISPATCHER;
		if (request.role() != null && !request.role().isBlank()) {
			try {
				role = UserRole.valueOf(request.role().trim().toUpperCase());
			} catch (IllegalArgumentException ignored) {
				role = UserRole.DISPATCHER;
			}
		}

		Users user = new Users();
		user.setEmail(email);
		user.setPasswordHash(passwordEncoder.encode(request.password()));
		user.setRole(role);
		user.setIsActive(true);

		Users saved = usersRepository.save(user);
		UserDto dto = new UserDto(saved.getId(), saved.getEmail(), saved.getRole().name());
		return ResponseEntity.status(HttpStatus.CREATED).body(dto);
	}

	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest request) {
		if (request == null || request.email() == null || request.password() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing email/password");
		}

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(request.email(), request.password()));
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}

		Users user = usersRepository.findByEmailIgnoreCase(request.email())
				.orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

		if (!Boolean.TRUE.equals(user.getIsActive())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User inactive");
		}

		String token = jwtService.generateToken(user);
		UserDto userDto = new UserDto(user.getId(), user.getEmail(),
				(user.getRole() == null) ? null : user.getRole().name());
		return ResponseEntity.ok(new LoginResponse(token, userDto));
	}
}
