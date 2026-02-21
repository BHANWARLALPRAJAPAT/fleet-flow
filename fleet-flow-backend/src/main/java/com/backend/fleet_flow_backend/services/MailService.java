package com.backend.fleet_flow_backend.services;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
	private final JavaMailSender mailSender;
	private final String fromAddress;
	private final String frontendUrl;

	public MailService(
			JavaMailSender mailSender,
			@Value("${app.mail.from}") String fromAddress,
			@Value("${app.frontend.url:http://localhost:5173}") String frontendUrl) {
		this.mailSender = mailSender;
		this.fromAddress = fromAddress;
		this.frontendUrl = frontendUrl;
	}

	public void sendPasswordResetEmail(String toEmail, String token) {
		String encodedToken = URLEncoder.encode(token, StandardCharsets.UTF_8);
		String resetLink = frontendUrl + "/reset-password?token=" + encodedToken;

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(fromAddress);
		message.setTo(toEmail);
		message.setSubject("FleetFlow Password Reset");
		message.setText(
				"We received a request to reset your password.\n\n"
						+ "Use this link to reset it:\n"
						+ resetLink + "\n\n"
						+ "This link expires in 30 minutes.\n"
						+ "If you did not request this, you can ignore this email.");
		mailSender.send(message);
	}
}
