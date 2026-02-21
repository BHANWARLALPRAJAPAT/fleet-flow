BEGIN;

-- 1) ENUMS (keeps statuses consistent with spec) :contentReference[oaicite:1]{index=1}
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('FLEET_MANAGER','DISPATCHER','SAFETY_OFFICER','FINANCIAL_ANALYST','ADMIN');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_type AS ENUM ('TRUCK','VAN','BIKE','OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE vehicle_status AS ENUM ('AVAILABLE','ON_TRIP','IN_SHOP','OUT_OF_SERVICE');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE driver_status AS ENUM ('ON_DUTY','OFF_DUTY','SUSPENDED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE trip_status AS ENUM ('DRAFT','DISPATCHED','COMPLETED','CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_type AS ENUM ('PREVENTIVE','REACTIVE','INSPECTION','OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE expense_type AS ENUM ('FUEL','MAINTENANCE','TOLL','PARKING','INSURANCE','OTHER');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;


-- 2) USERS (Auth + RBAC)
CREATE TABLE IF NOT EXISTS app_users (
  id            BIGSERIAL PRIMARY KEY,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          user_role NOT NULL DEFAULT 'DISPATCHER',
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3) VEHICLES
CREATE TABLE IF NOT EXISTS vehicles (
  id               BIGSERIAL PRIMARY KEY,
  name_model       TEXT NOT NULL,
  license_plate    TEXT NOT NULL UNIQUE,
  type             vehicle_type NOT NULL DEFAULT 'OTHER',
  region           TEXT,
  max_capacity_kg  NUMERIC(12,2) NOT NULL CHECK (max_capacity_kg > 0),
  odometer_km      NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (odometer_km >= 0),
  status           vehicle_status NOT NULL DEFAULT 'AVAILABLE',
  is_retired       BOOLEAN NOT NULL DEFAULT FALSE,
  acquisition_cost NUMERIC(14,2) CHECK (acquisition_cost IS NULL OR acquisition_cost >= 0),
  acquisition_date DATE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_vehicle_retired_status
    CHECK (NOT is_retired OR status = 'OUT_OF_SERVICE')
);

CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type   ON vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_region ON vehicles(region);

-- 4) DRIVERS
CREATE TABLE IF NOT EXISTS drivers (
  id               BIGSERIAL PRIMARY KEY,
  full_name        TEXT NOT NULL,
  phone            TEXT,
  license_no       TEXT NOT NULL UNIQUE,
  license_expiry   DATE NOT NULL,
  license_category TEXT,
  safety_score     NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (safety_score >= 0),
  status           driver_status NOT NULL DEFAULT 'ON_DUTY',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_license_expiry ON drivers(license_expiry);

-- 5) TRIPS (workflow is in Spring Boot, DB just stores + protects integrity)
CREATE TABLE IF NOT EXISTS trips (
  id                BIGSERIAL PRIMARY KEY,
  status            trip_status NOT NULL DEFAULT 'DRAFT',

  vehicle_id        BIGINT REFERENCES vehicles(id),
  driver_id         BIGINT REFERENCES drivers(id),

  origin            TEXT NOT NULL,
  destination       TEXT NOT NULL,
  cargo_weight_kg   NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (cargo_weight_kg >= 0),

  revenue           NUMERIC(14,2) CHECK (revenue IS NULL OR revenue >= 0),

  odometer_start_km NUMERIC(12,2) CHECK (odometer_start_km IS NULL OR odometer_start_km >= 0),
  odometer_end_km   NUMERIC(12,2) CHECK (odometer_end_km IS NULL OR odometer_end_km >= 0),

  dispatched_at     TIMESTAMPTZ,
  completed_at      TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,

  created_by_user_id BIGINT REFERENCES app_users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT chk_trip_odo_order
    CHECK (odometer_start_km IS NULL OR odometer_end_km IS NULL OR odometer_end_km >= odometer_start_km)
);

CREATE INDEX IF NOT EXISTS idx_trips_status  ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver  ON trips(driver_id);

-- **Concurrency guard**: only one DISPATCHED trip per vehicle/driver at a time
CREATE UNIQUE INDEX IF NOT EXISTS uq_one_dispatched_trip_per_vehicle
ON trips(vehicle_id)
WHERE vehicle_id IS NOT NULL AND status = 'DISPATCHED';

CREATE UNIQUE INDEX IF NOT EXISTS uq_one_dispatched_trip_per_driver
ON trips(driver_id)
WHERE driver_id IS NOT NULL AND status = 'DISPATCHED';


-- 6) MAINTENANCE LOGS
CREATE TABLE IF NOT EXISTS maintenance_logs (
  id               BIGSERIAL PRIMARY KEY,
  vehicle_id       BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  log_date         DATE NOT NULL DEFAULT CURRENT_DATE,
  type             maintenance_type NOT NULL DEFAULT 'OTHER',
  description      TEXT,
  cost             NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
  created_by_user_id BIGINT REFERENCES app_users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_maint_vehicle_date ON maintenance_logs(vehicle_id, log_date);


-- 7) EXPENSES (fuel + others in one table)
CREATE TABLE IF NOT EXISTS expenses (
  id               BIGSERIAL PRIMARY KEY,
  vehicle_id       BIGINT NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  trip_id          BIGINT REFERENCES trips(id) ON DELETE SET NULL,
  type             expense_type NOT NULL DEFAULT 'OTHER',

  -- For FUEL entries, you can fill liters; for others it can be NULL
  liters           NUMERIC(12,3) CHECK (liters IS NULL OR liters > 0),

  amount           NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
  exp_ts           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  odometer_km      NUMERIC(12,2) CHECK (odometer_km IS NULL OR odometer_km >= 0),

  description      TEXT,
  created_by_user_id BIGINT REFERENCES app_users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_exp_vehicle_ts ON expenses(vehicle_id, exp_ts);
CREATE INDEX IF NOT EXISTS idx_exp_trip       ON expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_exp_type       ON expenses(type);


-- 8) AUDIT LOG (highly recommended)
CREATE TABLE IF NOT EXISTS activity_log (
  id            BIGSERIAL PRIMARY KEY,
  actor_user_id BIGINT REFERENCES app_users(id),
  entity_type   TEXT NOT NULL,      -- 'vehicle','driver','trip','maintenance','expense'
  entity_id     BIGINT NOT NULL,
  action        TEXT NOT NULL,      -- 'CREATE','UPDATE','DISPATCH','COMPLETE','CANCEL','STATUS_CHANGE'
  details       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_entity ON activity_log(entity_type, entity_id);

COMMIT;