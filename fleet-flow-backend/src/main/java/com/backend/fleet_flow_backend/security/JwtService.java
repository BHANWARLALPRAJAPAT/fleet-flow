package com.backend.fleet_flow_backend.security;

import java.time.Duration;
import java.time.Instant;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.stereotype.Service;

import com.backend.fleet_flow_backend.entities.Users;

@Service
public class JwtService {
	private final JwtEncoder jwtEncoder;
	private final JwtDecoder jwtDecoder;
	private final String issuer;
	private final Duration ttl;

	public JwtService(
			JwtEncoder jwtEncoder,
			JwtDecoder jwtDecoder,
			@Value("${app.security.jwt.issuer:fleet-flow}") String issuer,
			@Value("${app.security.jwt.ttl-seconds:3600}") long ttlSeconds) {
		this.jwtEncoder = jwtEncoder;
		this.jwtDecoder = jwtDecoder;
		this.issuer = issuer;
		this.ttl = Duration.ofSeconds(ttlSeconds);
	}

	public String generateToken(Users user) {
		Instant now = Instant.now();
		Instant expiresAt = now.plus(ttl);
		String role = (user.getRole() == null) ? "DISPATCHER" : user.getRole().name();

		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer(issuer)
				.issuedAt(now)
				.expiresAt(expiresAt)
				.subject(user.getEmail())
				.claim("uid", user.getId())
				.claim("role", role)
				.build();

		JwsHeader jwsHeader = JwsHeader.with(MacAlgorithm.HS256).build();
		return jwtEncoder.encode(JwtEncoderParameters.from(jwsHeader, claims)).getTokenValue();
	}

	public Jwt decode(String token) {
		return jwtDecoder.decode(token);
	}
}
