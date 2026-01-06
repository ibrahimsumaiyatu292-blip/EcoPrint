-- Enable UUID extension if needed, though we seem to use serials based on current code
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
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
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inventory Table
CREATE TABLE IF NOT EXISTS inventory (
    id SERIAL PRIMARY KEY,
    item_name TEXT NOT NULL UNIQUE,
    stock_quantity INTEGER DEFAULT 0,
    low_stock_threshold INTEGER DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_inventory_low_stock ON inventory(stock_quantity) WHERE stock_quantity <= low_stock_threshold;
