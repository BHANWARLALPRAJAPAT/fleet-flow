package com.backend.fleet_flow_backend.entities;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "expenses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "vehicle", "trip", "createdByUser" })
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Expense {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@ManyToOne(optional = false)
	@JoinColumn(name = "vehicle_id", nullable = false)
	private Vehicle vehicle;

	@ManyToOne
	@JoinColumn(name = "trip_id")
	private Trip trip;

	@Enumerated(EnumType.STRING)
	@JdbcTypeCode(SqlTypes.NAMED_ENUM)
	@Column(nullable = false, columnDefinition = "expense_type")
	private ExpenseType type = ExpenseType.OTHER;

	@Column(precision = 12, scale = 3)
	private BigDecimal liters;

	@Column(nullable = false, precision = 14, scale = 2)
	private BigDecimal amount;

	@Column(name = "exp_ts", nullable = false)
	private OffsetDateTime expTs;

	@Column(name = "odometer_km", precision = 12, scale = 2)
	private BigDecimal odometerKm;

	@Column
	private String description;

	@ManyToOne
	@JoinColumn(name = "created_by_user_id")
	private Users createdByUser;

	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@PrePersist
	void onCreate() {
		OffsetDateTime now = OffsetDateTime.now();
		if (expTs == null) {
			expTs = now;
		}
		if (createdAt == null) {
			createdAt = now;
		}
	}
}
