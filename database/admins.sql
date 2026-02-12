CREATE TABLE IF NOT EXISTS admins (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,

  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  username VARCHAR(100) UNIQUE,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20),

  password VARCHAR(255) NOT NULL,
  remember_token VARCHAR(255),
  last_login_at DATETIME,
  last_login_ip VARCHAR(45),

  role VARCHAR(50) DEFAULT 'admin',
  is_super_admin TINYINT(1) DEFAULT 0,

  profile_image VARCHAR(255),
  gender ENUM('male', 'female', 'other'),
  dob DATE,

  status ENUM('active', 'inactive', 'blocked') DEFAULT 'active',
  email_verified TINYINT(1) DEFAULT 0,
  phone_verified TINYINT(1) DEFAULT 0,

  two_factor_enabled TINYINT(1) DEFAULT 0,
  failed_login_attempts INT DEFAULT 0,
  account_locked_until DATETIME,

  created_by VARCHAR(100),
  updated_by VARCHAR(100),

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
