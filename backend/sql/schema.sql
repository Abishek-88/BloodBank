CREATE DATABASE IF NOT EXISTS medilink;
USE medilink;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('hospital', 'blood_bank', 'courier', 'admin') NOT NULL,
  phone VARCHAR(20),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_users_role (role),
  INDEX idx_users_active (is_active)
);

CREATE TABLE hospitals (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  organization_name VARCHAR(180) NOT NULL,
  address VARCHAR(255),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  service_radius_km INT DEFAULT 25,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE blood_banks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  organization_name VARCHAR(180) NOT NULL,
  address VARCHAR(255),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  service_radius_km INT DEFAULT 25,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_blood_banks_verify (verification_status)
);

CREATE TABLE couriers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL UNIQUE,
  organization_name VARCHAR(180) NOT NULL,
  address VARCHAR(255),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  service_radius_km INT DEFAULT 50,
  verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'verified',
  vehicle_type VARCHAR(60) DEFAULT 'bike',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_couriers_verify (verification_status)
);

CREATE TABLE blood_inventory (
  id INT PRIMARY KEY AUTO_INCREMENT,
  bank_id INT NOT NULL,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  component_type ENUM('whole_blood', 'platelets', 'plasma', 'rbc') NOT NULL,
  units_available INT NOT NULL DEFAULT 0 CHECK (units_available >= 0),
  reserved_units INT NOT NULL DEFAULT 0 CHECK (reserved_units >= 0),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_inventory_bank_group_component (bank_id, blood_group, component_type),
  FOREIGN KEY (bank_id) REFERENCES blood_banks(id) ON DELETE CASCADE,
  INDEX idx_inventory_lookup (blood_group, component_type, units_available)
);

CREATE TABLE emergency_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  hospital_id INT NOT NULL,
  blood_group ENUM('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-') NOT NULL,
  component_type ENUM('whole_blood', 'platelets', 'plasma', 'rbc') NOT NULL,
  units_needed INT NOT NULL CHECK (units_needed > 0),
  urgency_level ENUM('critical', 'high', 'medium', 'low') NOT NULL,
  status ENUM('pending', 'accepted', 'dispatched', 'delivered', 'cancelled') NOT NULL DEFAULT 'pending',
  latitude DECIMAL(10, 7) NOT NULL,
  longitude DECIMAL(10, 7) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE,
  INDEX idx_requests_status_priority (status, urgency_level),
  INDEX idx_requests_created_at (created_at)
);

CREATE TABLE assignments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  request_id INT NOT NULL,
  courier_id INT NOT NULL,
  bank_id INT NOT NULL,
  assigned_by INT NOT NULL,
  status ENUM('assigned', 'picked_up', 'in_transit', 'delivered') NOT NULL DEFAULT 'assigned',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES emergency_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (courier_id) REFERENCES couriers(id) ON DELETE CASCADE,
  FOREIGN KEY (bank_id) REFERENCES blood_banks(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_assignments_courier_status (courier_id, status)
);

CREATE TABLE logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  request_id INT,
  assignment_id INT,
  actor_user_id INT,
  action_type VARCHAR(80) NOT NULL,
  status VARCHAR(40) NOT NULL,
  details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (request_id) REFERENCES emergency_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
  FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_logs_request_time (request_id, created_at),
  INDEX idx_logs_assignment_time (assignment_id, created_at)
);

-- Sample seed data for hospital dashboard testing.
INSERT INTO users (id, name, email, password, role, phone)
VALUES
  (1, 'CityCare Hospital', 'hospital@medilink.local', '$2b$10$abcdefghijklmnopqrstuv', 'hospital', '+91-9000000001'),
  (2, 'LifeLine Blood Bank', 'bloodbank@medilink.local', '$2b$10$abcdefghijklmnopqrstuv', 'blood_bank', '+91-9000000002'),
  (3, 'Swift Courier', 'courier@medilink.local', '$2b$10$abcdefghijklmnopqrstuv', 'courier', '+91-9000000003'),
  (4, 'MediLink Admin', 'admin@medilink.local', '$2b$10$abcdefghijklmnopqrstuv', 'admin', '+91-9000000004')
ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone);

INSERT INTO hospitals (id, user_id, organization_name, address, latitude, longitude, service_radius_km, verification_status)
VALUES
  (1, 1, 'CityCare Hospital', 'MG Road, Bengaluru', 12.9716000, 77.5946000, 25, 'verified')
ON DUPLICATE KEY UPDATE organization_name = VALUES(organization_name), address = VALUES(address);

INSERT INTO blood_banks (id, user_id, organization_name, address, latitude, longitude, service_radius_km, verification_status)
VALUES
  (1, 2, 'LifeLine Blood Bank', 'Indiranagar, Bengaluru', 12.9784000, 77.6408000, 25, 'verified')
ON DUPLICATE KEY UPDATE organization_name = VALUES(organization_name), address = VALUES(address);

INSERT INTO couriers (id, user_id, organization_name, address, latitude, longitude, service_radius_km, verification_status, vehicle_type)
VALUES
  (1, 3, 'Swift Courier', 'Koramangala, Bengaluru', 12.9352000, 77.6245000, 50, 'verified', 'bike')
ON DUPLICATE KEY UPDATE organization_name = VALUES(organization_name), address = VALUES(address);

INSERT INTO blood_inventory (bank_id, blood_group, component_type, units_available, reserved_units)
VALUES
  (1, 'O-', 'whole_blood', 10, 2),
  (1, 'A+', 'whole_blood', 12, 1),
  (1, 'B-', 'platelets', 6, 1),
  (1, 'AB+', 'plasma', 8, 0)
ON DUPLICATE KEY UPDATE
  units_available = VALUES(units_available),
  reserved_units = VALUES(reserved_units);

INSERT INTO emergency_requests (id, hospital_id, blood_group, component_type, units_needed, urgency_level, status, latitude, longitude, notes)
VALUES
  (1001, 1, 'O-', 'whole_blood', 4, 'critical', 'pending', 12.9716000, 77.5946000, 'Emergency trauma support'),
  (1002, 1, 'A+', 'whole_blood', 2, 'high', 'accepted', 12.9716000, 77.5946000, 'ICU replenishment'),
  (1003, 1, 'B-', 'platelets', 3, 'critical', 'dispatched', 12.9716000, 77.5946000, 'Surgical emergency'),
  (1004, 1, 'AB+', 'plasma', 1, 'medium', 'delivered', 12.9716000, 77.5946000, 'Scheduled transfusion backup')
ON DUPLICATE KEY UPDATE
  units_needed = VALUES(units_needed),
  urgency_level = VALUES(urgency_level),
  status = VALUES(status),
  notes = VALUES(notes);

INSERT INTO assignments (id, request_id, courier_id, bank_id, assigned_by, status)
VALUES
  (1, 1002, 1, 1, 4, 'assigned'),
  (2, 1003, 1, 1, 4, 'in_transit'),
  (3, 1004, 1, 1, 4, 'delivered')
ON DUPLICATE KEY UPDATE status = VALUES(status);

INSERT INTO logs (request_id, assignment_id, actor_user_id, action_type, status, details)
VALUES
  (1001, NULL, 1, 'request_created', 'pending', 'Critical O- emergency request created'),
  (1002, 1, 2, 'request_accepted', 'accepted', 'Blood bank accepted the request'),
  (1003, 2, 3, 'status_updated', 'dispatched', 'Courier is currently in transit'),
  (1004, 3, 3, 'status_updated', 'delivered', 'Delivery completed successfully');
