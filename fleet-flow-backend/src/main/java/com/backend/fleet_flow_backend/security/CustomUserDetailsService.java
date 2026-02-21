package com.backend.fleet_flow_backend.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.fleet_flow_backend.entities.Users;
import com.backend.fleet_flow_backend.repositories.UsersRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {
	private final UsersRepository usersRepository;

	public CustomUserDetailsService(UsersRepository usersRepository) {
		this.usersRepository = usersRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Users user = usersRepository.findByEmailIgnoreCase(username)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return new CustomUserDetails(user);
	}
}
