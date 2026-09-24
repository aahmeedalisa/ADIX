-- ==============================================================================
-- ADIX Digital Store & SMM Platform — Production Database Schema
-- Compatible with PostgreSQL 14+ and SQLite 3.35+
-- ==============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(120) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'moderator')),
    password_hash VARCHAR(255),
    password_salt VARCHAR(64),
    avatar_url TEXT,
    phone VARCHAR(32),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. OAUTH ACCOUNTS TABLE (Backend Google OAuth 2.0 & Social Logins)
CREATE TABLE IF NOT EXISTS oauth_accounts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    provider VARCHAR(32) NOT NULL CHECK (provider IN ('google', 'apple', 'discord')),
    provider_user_id VARCHAR(255) NOT NULL,
    provider_email VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_oauth_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_oauth_provider_uid UNIQUE (provider, provider_user_id)
);

CREATE INDEX IF NOT EXISTS idx_oauth_user_id ON oauth_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_lookup ON oauth_accounts(provider, provider_user_id);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sub_title VARCHAR(200) NOT NULL,
    icon VARCHAR(64) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(sort_order);

-- 4. SERVICES / PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS services (
    id VARCHAR(64) PRIMARY KEY,
    category_id VARCHAR(32) NOT NULL,
    name VARCHAR(120) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    unit VARCHAR(64) NOT NULL,
    icon VARCHAR(64) NOT NULL,
    color VARCHAR(32),
    tag VARCHAR(64),
    description TEXT,
    is_social BOOLEAN NOT NULL DEFAULT FALSE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_services_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- 5. WALLETS TABLE
CREATE TABLE IF NOT EXISTS wallets (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    balance NUMERIC(12, 2) NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    currency VARCHAR(8) NOT NULL DEFAULT 'USD',
    is_frozen BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT uq_wallet_user UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);

-- 6. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    service_id VARCHAR(64),
    product_name VARCHAR(120) NOT NULL,
    target_account TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    kind VARCHAR(20) NOT NULL DEFAULT 'order' CHECK (kind IN ('order', 'deposit')),
    method VARCHAR(20) NOT NULL CHECK (method IN ('sham', 'wallet', 'crypto')),
    status VARCHAR(20) NOT NULL DEFAULT 'review' CHECK (status IN ('review', 'processing', 'completed', 'rejected', 'refunded')),
    transaction_ref VARCHAR(128),
    proof_image TEXT,
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_orders_service FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_kind ON orders(kind);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 7. WALLET TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS wallet_transactions (
    id VARCHAR(64) PRIMARY KEY,
    wallet_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    order_id VARCHAR(64),
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'purchase', 'refund', 'adjustment')),
    amount NUMERIC(10, 2) NOT NULL,
    balance_after NUMERIC(12, 2) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tx_wallet FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE,
    CONSTRAINT fk_tx_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_tx_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_transactions_wallet ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON wallet_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order ON wallet_transactions(order_id);

-- 8. COUPONS TABLE
CREATE TABLE IF NOT EXISTS coupons (
    id VARCHAR(64) PRIMARY KEY,
    code VARCHAR(32) NOT NULL,
    title VARCHAR(120) NOT NULL,
    description TEXT,
    discount_percent NUMERIC(5, 2) NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    min_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount NUMERIC(10, 2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_coupons_code UNIQUE (code)
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(is_active);

-- 9. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    title VARCHAR(150) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(32) NOT NULL DEFAULT 'system',
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    action_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_notif_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notif_created_at ON notifications(created_at DESC);

-- 10. SUPPORT TICKETS TABLE
CREATE TABLE IF NOT EXISTS support_tickets (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64),
    order_id VARCHAR(64),
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tickets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_tickets_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);

-- 11. SUPPORT TICKET REPLIES TABLE
CREATE TABLE IF NOT EXISTS support_replies (
    id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(64) NOT NULL,
    sender_role VARCHAR(20) NOT NULL CHECK (sender_role IN ('user', 'admin', 'system')),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reply_ticket FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_replies_ticket ON support_replies(ticket_id);

-- 12. DEVELOPER SETTINGS TABLE (Persistent Developer Profile & Dynamic Visibility)
CREATE TABLE IF NOT EXISTS developer_settings (
    id VARCHAR(32) PRIMARY KEY DEFAULT 'default',
    name VARCHAR(100) NOT NULL DEFAULT 'Ahmeed Alisa',
    description TEXT NOT NULL DEFAULT 'مطوّر ADIX — نصنع تجربة رقمية عربية، بتفاصيل أبسط ولمسة مختلفة.',
    avatar TEXT DEFAULT '',
    icon VARCHAR(64) NOT NULL DEFAULT 'code-slash-outline',
    instagram VARCHAR(255) DEFAULT 'https://www.instagram.com/ahmeed_alisa/',
    tiktok VARCHAR(255) DEFAULT 'https://www.tiktok.com/@ahmeed_alisa',
    x VARCHAR(255) DEFAULT 'https://x.com/Ahmeedalisa',
    website VARCHAR(255) DEFAULT '',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    show_home BOOLEAN NOT NULL DEFAULT FALSE,
    show_about BOOLEAN NOT NULL DEFAULT TRUE,
    show_menu BOOLEAN NOT NULL DEFAULT FALSE,
    show_footer BOOLEAN NOT NULL DEFAULT FALSE,
    show_social_icons BOOLEAN NOT NULL DEFAULT TRUE,
    show_name BOOLEAN NOT NULL DEFAULT TRUE,
    show_description BOOLEAN NOT NULL DEFAULT TRUE,
    home_position VARCHAR(32) NOT NULL DEFAULT 'beforeFooter' CHECK (home_position IN ('top', 'beforeServices', 'afterServices', 'beforeFooter', 'footer')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. SYSTEM SETTINGS TABLE (Payment & Platform Config)
CREATE TABLE IF NOT EXISTS system_settings (
    id VARCHAR(32) PRIMARY KEY DEFAULT 'main',
    sham_cash_name VARCHAR(120) NOT NULL DEFAULT 'ADIX • حساب موثق',
    sham_cash_number VARCHAR(64) NOT NULL DEFAULT 'ADIX-DEMO-0001',
    maintenance_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data
INSERT INTO developer_settings (id, name, description, avatar, icon, instagram, tiktok, x, website, enabled, show_home, show_about, show_menu, show_footer, show_social_icons, show_name, show_description, home_position)
VALUES (
    'default',
    'Ahmeed Alisa',
    'مطوّر ADIX — نصنع تجربة رقمية عربية، بتفاصيل أبسط ولمسة مختلفة.',
    '',
    'code-slash-outline',
    'https://www.instagram.com/ahmeed_alisa/',
    'https://www.tiktok.com/@ahmeed_alisa',
    'https://x.com/Ahmeedalisa',
    '',
    TRUE,
    FALSE,
    TRUE,
    FALSE,
    FALSE,
    TRUE,
    TRUE,
    TRUE,
    'beforeFooter'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO system_settings (id, sham_cash_name, sham_cash_number, maintenance_mode)
VALUES ('main', 'ADIX • حساب موثق', 'ADIX-DEMO-0001', FALSE)
ON CONFLICT (id) DO NOTHING;
