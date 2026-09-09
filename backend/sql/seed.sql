USE medilink;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE logs;
TRUNCATE TABLE assignments;
TRUNCATE TABLE emergency_requests;
TRUNCATE TABLE blood_inventory;
TRUNCATE TABLE couriers;
TRUNCATE TABLE blood_banks;
TRUNCATE TABLE hospitals;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO users (id, name, email, password, role, phone)
VALUES
  (1, 'CityCare Hospital', 'hospital@medilink.local', '$2a$10$vcNftv2zAhMADExLKRcJCuz595OAwd7eEqbpEfUA13RVFBG1VGMLK', 'hospital', '+91-9000000001'),
  (2, 'LifeLine Blood Bank', 'bloodbank@medilink.local', '$2a$10$vcNftv2zAhMADExLKRcJCuz595OAwd7eEqbpEfUA13RVFBG1VGMLK', 'blood_bank', '+91-9000000002'),
  (3, 'Swift Courier', 'courier@medilink.local', '$2a$10$vcNftv2zAhMADExLKRcJCuz595OAwd7eEqbpEfUA13RVFBG1VGMLK', 'courier', '+91-9000000003'),
  (4, 'MediLink Admin', 'admin@medilink.local', '$2a$10$vcNftv2zAhMADExLKRcJCuz595OAwd7eEqbpEfUA13RVFBG1VGMLK', 'admin', '+91-9000000004');

INSERT INTO hospitals (id, user_id, organization_name, address, latitude, longitude, service_radius_km, verification_status)
VALUES
  (1, 1, 'CityCare Hospital', 'MG Road, Bengaluru', 12.9716000, 77.5946000, 25, 'verified');

INSERT INTO blood_banks (id, user_id, organization_name, address, latitude, longitude, service_radius_km, verification_status)
VALUES
  (1, 2, 'LifeLine Blood Bank', 'Indiranagar, Bengaluru', 12.9784000, 77.6408000, 25, 'verified');

INSERT INTO couriers (id, user_id, organization_name, address, latitude, longitude, service_radius_km, verification_status, vehicle_type)
VALUES
  (1, 3, 'Swift Courier', 'Koramangala, Bengaluru', 12.9352000, 77.6245000, 50, 'verified', 'bike');

INSERT INTO blood_inventory (bank_id, blood_group, component_type, units_available, reserved_units)
VALUES
  (1, 'O-', 'whole_blood', 10, 2),
  (1, 'A+', 'whole_blood', 12, 1),
  (1, 'B-', 'platelets', 6, 1),
  (1, 'AB+', 'plasma', 8, 0);

INSERT INTO emergency_requests (id, hospital_id, blood_group, component_type, units_needed, urgency_level, status, latitude, longitude, notes)
VALUES
  (1001, 1, 'O-', 'whole_blood', 4, 'critical', 'pending', 12.9716000, 77.5946000, 'Emergency trauma support'),
  (1002, 1, 'A+', 'whole_blood', 2, 'high', 'accepted', 12.9716000, 77.5946000, 'ICU replenishment'),
  (1003, 1, 'B-', 'platelets', 3, 'critical', 'dispatched', 12.9716000, 77.5946000, 'Surgical emergency'),
  (1004, 1, 'AB+', 'plasma', 1, 'medium', 'delivered', 12.9716000, 77.5946000, 'Scheduled transfusion backup');

INSERT INTO assignments (id, request_id, courier_id, bank_id, assigned_by, status)
VALUES
  (1, 1002, 1, 1, 4, 'assigned'),
  (2, 1003, 1, 1, 4, 'in_transit'),
  (3, 1004, 1, 1, 4, 'delivered');

INSERT INTO logs (request_id, assignment_id, actor_user_id, action_type, status, details)
VALUES
  (1001, NULL, 1, 'request_created', 'pending', 'Critical O- emergency request created'),
  (1002, 1, 2, 'request_accepted', 'accepted', 'Blood bank accepted the request'),
  (1003, 2, 3, 'status_updated', 'dispatched', 'Courier is currently in transit'),
  (1004, 3, 3, 'status_updated', 'delivered', 'Delivery completed successfully');
