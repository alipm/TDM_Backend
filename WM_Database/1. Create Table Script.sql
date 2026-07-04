/*Step1: Schema Creation*/
CREATE SCHEMA WM;

USE WM;

/*Step2: User Table Creation*/
CREATE TABLE WM.users (
    user_id CHAR(36) PRIMARY KEY,          -- Unique identifier (UUID)
    username VARCHAR(100) UNIQUE NOT NULL,       -- Username for login
	email VARCHAR(255) UNIQUE NOT NULL,   -- User email (unique constraint)
    password_hash VARCHAR(255) NOT NULL,  -- Encrypted password
	role ENUM('User', 'Admin') DEFAULT 'user', -- Role of the user
	status ENUM('Active', 'Inactive', 'Banned') DEFAULT 'active', -- Account status
	last_modified_by CHAR(36),                 -- User ID of the admin who modified this user : :
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Record creation time
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, -- Last update time
	FOREIGN KEY (last_modified_by) REFERENCES users(user_id) -- Links creator to the user table
);

-- Customers Table
CREATE TABLE WM.customers (
    transaction_id CHAR(36) NOT NULL PRIMARY KEY, -- Unique transaction ID, now the primary key
	customer_id CHAR(36) NOT NULL,
    customer_type ENUM('R', 'C', 'O') NOT NULL, -- Ensure correct ENUM syntax -- Customer type as ENUM for constraints
    customer_name VARCHAR(255) NOT NULL, -- Customer's business or personal name
    contact_name VARCHAR(255) NOT NULL, -- Primary contact name
    address_line1 VARCHAR(255) NOT NULL, -- Street address
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL, -- Ensures no duplicate email
    phone VARCHAR(20) NOT NULL,
    environment VARCHAR(50), -- Environment (if applicable)
    mas_library VARCHAR(50), -- MAS library identifier
    company_code VARCHAR(50), -- Company-specific code
	created_by CHAR(36) NOT NULL, -- User ID of the creator (FK to WM.users.user_id)
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    -- Add a UNIQUE constraint for transaction_id (optional but recommended for faster lookups)
);

-- Service address Table
CREATE TABLE WM.service_addresses (
    transaction_id CHAR(36) NOT NULL, -- Linked to customers table
    service_name VARCHAR(255) NOT NULL, -- Service name
    contact_name VARCHAR(255), -- Contact for service
    address_line1 VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zipcode VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES customers(transaction_id) ON DELETE CASCADE
);

-- Billing Information Table
CREATE TABLE WM.billing_info (
    transaction_id CHAR(36) PRIMARY KEY, -- Links to the customers table (UUID)
    billing_cycle VARCHAR(255) NOT NULL, -- Use ENUM for common cycles
    start_date DATE NOT NULL,
    contract_type VARCHAR(255) NOT NULL, -- Predefined contract types
    contract_date DATE,
    country_code VARCHAR(20), -- County or jurisdiction code
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES customers(transaction_id) ON DELETE CASCADE
);

-- Service Lines Table
CREATE TABLE WM.service_lines (
    transaction_id CHAR(36) PRIMARY KEY, -- Links to the customers table (UUID)
    svc VARCHAR(255) NOT NULL, -- Service line identifier
    waste_type VARCHAR(255) NOT NULL, -- Predefined waste categories
    service_cycle VARCHAR(50), -- Service cycle identifier
    tax BOOLEAN DEFAULT FALSE, -- Tax applicable or not
    tp BOOLEAN DEFAULT FALSE, -- T/P field for additional data
    municipal_code VARCHAR(50), -- Municipal code for jurisdiction
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (transaction_id) REFERENCES customers(transaction_id) ON DELETE CASCADE
);

-- Routes Table
CREATE TABLE WM.routes (
    transaction_id CHAR(36) NOT NULL, -- Links to customers table
    day_of_week VARCHAR(255) NOT NULL, -- Day of the week -- sample day_of_week ENUM('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun')
    route_code VARCHAR(50) NOT NULL, -- Code for specific route (e.g., "1AT", "2BT")
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (transaction_id, day_of_week), -- Composite primary key to allow multiple routes 
	FOREIGN KEY (transaction_id) REFERENCES service_lines(transaction_id) ON DELETE CASCADE
);

-- Ticker creation Table
CREATE TABLE WM.tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for the ticket
    mas_customer_id CHAR(36) NOT NULL,              -- References WM.customers.customer_id
    environment VARCHAR(50),                  -- Dropdown field for environment
    sub_category VARCHAR(100),                -- Sub-category text input
    dispatch_date DATE NOT NULL,              -- Dispatch date (date picker field)
    ESB_transaction_id VARCHAR(50),           -- FSB Transaction ID (text input)
    waste_type VARCHAR(50),                   -- Waste type (text input)
    category VARCHAR(100),                    -- Dropdown field for category
    swappable_flag ENUM('True', 'False') DEFAULT 'False', -- Store as TRUE/FALSE
	created_by CHAR(36) NOT NULL, -- User ID of the creator (FK to WM.users.user_id)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
 -- FOREIGN KEY (mas_customer_id) REFERENCES WM.customers(customer_id) ON DELETE CASCADE -- Foreign key linking to customers
);
