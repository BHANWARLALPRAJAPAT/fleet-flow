package com.backend.fleet_flow_backend.controllers;

import java.time.OffsetDateTime;
import java.util.regex.Pattern;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.fleet_flow_backend.entities.UserRole;
import com.backend.fleet_flow_backend.entities.Users;
import com.backend.fleet_flow_backend.entities.PasswordResetToken;
import com.backend.fleet_flow_backend.repositories.PasswordResetTokenRepository;
import com.backend.fleet_flow_backend.repositories.UsersRepository;
import com.backend.fleet_flow_backend.security.JwtService;
import com.backend.fleet_flow_backend.services.MailService;
import com.backend.fleet_flow_backend.web.dto.ForgotPasswordRequest;
import com.backend.fleet_flow_backend.web.dto.LoginRequest;
import com.backend.fleet_flow_backend.web.dto.LoginResponse;
import com.backend.fleet_flow_backend.web.dto.RegisterRequest;
import com.backend.fleet_flow_backend.web.dto.ResetPasswordRequest;
import com.backend.fleet_flow_backend.web.dto.UserDto;

@RestController
@RequestMapping("/auth")
public class AuthController {
	private static final Pattern EMAIL_PATTERN = Pattern
			.compile("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");

	private final AuthenticationManager authenticationManager;
	private final UsersRepository usersRepository;
	private final PasswordResetTokenRepository passwordResetTokenRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;
	private final MailService mailService;

	public AuthController(AuthenticationManager authenticationManager, UsersRepository usersRepository,
			PasswordResetTokenRepository passwordResetTokenRepository,
			JwtService jwtService, PasswordEncoder passwordEncoder, MailService mailService) {
		this.authenticationManager = authenticationManager;
		this.usersRepository = usersRepository;
		this.passwordResetTokenRepository = passwordResetTokenRepository;
		this.jwtService = jwtService;
		this.passwordEncoder = passwordEncoder;
		this.mailService = mailService;
	}

	@PostMapping("/register")
	public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
		if (request == null || request.email() == null || request.password() == null || request.name() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing name/email/password");
		}

		String email = request.email().trim();
		String name = request.name().trim();
		if (email.isEmpty() || request.password().isBlank() || name.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing name/email/password");
		}
		if (!isValidEmail(email)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format");
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
		user.setName(name);
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
		String email = request.email().trim();
		if (email.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing email/password");
		}
		if (!isValidEmail(email)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format");
		}

		try {
			authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(email, request.password()));
		} catch (BadCredentialsException ex) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
		}

		Users user = usersRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

		if (!Boolean.TRUE.equals(user.getIsActive())) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("User inactive");
		}

		String token = jwtService.generateToken(user);
		UserDto userDto = new UserDto(user.getId(), user.getEmail(),
				(user.getRole() == null) ? null : user.getRole().name());
		return ResponseEntity.ok(new LoginResponse(token, userDto));
	}

	@PostMapping("/forgot-password")
	@Transactional
	public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
		if (request == null || request.email() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing email");
		}

		String email = request.email().trim();
		if (email.isEmpty() || !isValidEmail(email)) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid email format");
		}

		Users user = usersRepository.findByEmailIgnoreCase(email).orElse(null);
		if (user == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User is not registered");
		}

		passwordResetTokenRepository.deleteByUser(user);
		PasswordResetToken resetToken = new PasswordResetToken();
		resetToken.setUser(user);
		resetToken.setToken(UUID.randomUUID().toString());
		resetToken.setExpiresAt(OffsetDateTime.now().plusMinutes(30));
		passwordResetTokenRepository.save(resetToken);
		mailService.sendPasswordResetEmail(user.getEmail(), resetToken.getToken());

		return ResponseEntity.ok("Password reset link sent successfully.");
	}

	@PostMapping("/reset-password")
	@Transactional
	public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
		if (request == null || request.token() == null || request.newPassword() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing token/password");
		}
		String token = request.token().trim();
		if (token.isEmpty() || request.newPassword().isBlank()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing token/password");
		}
		if (request.newPassword().length() < 6) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password must be at least 6 characters");
		}

		PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndUsedAtIsNull(token)
				.orElse(null);
		if (resetToken == null || resetToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
		}

		Users user = resetToken.getUser();
		user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
		usersRepository.save(user);

		resetToken.setUsedAt(OffsetDateTime.now());
		passwordResetTokenRepository.save(resetToken);

		return ResponseEntity.ok("Password reset successful");
	}

	@GetMapping("/reset-password/validate")
	public ResponseEntity<?> validateResetToken(@RequestParam("token") String token) {
		if (token == null || token.trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
		}

		PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenAndUsedAtIsNull(token.trim())
				.orElse(null);
		if (resetToken == null || resetToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token");
		}

		return ResponseEntity.ok("Token is valid");
	}

	private boolean isValidEmail(String email) {
		return EMAIL_PATTERN.matcher(email).matches();
	}
}
