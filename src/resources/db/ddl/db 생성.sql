-- cheonil.Expense definition

CREATE TABLE `Expense` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '지출 SEQ',
  `ctgSeq` int(10) unsigned NOT NULL COMMENT '카테고리 SEQ',
  `storeSeq` smallint(5) unsigned DEFAULT NULL COMMENT '매장 SEQ',
  `name` varchar(50) NOT NULL COMMENT '지출명',
  `amount` int(10) unsigned NOT NULL COMMENT '금액',
  `expenseAt` datetime NOT NULL COMMENT '지출일',
  `cmt` varchar(400) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_Expense_TO_ExpenseCategory` (`ctgSeq`),
  KEY `FK_Expense_TO_Store` (`storeSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='지출';


-- cheonil.ExpenseCategory definition

CREATE TABLE `ExpenseCategory` (
  `seq` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '지출 카테고리 SEQ',
  `path` varchar(50) NOT NULL COMMENT '카테고리명',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='지출 카네고리';


-- cheonil.ExpenseProduct definition

CREATE TABLE `ExpenseProduct` (
  `expsSeq` bigint(20) unsigned NOT NULL COMMENT '지출 Seq',
  `prdSeq` int(10) unsigned NOT NULL COMMENT '제품 SEQ',
  `cnt` smallint(5) unsigned NOT NULL COMMENT '수량',
  `price` bigint(20) unsigned NOT NULL COMMENT '가격',
  `unitCnt` smallint(5) unsigned DEFAULT NULL COMMENT '단위수량',
  `cmt` varchar(400) DEFAULT NULL COMMENT '비고',
  PRIMARY KEY (`expsSeq`,`prdSeq`),
  KEY `FK_ExpenseProduct_TO_Expense` (`expsSeq`),
  KEY `FK_ExpenseProduct_TO_Product` (`prdSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='지출 제퓸';


-- cheonil.Menu definition

CREATE TABLE `Menu` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '메뉴 Seq',
  `ctgSeq` smallint(5) unsigned NOT NULL COMMENT '메뉴 카테고리 Seq',
  `name` varchar(45) NOT NULL COMMENT '메뉴 명',
  `abv` varchar(10) DEFAULT NULL COMMENT '이름 약어',
  `price` int(10) unsigned NOT NULL COMMENT '가격',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`),
  KEY `FK_MenuCategory_TO_Menu` (`ctgSeq`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='메뉴';


-- cheonil.MenuCategory definition

CREATE TABLE `MenuCategory` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '메뉴 카테고리 Seq',
  `name` varchar(20) NOT NULL COMMENT '메뉴 카테고리 명',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='메뉴 카테고리';


-- cheonil.MyOrder definition

CREATE TABLE `MyOrder` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '주문 Seq',
  `storeSeq` smallint(5) unsigned NOT NULL COMMENT '매장 Seq',
  `amount` int(10) unsigned NOT NULL COMMENT '총 금액',
  `status` enum('READY','COOKED','PAID') NOT NULL DEFAULT 'READY' COMMENT 'READY: 준비, COOKED: 조리 완료, PAID: 결제 완료',
  `orderAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '주문 시간',
  `cookedAt` datetime DEFAULT NULL COMMENT '조리완료 시간',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '비고',
  `updatedAt` datetime NOT NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_Store_TO_MyOrder` (`storeSeq`)
) ENGINE=InnoDB AUTO_INCREMENT=2597 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문';


-- cheonil.OrderMenu definition

CREATE TABLE `OrderMenu` (
  `menuSeq` smallint(5) unsigned NOT NULL COMMENT '메뉴 Seq',
  `orderSeq` bigint(20) unsigned NOT NULL COMMENT '주문 Seq',
  `price` int(10) unsigned NOT NULL COMMENT '가격 menu는 가격이 바뀔수가 있음',
  `cnt` tinyint(3) unsigned NOT NULL COMMENT '수량',
  PRIMARY KEY (`menuSeq`,`orderSeq`),
  KEY `FK_MyOrder_TO_OrderMenu` (`orderSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 메뉴';


-- cheonil.OrderMenuRsv definition

CREATE TABLE `OrderMenuRsv` (
  `menuSeq` smallint(5) unsigned NOT NULL COMMENT '메뉴 Seq',
  `orderRsvSeq` bigint(20) unsigned NOT NULL COMMENT '주문예약 Seq',
  `price` int(10) unsigned NOT NULL COMMENT '가격 menu는 가격이 바뀔수가 있음',
  `cnt` tinyint(3) unsigned NOT NULL COMMENT '수량',
  PRIMARY KEY (`menuSeq`,`orderRsvSeq`),
  KEY `FK_OrderRsv_TO_OrderMenuRsv` (`orderRsvSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 메뉴 예약';


-- cheonil.OrderRsv definition

CREATE TABLE `OrderRsv` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '주문예약 Seq',
  `storeSeq` smallint(5) unsigned NOT NULL COMMENT '매장 Seq',
  `amount` int(10) unsigned NOT NULL COMMENT '총 금액',
  `rsvTime` char(5) NOT NULL COMMENT 'HH:MM',
  `dayType` enum('MON','TUE','WED','THU','FRI','SAT','SUN') DEFAULT NULL COMMENT '요일',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_Store_TO_OrderRsv` (`storeSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='주문 예약';


-- cheonil.Payment definition

CREATE TABLE `Payment` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '결재 Seq',
  `orderSeq` bigint(20) unsigned NOT NULL COMMENT '주문 Seq',
  `amount` int(10) unsigned NOT NULL COMMENT '결재 금액',
  `payType` enum('CASH','CARD') NOT NULL DEFAULT 'CASH' COMMENT 'CASH: 현금, CARD: 카드',
  `payAt` datetime NOT NULL COMMENT '지급날짜',
  PRIMARY KEY (`seq`),
  KEY `FK_MyOrder_TO_Payment` (`orderSeq`)
) ENGINE=InnoDB AUTO_INCREMENT=2363 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='결재';


-- cheonil.PlaceCategory definition

CREATE TABLE `PlaceCategory` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '장소 카테고리 Seq',
  `name` varchar(100) NOT NULL COMMENT '장소 카테고리 명',
  `cmt` varchar(1000) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='장소 카테고리';


-- cheonil.Product definition

CREATE TABLE `Product` (
  `seq` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT 'SEQ',
  `prdInfoSeq` smallint(5) unsigned NOT NULL COMMENT '제품 SEQ',
  `unitSeq` smallint(5) unsigned NOT NULL COMMENT '단위 SEQ',
  `unitCntList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '단위수량 목록' CHECK (json_valid(`unitCntList`)),
  PRIMARY KEY (`seq`),
  KEY `FK_Product_TO_ProductInfo` (`prdInfoSeq`),
  KEY `FK_Product_TO_Unit` (`unitSeq`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='제품';


-- cheonil.ProductInfo definition

CREATE TABLE `ProductInfo` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '제품 Seq',
  `suplSeq` smallint(5) unsigned NOT NULL COMMENT '식자재 Seq',
  `name` varchar(100) NOT NULL COMMENT '식자재 명',
  `cmt` varchar(200) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_ProductInfo_TO_Supply` (`suplSeq`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='제품 정보';


-- cheonil.Setting definition

CREATE TABLE `Setting` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '설정 Seq',
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '설정 정보' CHECK (json_valid(`config`)),
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='설정';


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
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`),
  KEY `FK_PlaceCategory_TO_Store` (`placeCtgSeq`),
  KEY `FK_StoreCategory_TO_Store` (`ctgSeq`)
) ENGINE=InnoDB AUTO_INCREMENT=146 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='매장';


-- cheonil.StoreCategory definition

CREATE TABLE `StoreCategory` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '매장 카테고리 Seq',
  `placeCtgSeq` smallint(5) unsigned DEFAULT NULL COMMENT '장소 카테고리 Seq',
  `name` varchar(45) NOT NULL COMMENT '매장 카테고리 명',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가정보' CHECK (json_valid(`options`)),
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  UNIQUE KEY `name` (`name`),
  KEY `FK_PlaceCategory_TO_StoreCategory` (`placeCtgSeq`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='매장 카테고리';


-- cheonil.Supply definition

CREATE TABLE `Supply` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '식자재 Seq',
  `name` varchar(100) NOT NULL COMMENT '식자재 명',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='식자재';


-- cheonil.Unit definition

CREATE TABLE `Unit` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '단위 SEQ',
  `name` varchar(40) NOT NULL COMMENT '단위',
  `isUnitCnt` tinyint(1) NOT NULL DEFAULT 0 COMMENT '단위수량 여부',
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='단위';
