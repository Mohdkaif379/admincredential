CREATE TABLE IF NOT EXISTS staff (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  employee_code VARCHAR(50) NOT NULL UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100),
  email VARCHAR(150),
  phone VARCHAR(20),
  gender ENUM('male','female','other'),
  date_of_birth DATE,
  department_id BIGINT,
  designation_id BIGINT,
  joining_date DATE,
  salary DECIMAL(10,2),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  status ENUM('active','inactive') DEFAULT 'active',
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_staff_department
    FOREIGN KEY (department_id) REFERENCES departments(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_staff_designation
    FOREIGN KEY (designation_id) REFERENCES designations(id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
