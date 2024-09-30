DROP TABLE Supply;
DROP TABLE MapStoreSupply;
DROP TABLE Expense;

-- cheonil.Supply definition

CREATE TABLE `Supply` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '식자재 Seq',
  `name` varchar(100) NOT NULL COMMENT '식자재 명',
  `unitList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '단위 목록' CHECK (json_valid(`unitList`)),
  `unitCntList` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '단위수량 목록' CHECK (json_valid(`unitCntList`)),
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='식자재';

-- cheonil.Product definition

CREATE TABLE `Product` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '제품 Seq',
  `splSeq` smallint(5) unsigned NOT NULL COMMENT '식자재 Seq',
  `name` varchar(100) NOT NULL COMMENT '식자재 명',
  `unit` varchar(40) DEFAULT NULL COMMENT '단위',
  `unitCnt` smallint(5) unsigned DEFAULT NULL COMMENT '단위수량',
  `cmt` varchar(200) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  `createdAt` datetime DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_Supply_TO_Product` (`splSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='제품';

-- cheonil.MapStoreProduct definition

CREATE TABLE `MapStoreProduct` (
  `storeSeq` smallint(5) unsigned NOT NULL COMMENT '매장 Seq',
  `prdSeq` smallint(5) unsigned NOT NULL COMMENT '제품 Seq',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  PRIMARY KEY (`storeSeq`,`prdSeq`),
  KEY `FK_Product_TO_MapStoreProduct` (`prdSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='매장/제품 맵핑';

-- cheonil.Expense definition

CREATE TABLE `Expense` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '지출 Seq',
  `storeSeq` smallint(5) unsigned NOT NULL COMMENT '매장 Seq',
  `prdSeq` smallint(5) unsigned NOT NULL COMMENT '제품 Seq',
  `price` int(10) unsigned NOT NULL COMMENT '가격',
  `amount` int(10) unsigned NOT NULL COMMENT '금액',
  `cnt` smallint(5) unsigned NOT NULL COMMENT '수량',
  `expenseAt` datetime NOT NULL COMMENT '지출일',
  `cmt` varchar(100) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  `updatedAt` datetime DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_MapStoreProduct_TO_Expense` (`storeSeq`,`prdSeq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='지출';
