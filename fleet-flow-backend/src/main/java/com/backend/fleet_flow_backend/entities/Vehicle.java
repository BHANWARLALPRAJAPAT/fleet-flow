package com.backend.fleet_flow_backend.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
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
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(
		name = "vehicles",
		uniqueConstraints = {
				@UniqueConstraint(name = "uq_vehicles_license_plate", columnNames = "license_plate")
		}
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Vehicle {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@Column(name = "name_model", nullable = false)
	private String nameModel;

	@Column(name = "license_plate", nullable = false, unique = true)
	private String licensePlate;

	@Enumerated(EnumType.STRING)
	@JdbcTypeCode(SqlTypes.NAMED_ENUM)
	@Column(nullable = false, columnDefinition = "vehicle_type")
	private VehicleType type = VehicleType.OTHER;

	@Column
	private String region;

	@Column(name = "max_capacity_kg", nullable = false, precision = 12, scale = 2)
	private BigDecimal maxCapacityKg;

	@Column(name = "odometer_km", nullable = false, precision = 12, scale = 2)
	private BigDecimal odometerKm = BigDecimal.ZERO;

	@Enumerated(EnumType.STRING)
	@JdbcTypeCode(SqlTypes.NAMED_ENUM)
	@Column(nullable = false, columnDefinition = "vehicle_status")
	private VehicleStatus status = VehicleStatus.AVAILABLE;

	@Column(name = "is_retired", nullable = false)
	private boolean isRetired = false;

	@Column(name = "acquisition_cost", precision = 14, scale = 2)
	private BigDecimal acquisitionCost;

	@Column(name = "acquisition_date")
	private LocalDate acquisitionDate;

	@Column(name = "created_at", nullable = false, updatable = false)
	private OffsetDateTime createdAt;

	@Column(name = "updated_at", nullable = false)
	private OffsetDateTime updatedAt;

	@PrePersist
	void onCreate() {
		OffsetDateTime now = OffsetDateTime.now();
		if (createdAt == null) {
			createdAt = now;
		}
		updatedAt = now;
	}

	@PreUpdate
	void onUpdate() {
		updatedAt = OffsetDateTime.now();
	}
}
