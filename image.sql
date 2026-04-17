CREATE TABLE IF NOT EXISTS `nguoi_dung` (
	`nguoi_dung_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`mat_khau` VARCHAR(255) NOT NULL,
	`ho_ten` VARCHAR(255) NOT NULL,
	`tuoi` INT,
	`anh_dai_dien` VARCHAR(255),
	-- mặc định luôn luôn có
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS `hinh_anh` (
	`hinh_anh_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`ten_hinh` VARCHAR(255) NOT NULL,
	`duong_dan` VARCHAR(500) NOT NULL,
	`mo_ta` VARCHAR(500) NOT NULL,
	`tuoi` INT,
	`nguoi_dung_id`INT NOT NULL,
	-- mặc định luôn luôn có
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	
	CONSTRAINT `fk_hinh_nguoidung`
        FOREIGN KEY (`nguoi_dung_id`)
        REFERENCES `nguoi_dung`(`nguoi_dung_id`)
);

CREATE TABLE IF NOT EXISTS `binh_luan` (
	`binh_luan_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`nguoi_dung_id` INT NOT NULL ,
	`hinh_id` INT NOT NULL,
	`ngay_binh_luan` DATE NOT NULL,
	`noi_dung` VARCHAR(500) NOT NULL,
	-- mặc định luôn luôn có
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	
	CONSTRAINT `fk_binhluan_nguoidung`
        FOREIGN KEY (`nguoi_dung_id`)
        REFERENCES `nguoi_dung`(`nguoi_dung_id`),
        
    CONSTRAINT `fk_binhluan_hinhanh`
        FOREIGN KEY (`hinh_id`)
        REFERENCES `hinh_anh`(`hinh_anh_id`)    
);

CREATE TABLE IF NOT EXISTS `luu_anh` (
	`nguoi_dung_id` INT NOT NULL,
    `hinh_id` INT NOT NULL,
    `ngay_luu` DATE NOT NULL,
    
    PRIMARY KEY (`nguoi_dung_id`, `hinh_id`),
	-- mặc định luôn luôn có
	-- mặc định luôn luôn có
	`deletedBy` INT NOT NULL DEFAULT 0,
	`isDeleted` TINYINT(1) NOT NULL DEFAULT 0,
	`deletedAt` TIMESTAMP NULL DEFAULT NULL,
	`createdAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`updatedAt` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `fk_luuanh_nguoidung`
        FOREIGN KEY (`nguoi_dung_id`)
        REFERENCES `nguoi_dung`(`nguoi_dung_id`),
        
    CONSTRAINT `fk_luuanh_hinhanh`
        FOREIGN KEY (`hinh_id`)
        REFERENCES `hinh_anh`(`hinh_anh_id`)
);

ALTER TABLE hinh_anh 
DROP COLUMN tuoi;

SELECT * 
FROM luu_anh
WHERE nguoi_dung_id = 1 AND hinh_id = 7;
