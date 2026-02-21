-- FleetFlow Seed Data
-- Run AFTER db.sql schema creation

-- Seed Users (passwords are bcrypt hash of 'password123')
INSERT INTO app_users (email, password_hash, role, is_active) VALUES
  ('admin@fleetflow.io', '$2a$10$N9qo8uLOickgx2ZMRZoMye3S2aJy.EbikB1lEqPJGMQxTw7G4eKYe', 'ADMIN', true),
  ('dispatcher@fleetflow.io', '$2a$10$N9qo8uLOickgx2ZMRZoMye3S2aJy.EbikB1lEqPJGMQxTw7G4eKYe', 'DISPATCHER', true)
ON CONFLICT (email) DO NOTHING;

-- Seed Vehicles
INSERT INTO vehicles (name_model, license_plate, type, region, max_capacity_kg, odometer_km, status) VALUES
  ('Tata Ace', 'GJ-01-AB-1234', 'TRUCK', 'Gujarat', 1500.00, 45000.00, 'AVAILABLE'),
  ('Mahindra Bolero', 'GJ-05-CD-5678', 'VAN', 'Gujarat', 800.00, 32000.00, 'AVAILABLE'),
  ('Ashok Leyland 1616', 'MH-12-EF-9012', 'TRUCK', 'Maharashtra', 10000.00, 120000.00, 'AVAILABLE'),
  ('Eicher Pro 2049', 'RJ-14-GH-3456', 'TRUCK', 'Rajasthan', 5000.00, 75000.00, 'ON_TRIP'),
  ('TVS King', 'KA-03-IJ-7890', 'BIKE', 'Karnataka', 200.00, 15000.00, 'IN_SHOP')
ON CONFLICT (license_plate) DO NOTHING;

-- Seed Drivers
INSERT INTO drivers (full_name, phone, license_no, license_expiry, license_category, safety_score, status) VALUES
  ('Ramesh Kumar',  '9876543210', 'DL-GJ-2020-0001', '2027-06-15', 'HMV', 92.50, 'ON_DUTY'),
  ('Suresh Patel',  '9876543211', 'DL-GJ-2020-0002', '2026-12-31', 'LMV', 88.00, 'ON_DUTY'),
  ('Amit Singh',    '9876543212', 'DL-MH-2019-0003', '2026-03-01', 'HMV', 75.00, 'OFF_DUTY'),
  ('Priya Sharma',  '9876543213', 'DL-RJ-2021-0004', '2028-01-15', 'HMV', 95.00, 'ON_DUTY')
ON CONFLICT (license_no) DO NOTHING;

-- Seed Trips
INSERT INTO trips (status, vehicle_id, driver_id, origin, destination, cargo_weight_kg, revenue) VALUES
  ('DRAFT', NULL, NULL, 'Ahmedabad', 'Mumbai', 1200.00, NULL),
  ('DRAFT', NULL, NULL, 'Jaipur', 'Delhi', 3000.00, NULL),
  ('DISPATCHED', 4, 4, 'Udaipur', 'Jodhpur', 4500.00, NULL)
ON CONFLICT DO NOTHING;
