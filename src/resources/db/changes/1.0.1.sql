-- cheonil.Supply definition

CREATE TABLE `Supply` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '식자재 Seq',
  `storeSeq` smallint(5) unsigned NOT NULL COMMENT '매장 Seq',
  `name` varchar(100) NOT NULL COMMENT '식자재 명',
  `unit` varchar(40) NOT NULL COMMENT '단위',
  `cnt` smallint(5) unsigned NOT NULL COMMENT '수량',
  `unitCntOptions` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '단위수량 목록' CHECK (json_valid(`unitCntOptions`)),
  `cmt` varchar(200) DEFAULT NULL COMMENT '비고',
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT '추가 정보' CHECK (json_valid(`options`)),
  `createdAt` timestamp NULL DEFAULT current_timestamp() COMMENT '생성시간',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_Store_TO_Supply` (`storeSeq`),
  CONSTRAINT `FK_Store_TO_Supply` FOREIGN KEY (`storeSeq`) REFERENCES `Store` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='식자재';


-- cheonil.Expense definition

CREATE TABLE `Expense` (
  `seq` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '지출 Seq',
  `supplySeq` smallint(5) unsigned NOT NULL COMMENT '식자재 Seq',
  `amount` int(10) unsigned NOT NULL COMMENT '금액',
  `cnt` smallint(5) unsigned NOT NULL COMMENT '수량',
  `expenseAt` timestamp NOT NULL COMMENT '지출 날짜',
  `cmt` varchar(100) DEFAULT NULL COMMENT '비고',
  `updatedAt` timestamp NULL DEFAULT current_timestamp() COMMENT '수정시간',
  PRIMARY KEY (`seq`),
  KEY `FK_Supply_TO_Expense` (`supplySeq`),
  CONSTRAINT `FK_Supply_TO_Expense` FOREIGN KEY (`supplySeq`) REFERENCES `Supply` (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='지출';

ALTER TABLE Expense DROP FOREIGN KEY FK_Supply_TO_Expense;
ALTER TABLE Supply DROP FOREIGN KEY FK_Store_TO_Supply;

DROP TABLE `Setting`;

CREATE TABLE `Setting` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '설정 Seq',
  `config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL COMMENT '설정 정보' CHECK (json_valid(`config`)),
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='설정';

INSERT INTO Setting(config) values ({dbVersion: '1.0.0'})
