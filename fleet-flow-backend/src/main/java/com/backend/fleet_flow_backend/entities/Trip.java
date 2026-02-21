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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "trips")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = { "vehicle", "driver", "createdByUser" })
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Trip {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@EqualsAndHashCode.Include
	private Long id;

	@Enumerated(EnumType.STRING)
	@JdbcTypeCode(SqlTypes.NAMED_ENUM)
	@Column(nullable = false, columnDefinition = "trip_status")
	private TripStatus status = TripStatus.DRAFT;

	@ManyToOne
	@JoinColumn(name = "vehicle_id")
	private Vehicle vehicle;

	@ManyToOne
	@JoinColumn(name = "driver_id")
	private Driver driver;

	@Column(nullable = false)
	private String origin;

	@Column(nullable = false)
	private String destination;

	@Column(name = "cargo_weight_kg", nullable = false, precision = 12, scale = 2)
	private BigDecimal cargoWeightKg = BigDecimal.ZERO;

	@Column(precision = 14, scale = 2)
	private BigDecimal revenue;

	@Column(name = "odometer_start_km", precision = 12, scale = 2)
	private BigDecimal odometerStartKm;

	@Column(name = "odometer_end_km", precision = 12, scale = 2)
	private BigDecimal odometerEndKm;

	@Column(name = "dispatched_at")
	private OffsetDateTime dispatchedAt;

	@Column(name = "completed_at")
	private OffsetDateTime completedAt;

	@Column(name = "cancelled_at")
	private OffsetDateTime cancelledAt;

	@ManyToOne
	@JoinColumn(name = "created_by_user_id")
	private Users createdByUser;

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
