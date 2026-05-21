-- ============================================================
-- FarmDirect Database Schema
-- Recommended Hosting: InfinityFree / 000webhost (free)
--   or Railway.app / PlanetScale for production
-- MySQL 5.7+
-- ============================================================

CREATE DATABASE IF NOT EXISTS farmdirect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE farmdirect;

-- -------------------------------------------------------
-- USERS (shared base: farmer + buyer)
-- -------------------------------------------------------
CREATE TABLE users (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    username    VARCHAR(60) UNIQUE NOT NULL,
    email       VARCHAR(120) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,       -- bcrypt hashed
    role        ENUM('farmer','buyer','admin') NOT NULL DEFAULT 'buyer',
    full_name   VARCHAR(120) NOT NULL,
    age         TINYINT UNSIGNED,
    contact     VARCHAR(20),
    address     TEXT,
    profile_pic VARCHAR(255) DEFAULT NULL,
    status      ENUM('pending','active','rejected','suspended') DEFAULT 'pending',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -------------------------------------------------------
-- FARMER PROFILES (extends users where role='farmer')
-- -------------------------------------------------------
CREATE TABLE farmer_profiles (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNIQUE NOT NULL,
    store_name      VARCHAR(120) NOT NULL,
    store_photo     VARCHAR(255),
    farm_location   VARCHAR(200),
    province        VARCHAR(100),
    bio             TEXT,
    id_type         VARCHAR(60),
    id_photo        VARCHAR(255),
    gcash_number    VARCHAR(20),
    paymaya_number  VARCHAR(20),
    total_sales     DECIMAL(12,2) DEFAULT 0.00,
    rating          DECIMAL(3,2) DEFAULT 0.00,
    is_verified     TINYINT(1) DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- BUYER PROFILES (extends users where role='buyer')
-- -------------------------------------------------------
CREATE TABLE buyer_profiles (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNIQUE NOT NULL,
    preferred_categories VARCHAR(255),
    delivery_address TEXT,
    city            VARCHAR(100),
    province        VARCHAR(100),
    id_type         VARCHAR(60),
    id_photo        VARCHAR(255),
    face_photo      VARCHAR(255),
    total_orders    INT DEFAULT 0,
    total_spent     DECIMAL(12,2) DEFAULT 0.00,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- PRODUCTS (D3 | PRODUCT LIST)
-- -------------------------------------------------------
CREATE TABLE products (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id   INT NOT NULL,
    name        VARCHAR(150) NOT NULL,
    variety     VARCHAR(150) DEFAULT NULL,
    description TEXT,
    category    ENUM('Vegetables','Fruits','Grains','Herbs','RootCrops','Dairy','Others') NOT NULL,
    price       DECIMAL(10,2) NOT NULL,
    unit        VARCHAR(30) DEFAULT 'kg',
    stock_qty   INT DEFAULT 0,
    harvest_date DATE,
    availability ENUM('Onhand','To be harvested') DEFAULT 'Onhand',
    photo       VARCHAR(255),
    is_active   TINYINT(1) DEFAULT 1,
    is_deleted  TINYINT(1) DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- UPLOADED FILES (STORE FILE CONTENT IN DB)
-- -------------------------------------------------------
CREATE TABLE IF NOT EXISTS uploaded_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_type VARCHAR(50) NOT NULL,
    field_name VARCHAR(50) DEFAULT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INT NOT NULL,
    data MEDIUMBLOB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -------------------------------------------------------
-- ORDERS (D4 | ORDER RECORD)
-- -------------------------------------------------------
CREATE TABLE orders (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id        INT NOT NULL,
    farmer_id       INT NOT NULL,
    total_amount    DECIMAL(12,2) NOT NULL,
    delivery_fee    DECIMAL(8,2) DEFAULT 50.00,
    grand_total     DECIMAL(12,2) NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_date   DATE,
    status          ENUM('pending','confirmed','preparing','shipped','delivered','cancelled') DEFAULT 'pending',
    cancel_reason   TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id)  REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- ORDER ITEMS
-- -------------------------------------------------------
CREATE TABLE order_items (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,
    product_id  INT NOT NULL,
    qty         INT NOT NULL,
    unit_price  DECIMAL(10,2) NOT NULL,
    subtotal    DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- PAYMENTS (D5 | PAYMENT RECORD)
-- -------------------------------------------------------
CREATE TABLE payments (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT UNIQUE NOT NULL,
    buyer_id        INT NOT NULL,
    method          ENUM('gcash','paymaya') NOT NULL,
    reference_no    VARCHAR(100) NOT NULL,
    receipt_photo   VARCHAR(255),
    amount          DECIMAL(12,2) NOT NULL,
    status          ENUM('pending','verified','rejected') DEFAULT 'pending',
    verified_at     TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id)  REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id)  REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- DELIVERIES (D6 | DELIVERY RECORD)
-- -------------------------------------------------------
CREATE TABLE deliveries (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT UNIQUE NOT NULL,
    tracking_no     VARCHAR(100),
    logistics_name  VARCHAR(100),
    status          ENUM('pending','picked_up','in_transit','out_for_delivery','delivered','failed') DEFAULT 'pending',
    estimated_date  DATE,
    delivered_at    TIMESTAMP NULL,
    notes           TEXT,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- CANCEL ORDERS (D7 | CANCEL ORDER RECORD)
-- -------------------------------------------------------
CREATE TABLE cancel_orders (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,
    requested_by INT NOT NULL,
    reason      TEXT,
    status      ENUM('requested','approved','rejected') DEFAULT 'requested',
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id)      REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_by)  REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- ANALYTICS (D8 | ANALYTICS DATA)
-- -------------------------------------------------------
CREATE TABLE analytics (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    farmer_id   INT NOT NULL,
    month       TINYINT NOT NULL,
    year        SMALLINT NOT NULL,
    total_sales DECIMAL(12,2) DEFAULT 0.00,
    total_orders INT DEFAULT 0,
    avg_rating  DECIMAL(3,2) DEFAULT 0.00,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- COMMISSIONS (D9 | COMMISSION RECORD)
-- -------------------------------------------------------
CREATE TABLE commissions (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    order_id        INT NOT NULL,
    farmer_id       INT NOT NULL,
    order_total     DECIMAL(12,2) NOT NULL,
    rate            DECIMAL(4,2) NOT NULL DEFAULT 5.00,
    commission_amt  DECIMAL(10,2) NOT NULL,
    status          ENUM('pending','paid') DEFAULT 'pending',
    paid_at         TIMESTAMP NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id)  REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- REVIEWS
-- -------------------------------------------------------
CREATE TABLE reviews (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    order_id    INT NOT NULL,
    buyer_id    INT NOT NULL,
    farmer_id   INT NOT NULL,
    product_id  INT NOT NULL,
    rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment     TEXT,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (buyer_id)   REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farmer_id)  REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- -------------------------------------------------------
-- SEED: Admin account
-- password: admin123 (bcrypt hash)
-- -------------------------------------------------------
INSERT INTO users (username, email, password, role, full_name, status)
VALUES ('admin', 'admin@farmdirect.ph',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'admin', 'FarmDirect Admin', 'active');

-- -------------------------------------------------------
-- SEED: Sample farmer shops
-- -------------------------------------------------------
INSERT INTO users (username, email, password, role, full_name, age, contact, address, status)
VALUES ('juanfarm', 'juan@farm.ph',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'farmer', 'Juan Dela Cruz', 35, '+63 917 123 4567', 'Benguet, CAR', 'active');

INSERT INTO farmer_profiles (user_id, store_name, store_photo, farm_location, province, gcash_number, paymaya_number, bio, is_verified)
VALUES (2, 'Green Valley Farm', 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80', 'Km 5 La Trinidad', 'Benguet', '09171234567', '09171234568', 'Fresh vegetables grown in the mountain climate of Benguet.', 1);

INSERT INTO users (username, email, password, role, full_name, age, contact, address, status)
VALUES ('rosaorganics', 'rosa@farm.ph',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'farmer', 'Rosa Dela Cruz', 40, '+63 918 234 5678', 'Bukidnon, Northern Mindanao', 'active');

INSERT INTO farmer_profiles (user_id, store_name, store_photo, farm_location, province, gcash_number, paymaya_number, bio, is_verified)
VALUES (3, 'Rosa Organic Farm', 'https://images.unsplash.com/photo-1524592975376-6b1e7e4fd620?w=800&q=80', 'Dalisay, Impasugong', 'Bukidnon', '09182345678', '09182345679', 'Organic vegetables and herbs grown using eco-friendly methods.', 1);

INSERT INTO users (username, email, password, role, full_name, age, contact, address, status)
VALUES ('marcofarm', 'marco@farm.ph',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'farmer', 'Marco Reyes', 32, '+63 917 888 1234', 'Nueva Ecija, Central Luzon', 'active');

INSERT INTO farmer_profiles (user_id, store_name, store_photo, farm_location, province, gcash_number, paymaya_number, bio, is_verified)
VALUES (4, 'Marco''s Fields', 'https://images.unsplash.com/photo-1474920345566-8612db48b0da?w=800&q=80', 'Palayan City', 'Nueva Ecija', '09178881234', '09178881235', 'Field-grown fruits and staples from the rice bowls of Nueva Ecija.', 1);

-- -------------------------------------------------------
-- SEED: Products
-- -------------------------------------------------------
INSERT INTO products (farmer_id, name, description, category, price, unit, stock_qty, harvest_date, photo)
VALUES 
  (2, 'Benguet Lettuce', 'Crisp and fresh mountain lettuce.', 'Vegetables', 75.00, 'bundle', 45, '2026-05-01', 'https://images.unsplash.com/photo-1506806732259-39c2d0268443?w=800&q=80'),
  (2, 'Kabocha Squash', 'Sweet and tender squash from Benguet.', 'Vegetables', 85.00, 'kg', 30, '2026-04-29', 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80'),
  (3, 'Organic Basil', 'Aromatic basil leaves perfectly suited for fresh dishes.', 'Herbs', 120.00, 'bunch', 50, '2026-05-02', 'https://images.unsplash.com/photo-1524592975376-6b1e7e4fd620?w=800&q=80'),
  (3, 'Sweet Banana', 'Ripe Lakatan bananas straight from Bukidnon.', 'Fruits', 55.00, 'kg', 75, '2026-05-03', 'https://images.unsplash.com/photo-1574226516831-e1dff420e43e?w=800&q=80'),
  (4, 'Premium Rice', 'Locally milled premium rice from Nueva Ecija.', 'Grains', 58.00, 'kg', 120, '2026-05-01', 'https://images.unsplash.com/photo-1542718616-5fb5dfff010f?w=800&q=80'),
  (4, 'Sweet Corn', 'Freshly harvested sweet corn ears.', 'Vegetables', 42.00, 'piece', 90, '2026-05-04', 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&q=80');

INSERT INTO products (farmer_id, name, description, category, price, unit, stock_qty, photo) VALUES
(2, 'Fresh Broccoli',    'Fresh, organically grown broccoli',    'Vegetables', 80,  'kg',     50, 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400'),
(2, 'Organic Tomatoes',  'Vine-ripened organic tomatoes',        'Vegetables', 60,  'kg',     80, 'https://images.unsplash.com/photo-1546094096-0df4bcabd337?w=400'),
(2, 'Fresh Carrots',     'Sweet, crunchy carrots',               'Vegetables', 50,  'kg',     60, 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400'),
(2, 'Fresh Cabbage',     'Crisp, fresh cabbage',                 'Vegetables', 45,  'kg',     40, 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400'),
(2, 'Sweet Mangoes',     'Sweet, ripe Philippine mangoes',       'Fruits',     90,  'kg',     30, 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'),
(2, 'White Rice',        'Premium white rice, freshly milled',   'Grains',     55,  'kg',    100, 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'),
(2, 'Fresh Ginger',      'Aromatic, fresh-picked ginger',        'Herbs',      70,  'kg',     25, 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400'),
(2, 'Sweet Potato',      'Sweet, nutritious kamote',             'RootCrops',  35,  'kg',     70, 'https://images.unsplash.com/photo-1596097635121-14b63b7a0c19?w=400'),
(2, 'Free Range Eggs',   'Fresh free-range chicken eggs',        'Dairy',     180,  'dozen',  20, 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400'),
(2, 'Fresh Spinach',     'Tender, freshly harvested spinach',    'Vegetables', 65,  'bundle', 35, 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400');

-- -------------------------------------------------------
-- SEED: Sample buyer
-- -------------------------------------------------------
INSERT INTO users (username, email, password, role, full_name, age, contact, address, status)
VALUES ('mariabuy', 'maria@buyer.ph',
        '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        'buyer', 'Maria Santos', 28, '+63 918 765 4321', 'Quezon City, NCR', 'active');

INSERT INTO buyer_profiles (user_id, delivery_address, city, province)
VALUES (5, '123 Quezon Ave, Quezon City', 'Quezon City', 'Metro Manila');
