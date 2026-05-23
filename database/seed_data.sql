USE customcraft_furniture;

-- =============================================
-- SEED: Admin User (password: Admin@123)
-- =============================================
INSERT INTO users (first_name, last_name, email, password, phone, role, is_active, is_email_verified) VALUES
('Admin', 'CustomCraft', 'admin@customcraft.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543210', 'admin', TRUE, TRUE),
('Rahul', 'Sharma', 'rahul@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543211', 'user', TRUE, TRUE),
('Priya', 'Patel', 'priya@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543212', 'user', TRUE, TRUE),
('Amit', 'Kumar', 'amit@example.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543213', 'user', TRUE, TRUE);

-- =============================================
-- SEED: Categories
-- =============================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Living Room', 'living-room', 'Elegant furniture for your living space', 1),
('Bedroom', 'bedroom', 'Comfortable and stylish bedroom furniture', 2),
('Dining Room', 'dining-room', 'Beautiful dining sets for family gatherings', 3),
('Office', 'office', 'Professional and ergonomic office furniture', 4),
('Outdoor', 'outdoor', 'Durable furniture for outdoor spaces', 5),
('Kids Room', 'kids-room', 'Fun and safe furniture for children', 6);

-- =============================================
-- SEED: Products
-- =============================================
INSERT INTO products (category_id, name, slug, description, short_description, base_price, sale_price, sku, stock_quantity, is_featured, is_customizable, average_rating, total_reviews) VALUES
(1, 'Royal Oak Sofa Set', 'royal-oak-sofa-set', 'Luxurious 3+2 sofa set crafted from premium teak wood with premium cushioning. Perfect centerpiece for any living room.', 'Premium 3+2 sofa set in solid teak wood', 45999.00, 39999.00, 'SOF-001', 25, TRUE, TRUE, 4.5, 42),
(1, 'Walnut Coffee Table', 'walnut-coffee-table', 'Hand-crafted coffee table with beautiful walnut wood finish. Features storage drawer and glass top.', 'Elegant walnut coffee table with glass top', 12999.00, 10999.00, 'TAB-001', 40, TRUE, TRUE, 4.3, 28),
(1, 'Sheesham Wood TV Unit', 'sheesham-wood-tv-unit', 'Solid Sheesham wood TV unit with multiple compartments and cable management. Fits TVs up to 65 inches.', 'Solid wood TV unit with storage', 18999.00, 15999.00, 'TVU-001', 18, FALSE, TRUE, 4.1, 19),
(2, 'King Size Platform Bed', 'king-size-platform-bed', 'Stunning king size platform bed in solid rosewood. Includes hydraulic storage mechanism and premium upholstered headboard.', 'King size bed with hydraulic storage', 55999.00, 48999.00, 'BED-001', 15, TRUE, TRUE, 4.7, 56),
(2, 'Wardrobe 6-Door Sliding', 'wardrobe-6-door-sliding', '6-door sliding wardrobe with mirrors, internal shelving, and hanging space. Available in multiple finishes.', 'Spacious 6-door sliding wardrobe', 38999.00, 32999.00, 'WAR-001', 12, FALSE, TRUE, 4.4, 33),
(3, 'Extendable Dining Table Set', 'extendable-dining-table-set', 'Premium 6-seater dining table set that extends to 8 seats. Crafted from solid mango wood with cushioned chairs.', '6-8 seater extendable dining set', 42999.00, 36999.00, 'DIN-001', 20, TRUE, TRUE, 4.6, 47),
(4, 'Executive Boss Chair', 'executive-boss-chair', 'High-back executive chair with lumbar support, adjustable height, and premium PU leather. Perfect for long work hours.', 'Premium executive office chair', 15999.00, 12999.00, 'CHR-001', 35, TRUE, FALSE, 4.2, 24),
(4, 'L-Shape Office Desk', 'l-shape-office-desk', 'Spacious L-shape office desk with wire management, drawer unit, and keyboard tray. Maximizes your workspace.', 'Large L-shape work desk', 22999.00, 18999.00, 'DSK-001', 22, FALSE, TRUE, 4.0, 16),
(1, 'Rocking Armchair', 'rocking-armchair', 'Classic rocking armchair in solid teak with handwoven cane back. A timeless piece for any corner.', 'Classic rocking chair in teak wood', 8999.00, 7499.00, 'CHR-002', 30, FALSE, TRUE, 4.4, 21),
(2, 'Bedside Table Pair', 'bedside-table-pair', 'Set of 2 matching bedside tables with drawer and lower shelf. Solid sheesham wood construction.', 'Pair of matching bedside tables', 6999.00, 5999.00, 'BST-001', 45, FALSE, TRUE, 4.1, 14);

-- =============================================
-- SEED: Customization Options
-- =============================================
INSERT INTO product_customization_options (product_id, option_type, option_name, option_value, price_modifier, hex_color, sort_order) VALUES
-- Royal Oak Sofa Set sizes
(1, 'size', '2 Seater', '2-seater', -8000.00, NULL, 1),
(1, 'size', '3 Seater', '3-seater', 0.00, NULL, 2),
(1, 'size', '3+2 Seater', '3-2-seater', 8000.00, NULL, 3),
(1, 'size', 'L-Shape', 'l-shape', 15000.00, NULL, 4),
-- Wood types
(1, 'wood_type', 'Teak Wood', 'teak', 0.00, NULL, 1),
(1, 'wood_type', 'Sheesham Wood', 'sheesham', -2000.00, NULL, 2),
(1, 'wood_type', 'Mango Wood', 'mango', -3000.00, NULL, 3),
(1, 'wood_type', 'Walnut Wood', 'walnut', 5000.00, NULL, 4),
-- Colors
(1, 'color', 'Honey Oak', 'honey-oak', 0.00, '#C68642', 1),
(1, 'color', 'Dark Walnut', 'dark-walnut', 0.00, '#4A2C0A', 2),
(1, 'color', 'Natural Teak', 'natural-teak', 0.00, '#9B6B3C', 3),
(1, 'color', 'Mahogany', 'mahogany', 0.00, '#7B3C2A', 4),
-- Fabric types
(1, 'fabric', 'Premium Cotton', 'cotton', 0.00, NULL, 1),
(1, 'fabric', 'Velvet', 'velvet', 3000.00, NULL, 2),
(1, 'fabric', 'Linen', 'linen', 1000.00, NULL, 3),
(1, 'fabric', 'Leather', 'leather', 8000.00, NULL, 4),
-- King Bed customizations
(4, 'size', 'Queen (150x200 cm)', 'queen', -5000.00, NULL, 1),
(4, 'size', 'King (180x200 cm)', 'king', 0.00, NULL, 2),
(4, 'size', 'Super King (200x200 cm)', 'super-king', 5000.00, NULL, 3),
(4, 'wood_type', 'Teak Wood', 'teak', 0.00, NULL, 1),
(4, 'wood_type', 'Rosewood', 'rosewood', 8000.00, NULL, 2),
(4, 'wood_type', 'Sheesham', 'sheesham', -3000.00, NULL, 3),
(4, 'color', 'Dark Walnut', 'dark-walnut', 0.00, '#4A2C0A', 1),
(4, 'color', 'Natural', 'natural', 0.00, '#C68642', 2),
(4, 'color', 'Ebony', 'ebony', 0.00, '#1C1208', 3);

-- =============================================
-- SEED: Coupons
-- =============================================
INSERT INTO coupons (code, description, discount_type, discount_value, min_purchase_amount, max_discount_amount, usage_limit, valid_from, valid_until) VALUES
('WELCOME10', 'Welcome discount for new users - 10% off', 'percentage', 10.00, 5000.00, 2000.00, 100, '2024-01-01', '2024-12-31'),
('FLAT500', 'Flat ₹500 off on orders above ₹10,000', 'fixed', 500.00, 10000.00, 500.00, 50, '2024-01-01', '2024-12-31'),
('FURNITURE20', 'Special 20% off on all furniture', 'percentage', 20.00, 15000.00, 5000.00, 30, '2024-06-01', '2024-06-30'),
('NEWUSER15', 'New user special - 15% off', 'percentage', 15.00, 8000.00, 3000.00, 200, '2024-01-01', '2024-12-31');

-- =============================================
-- SEED: Inventory
-- =============================================
INSERT INTO inventory (product_id, quantity_available, quantity_reserved, quantity_sold, reorder_level) VALUES
(1, 25, 3, 42, 5),
(2, 40, 2, 28, 8),
(3, 18, 1, 19, 5),
(4, 15, 2, 56, 3),
(5, 12, 0, 33, 3),
(6, 20, 4, 47, 5),
(7, 35, 3, 24, 10),
(8, 22, 1, 16, 5),
(9, 30, 2, 21, 8),
(10, 45, 3, 14, 10);

-- =============================================
-- SEED: Reviews
-- =============================================
INSERT INTO reviews (product_id, user_id, rating, title, review_text, is_verified_purchase, is_approved) VALUES
(1, 2, 5, 'Absolutely stunning sofa!', 'The Royal Oak Sofa Set exceeded all my expectations. The wood quality is premium and the cushions are so comfortable. Delivery was on time and the installation team was professional.', TRUE, TRUE),
(1, 3, 4, 'Great quality, minor delivery delay', 'Beautiful furniture, exactly as shown. Only reason for 4 stars is the delivery took 2 extra days. But the product is worth every penny!', TRUE, TRUE),
(4, 2, 5, 'Dream bed!', 'The king size bed is absolutely gorgeous. The hydraulic storage is very useful. Highly recommend CustomCraft!', TRUE, TRUE),
(6, 3, 5, 'Perfect dining set', 'Family loves it! The extendable feature is very practical when guests come over. Solid wood, excellent craftsmanship.', TRUE, TRUE),
(7, 4, 4, 'Comfortable chair', 'Good office chair, great lumbar support. After 8 hours sitting, no back pain!', TRUE, TRUE);
