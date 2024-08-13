-- cheonil.MenuCategory definition

CREATE TABLE `MenuCategory` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '메뉴 카테고리 Seq',
  `name` varchar(20) NOT NULL COMMENT '메뉴 카테고리 명',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='메뉴 카테고리';


-- cheonil.PlaceCategory definition

CREATE TABLE `PlaceCategory` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '장소 카테고리 Seq',
  `name` varchar(100) NOT NULL COMMENT '장소 카테고리 명',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='장소 카테고리';


-- cheonil.Setting definition

CREATE TABLE `Setting` (
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '설정 정보' CHECK (json_valid(`config`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='설정';


-- cheonil.Menu definition

CREATE TABLE `Menu` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '메뉴 Seq',
  `ctgSeq` smallint(5) unsigned NOT NULL COMMENT '메뉴 카테고리 Seq',
  `name` varchar(45) NOT NULL COMMENT '메뉴 명',
  `abv` varchar(10) DEFAULT NULL COMMENT '이름 약어',
  `price` int(10) unsigned NOT NULL COMMENT '가격',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`),
  KEY `FK_MenuCategory_TO_Menu` (`ctgSeq`),
  CONSTRAINT `FK_MenuCategory_TO_Menu` FOREIGN KEY (`ctgSeq`) REFERENCES `MenuCategory` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='메뉴';


-- cheonil.StoreCategory definition

CREATE TABLE `StoreCategory` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '매장 카테고리 Seq',
  `placeCtgSeq` smallint(5) unsigned DEFAULT NULL COMMENT '장소 카테고리 Seq',
  `name` varchar(45) NOT NULL COMMENT '매장 카테고리 명',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`),
  KEY `FK_PlaceCategory_TO_StoreCategory` (`placeCtgSeq`),
  CONSTRAINT `FK_PlaceCategory_TO_StoreCategory` FOREIGN KEY (`placeCtgSeq`) REFERENCES `PlaceCategory` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='매장 카테고리';


-- cheonil.Store definition

CREATE TABLE `Store` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '매장 Seq',
  `ctgSeq` smallint(5) unsigned NOT NULL COMMENT '매장 카테고리 Seq',
  `placeCtgSeq` smallint(5) unsigned DEFAULT NULL COMMENT '장소 카테고리 Seq',
  `name` varchar(45) NOT NULL COMMENT '매장 명',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '기타 정보',
  `latitude` float DEFAULT NULL COMMENT '위도',
  `longitude` float DEFAULT NULL COMMENT '경도',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`),
  KEY `FK_PlaceCategory_TO_Store` (`placeCtgSeq`),
  KEY `FK_StoreCategory_TO_Store` (`ctgSeq`),
  CONSTRAINT `FK_PlaceCategory_TO_Store` FOREIGN KEY (`placeCtgSeq`) REFERENCES `PlaceCategory` (`seq`),
  CONSTRAINT `FK_StoreCategory_TO_Store` FOREIGN KEY (`ctgSeq`) REFERENCES `StoreCategory` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='매장';


-- cheonil.MyOrder definition

CREATE TABLE `MyOrder` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '주문 Seq',
  `storeSeq` smallint(5) unsigned NOT NULL COMMENT '매장 Seq',
  `amount` int(10) unsigned NOT NULL COMMENT '총 금액',
  `status` enum('READY','COOKED','PAID') NOT NULL DEFAULT 'READY' COMMENT 'READY: 준비, COOKED: 요리 완료, PAID: 결제 완료',
  `orderAt` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '주문 시간',
  `completeAt` timestamp NULL DEFAULT NULL COMMENT '조리완료 시간',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '비고',
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_Store_TO_MyOrder` (`storeSeq`),
  CONSTRAINT `FK_Store_TO_MyOrder` FOREIGN KEY (`storeSeq`) REFERENCES `Store` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문';


-- cheonil.OrderMenu definition

CREATE TABLE `OrderMenu` (
  `menuSeq` smallint(5) unsigned NOT NULL COMMENT '메뉴 Seq',
  `orderSeq` bigint(20) unsigned NOT NULL COMMENT '주문 Seq',
  `price` int(10) unsigned NOT NULL COMMENT '가격 menu는 가격이 바뀔수가 있음',
  `cnt` tinyint(3) unsigned NOT NULL COMMENT '수량',
  PRIMARY KEY (`menuSeq`,`orderSeq`),
  KEY `FK_MyOrder_TO_OrderMenu` (`orderSeq`),
  CONSTRAINT `FK_Menu_TO_OrderMenu` FOREIGN KEY (`menuSeq`) REFERENCES `Menu` (`seq`),
  CONSTRAINT `FK_MyOrder_TO_OrderMenu` FOREIGN KEY (`orderSeq`) REFERENCES `MyOrder` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 메뉴';


-- cheonil.OrderRsv definition

CREATE TABLE `OrderRsv` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '주문예약 Seq',
  `storeSeq` smallint(5) unsigned NOT NULL COMMENT '매장 Seq',
  `amount` int(10) unsigned NOT NULL COMMENT '총 금액',
  `rsvTime` char(5) NOT NULL COMMENT 'HH:MM',
  `dayType` enum('MON','TUE','WED','THU','FRI','SAT','SUN') DEFAULT NULL COMMENT '요일',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_Store_TO_OrderRsv` (`storeSeq`),
  CONSTRAINT `FK_Store_TO_OrderRsv` FOREIGN KEY (`storeSeq`) REFERENCES `Store` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 예약';


-- cheonil.Payment definition

CREATE TABLE `Payment` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '결재 Seq',
  `orderSeq` bigint(20) unsigned NOT NULL COMMENT '주문 Seq',
  `amount` int(10) unsigned NOT NULL COMMENT '결재 금액',
  `payType` enum('CASH','CARD') NOT NULL DEFAULT 'CASH' COMMENT 'CASH: 현금, CARD: 카드',
  `payAt` timestamp NOT NULL COMMENT '지급날짜',
  PRIMARY KEY (`seq`),
  KEY `FK_MyOrder_TO_Payment` (`orderSeq`),
  CONSTRAINT `FK_MyOrder_TO_Payment` FOREIGN KEY (`orderSeq`) REFERENCES `MyOrder` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='결재';


-- cheonil.OrderMenuRsv definition

CREATE TABLE `OrderMenuRsv` (
  `menuSeq` smallint(5) unsigned NOT NULL COMMENT '메뉴 Seq',
  `orderRsvSeq` bigint(20) unsigned NOT NULL COMMENT '주문예약 Seq',
  `price` int(10) unsigned NOT NULL COMMENT '가격 menu는 가격이 바뀔수가 있음',
  `cnt` tinyint(3) unsigned NOT NULL COMMENT '수량',
  PRIMARY KEY (`menuSeq`,`orderRsvSeq`),
  KEY `FK_OrderRsv_TO_OrderMenuRsv` (`orderRsvSeq`),
  CONSTRAINT `FK_Menu_TO_OrderMenuRsv` FOREIGN KEY (`menuSeq`) REFERENCES `Menu` (`seq`),
  CONSTRAINT `FK_OrderRsv_TO_OrderMenuRsv` FOREIGN KEY (`orderRsvSeq`) REFERENCES `OrderRsv` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 메뉴 예약';
