	use rr_food_corner;
	CREATE TABLE users (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(255),
		email VARCHAR(255) UNIQUE,
		mobile VARCHAR(20) UNIQUE,
		password_hash TEXT,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		is_admin BOOLEAN DEFAULT FALSE,
		is_superadmin BOOLEAN DEFAULT FALSE,
		manager BOOLEAN DEFAULT FALSE
	);

	select * from users; 

	CREATE TABLE admin_logs (
		id INT AUTO_INCREMENT PRIMARY KEY,
		admin_id INT,
		action VARCHAR(255),
		table_affected VARCHAR(100),
		record_id INT,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE SET NULL
	);
	select * from admin_logs; 

	CREATE TABLE otp_verifications (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT,
		otp_code VARCHAR(10),
		expires_at DATETIME,
		verified BOOLEAN DEFAULT FALSE,
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);
	select * from otp_verifications;

	CREATE TABLE addresses (
	  id INT AUTO_INCREMENT PRIMARY KEY,
	  user_id INT,
	  house_block_no VARCHAR(255),
	  area_road VARCHAR(255),
	  city VARCHAR(100),
	  district VARCHAR(100),
	  state VARCHAR(100),
	  country VARCHAR(100),
	  pincode VARCHAR(20),
	  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
	  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
	);
	select * from addresses;


	CREATE TABLE categories (
		id INT AUTO_INCREMENT PRIMARY KEY,
		name VARCHAR(100) UNIQUE NOT NULL,
		catimage_url VARCHAR(225)
	);

	SELECT * from categories;	

	CREATE TABLE food_items (
		id INT AUTO_INCREMENT PRIMARY KEY,
		item_code VARCHAR(20) UNIQUE NOT NULL,
		name VARCHAR(100) NOT NULL,
		category_id INT NOT NULL,
		food_type VARCHAR(50),
		combo_type VARCHAR(50),
		price DECIMAL(10, 2),
		subcontent VARCHAR(255),
		image_url VARCHAR(255),
		FOREIGN KEY (category_id) REFERENCES categories(id)
	);

	select * from food_items;

	CREATE TABLE order_status (
		id INT AUTO_INCREMENT PRIMARY KEY,
		user_id INT,
		items JSON,
		subtotal DECIMAL(10,2),
		discount DECIMAL(10,2),
		delivery_charge DECIMAL(10,2),
		taxes DECIMAL(10,2),
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	ALTER TABLE order_status 
	ADD COLUMN status VARCHAR(50) DEFAULT 'pending',
	ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

	select * from order_status;

drop table food_items;	
