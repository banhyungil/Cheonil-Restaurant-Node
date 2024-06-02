-- cheonildb.config definition

CREATE TABLE `config` (
  `key` varchar(20) NOT NULL,
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`config`)),
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='설정\n각종 설정을 json 타입으로 저장한다.';


-- cheonildb.menu definition

CREATE TABLE `menu` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(20) DEFAULT NULL,
  `name` varchar(20) NOT NULL,
  `nameAbv` varchar(10) DEFAULT NULL COMMENT '이름 약어',
  `price` bigint(20) NOT NULL,
  `cmt` varchar(1000) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_menu_menu_category1_idx` (`categoryName`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='메뉴';


-- cheonildb.menu_category definition

CREATE TABLE `menu_category` (
  `name` varchar(20) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `order` tinyint(3) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='메뉴 카테고리';


-- cheonildb.order_menu_rsv definition

CREATE TABLE `order_menu_rsv` (
  `orderRsvId` bigint(20) unsigned NOT NULL,
  `menuId` bigint(20) unsigned NOT NULL,
  `price` bigint(20) NOT NULL COMMENT '가격\nmenu는 가격이 바뀔수가 있음',
  `cnt` bigint(20) unsigned NOT NULL COMMENT '수량',
  PRIMARY KEY (`orderRsvId`,`menuId`),
  KEY `fk_t_order_menu_menu1_idx` (`menuId`),
  KEY `fk_t_order_menu_copy1_t_order_rsv1_idx` (`orderRsvId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 메뉴';


-- cheonildb.order_rsv definition

CREATE TABLE `order_rsv` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `storeId` bigint(20) unsigned NOT NULL,
  `amount` bigint(20) DEFAULT NULL COMMENT '총 금액',
  `payType` enum('CASH','CARD') NOT NULL DEFAULT 'CASH' COMMENT 'CASH: 현금, CARD: 카드',
  `rsvTime` varchar(5) NOT NULL COMMENT 'HH:MM',
  `reqCmt` varchar(100) DEFAULT NULL COMMENT '기타 정보',
  `daysOfWeek` varchar(3) DEFAULT NULL COMMENT '요일 배열\r\nJS의 Date.getDay() 값\r\n0:일요일 ~ 6: 토요일\r\nex) 월요일, 수요일 예약\r\n[1, 3]',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_t_order_rsv_store1_idx` (`storeId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 예약\n예약 정보에 따라 t_order를 생성한다';


-- cheonildb.store definition

CREATE TABLE `store` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `categoryName` varchar(40) DEFAULT NULL COMMENT 'FK(store_category)',
  `name` varchar(40) NOT NULL,
  `cmt` varchar(1000) DEFAULT NULL COMMENT '기타 정보',
  `placeCtgName` varchar(100) DEFAULT NULL COMMENT 'FK(placeCategory)\r\n장소 카테고리',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_store_store_category1_idx` (`categoryName`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- cheonildb.store_category definition

CREATE TABLE `store_category` (
  `name` varchar(40) NOT NULL,
  `order` tinyint(3) unsigned NOT NULL DEFAULT 0,
  `placeCtgName` varchar(100) DEFAULT NULL COMMENT 'FK(placeCategory)',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


-- cheonildb.t_order definition

CREATE TABLE `t_order` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `storeId` bigint(20) unsigned NOT NULL,
  `amount` bigint(20) NOT NULL COMMENT '총 금액',
  `payType` enum('CASH','CARD') DEFAULT 'CASH' COMMENT 'CASH: 현금, CARD: 카드',
  `status` enum('READY','COMPLETE') NOT NULL DEFAULT 'READY' COMMENT 'READY: 준비, COMPLETE: 완료',
  `orderTime` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '주문 시간',
  `completeTime` timestamp NULL DEFAULT NULL COMMENT '주문 완료 시간',
  `payTime` timestamp NULL DEFAULT NULL COMMENT '지급날짜',
  `reqCmt` varchar(100) DEFAULT NULL COMMENT '기타 정보',
  `createdAt` timestamp NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `fk_t_order_store1_idx` (`storeId`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문';


-- cheonildb.t_order_menu definition

CREATE TABLE `t_order_menu` (
  `orderId` bigint(20) unsigned NOT NULL,
  `menuId` bigint(20) unsigned NOT NULL,
  `price` bigint(20) NOT NULL COMMENT '가격\nmenu는 가격이 바뀔수가 있음',
  `cnt` bigint(20) unsigned NOT NULL COMMENT '수량',
  PRIMARY KEY (`orderId`,`menuId`),
  KEY `fk_t_order_menu_menu1_idx` (`menuId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 메뉴';


-- cheonildb.placeCategory definition

CREATE TABLE `placeCategory` (
  `name` varchar(100) NOT NULL,
  `cmt` varchar(400) DEFAULT NULL COMMENT '주석',
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='장소 카테고리';