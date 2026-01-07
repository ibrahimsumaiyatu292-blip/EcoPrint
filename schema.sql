-- WARNING: This will delete existing data! Use mainly for initial setup/reset.
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS customers;

-- Enable UUID extension if needed, though we seem to use serials based on current code
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers Table
CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    order_number TEXT NOT NULL UNIQUE,
    service_type TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    status TEXT DEFAULT 'pending', -- pending, in-progress, completed, cancelled
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    
    -- File Upload fields
    file_url TEXT,
    file_name TEXT,
    file_size INTEGER,
    file_mime TEXT,
    
    -- Delivery Info
    delivery_address TEXT,
    due_date DATE,
    
    -- Payment Info
    payment_method TEXT DEFAULT 'pay_on_delivery', -- 'pay_on_delivery' or 'paystack'
    payment_status TEXT DEFAULT 'pending', -- 'pending' or 'paid'
    payment_reference TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_inventory_low_stock ON inventory(stock_quantity) WHERE stock_quantity <= low_stock_threshold;
