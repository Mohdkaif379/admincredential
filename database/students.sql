CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  roll_no VARCHAR(50) UNIQUE,
  email VARCHAR(100),
  phone VARCHAR(20),
  dob DATE,
  gender ENUM('male','female','other'),
  profile_image VARCHAR(255),

  father_name VARCHAR(100),
  father_phone VARCHAR(20),
  father_email VARCHAR(100),
  mother_name VARCHAR(100),
  mother_phone VARCHAR(20),
  mother_email VARCHAR(100),

  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),

  class_id BIGINT NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_students_class
    FOREIGN KEY (class_id) REFERENCES classes(id)
    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
