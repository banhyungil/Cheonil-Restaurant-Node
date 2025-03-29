DROP TABLE `Unit`;

-- cheonil.Unit definition

CREATE TABLE `Unit` (
  `seq` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '단위 SEQ',
  `name` varchar(40) NOT NULL COMMENT '단위',
  `isUnitCnt` tinyint(1) NOT NULL DEFAULT 0 COMMENT '단위수량 여부',
  PRIMARY KEY (`seq`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='단위';
