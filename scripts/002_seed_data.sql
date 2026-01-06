-- Insert sample inventory items
INSERT INTO inventory (item_name, category, stock_quantity, unit_price, low_stock_threshold, supplier) VALUES
  ('A4 White Paper (500 sheets)', 'Paper', 150, 5.99, 20, 'PaperCo Ltd'),
  ('A3 Glossy Paper (100 sheets)', 'Paper', 80, 12.99, 15, 'PaperCo Ltd'),
  ('Business Card Stock (250gsm)', 'Card Stock', 200, 15.99, 25, 'CardPro'),
  ('Vinyl Banner Material (per meter)', 'Vinyl', 50, 8.50, 10, 'SignSupply'),
  ('Matte Photo Paper (A4, 100 sheets)', 'Photo Paper', 60, 18.99, 10, 'PhotoPrint Inc'),
  ('Cyan Ink Cartridge', 'Ink', 45, 35.00, 8, 'InkWorld'),
  ('Magenta Ink Cartridge', 'Ink', 42, 35.00, 8, 'InkWorld'),
  ('Yellow Ink Cartridge', 'Ink', 40, 35.00, 8, 'InkWorld'),
  ('Black Ink Cartridge', 'Ink', 55, 30.00, 10, 'InkWorld'),
  ('Laminating Film (A4, 100 sheets)', 'Finishing', 35, 22.50, 5, 'FinishPro');

-- Insert sample customers
INSERT INTO customers (name, email, phone, company) VALUES
  ('John Smith', 'john.smith@example.com', '+1234567890', 'Smith Enterprises'),
  ('Sarah Johnson', 'sarah.j@example.com', '+1234567891', 'Creative Solutions'),
  ('Michael Brown', 'mbrown@example.com', '+1234567892', 'Brown & Associates'),
  ('Emily Davis', 'emily.davis@example.com', '+1234567893', 'Davis Marketing'),
  ('David Wilson', 'david.w@example.com', '+1234567894', NULL);

-- Insert sample orders
INSERT INTO orders (customer_id, order_number, service_type, quantity, paper_type, size, color_option, finishing, turnaround, status, total_amount, notes, order_date, due_date) VALUES
  (1, 'ORD-2025-001', 'Business Cards', 500, 'Card Stock', '3.5 x 2 inches', 'Full Color', 'Glossy', '3-5 days', 'completed', 125.00, 'Double-sided printing', '2025-01-01 10:30:00', '2025-01-05 17:00:00'),
  (2, 'ORD-2025-002', 'Flyers', 1000, 'A4 White Paper', 'A4', 'Full Color', 'Matte', '2-3 days', 'in-progress', 250.00, 'Event promotion flyers', '2025-01-03 14:20:00', '2025-01-06 12:00:00'),
  (3, 'ORD-2025-003', 'Banners', 2, 'Vinyl', '6ft x 3ft', 'Full Color', 'Grommets', '5-7 days', 'pending', 180.00, 'Outdoor banners for shop opening', '2025-01-05 09:15:00', '2025-01-12 17:00:00'),
  (4, 'ORD-2025-004', 'Brochures', 250, 'Glossy Paper', 'A4', 'Full Color', 'Folded', '3-5 days', 'in-progress', 320.00, 'Tri-fold brochures', '2025-01-04 16:45:00', '2025-01-09 12:00:00'),
  (5, 'ORD-2025-005', 'Posters', 50, 'Photo Paper', 'A3', 'Full Color', 'None', '1-2 days', 'completed', 95.00, 'High quality photo posters', '2025-01-02 11:00:00', '2025-01-04 17:00:00');
