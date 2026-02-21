package com.backend.fleet_flow_backend.security;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.backend.fleet_flow_backend.entities.Users;

public class CustomUserDetails implements UserDetails {
	private final Users user;

	public CustomUserDetails(Users user) {
		this.user = user;
	}

	public Users getUser() {
		return user;
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		String role = (user.getRole() == null) ? "DISPATCHER" : user.getRole().name();
		return List.of(new SimpleGrantedAuthority("ROLE_" + role));
	}

	@Override
	public String getPassword() {
		return user.getPasswordHash();
	}

	@Override
	public String getUsername() {
		return user.getEmail();
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return Boolean.TRUE.equals(user.getIsActive());
	}
}
