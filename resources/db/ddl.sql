-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema cheonildb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cheonildb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cheonildb` DEFAULT CHARACTER SET utf8mb4 ;
USE `cheonildb` ;

-- -----------------------------------------------------
-- Table `cheonildb`.`menu_category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`menu_category` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`menu_category` (
  `name` VARCHAR(45) NOT NULL COMMENT '카테고리명',
  `order` TINYINT(3) UNSIGNED NOT NULL DEFAULT 1 COMMENT '표시순서',
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = '메뉴 카테고리';


-- -----------------------------------------------------
-- Table `cheonildb`.`menu`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`menu` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`menu` (
  `name` VARCHAR(45) NOT NULL COMMENT '메뉴명',
  `categoryName` VARCHAR(45) NOT NULL COMMENT '카테고리명',
  `nameAbv` VARCHAR(45) NULL COMMENT '이름 약어',
  `price` BIGINT(20) UNSIGNED NOT NULL,
  `cmt` VARCHAR(1000) NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`),
  INDEX `fk_menu_menu_category1_idx` (`categoryName` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = '메뉴';


-- -----------------------------------------------------
-- Table `cheonildb`.`placeCategory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`placeCategory` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`placeCategory` (
  `name` VARCHAR(45) NOT NULL,
  `cmt` VARCHAR(45) NULL,
  PRIMARY KEY (`name`))
ENGINE = InnoDB
COMMENT = '장소 카테고리';


-- -----------------------------------------------------
-- Table `cheonildb`.`store_category`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`store_category` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`store_category` (
  `name` VARCHAR(45) NOT NULL,
  `placeCtgName` VARCHAR(45) NOT NULL,
  `order` TINYINT(3) UNSIGNED NULL,
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`),
  INDEX `fk_store_category_placeCategory1_idx` (`placeCtgName` ASC) VISIBLE)
ENGINE = InnoDB
COMMENT = '매장 카테고리';


-- -----------------------------------------------------
-- Table `cheonildb`.`store`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`store` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`store` (
  `name` VARCHAR(45) NOT NULL,
  `categoryName` VARCHAR(45) NOT NULL,
  `placeCtgName` VARCHAR(45) NOT NULL COMMENT '기본적으로 매장 카테고리에 등록된 값과 일치',
  `cmt` VARCHAR(1000) NULL COMMENT '기타 정보',
  `latitude` VARCHAR(20) NULL COMMENT '위도',
  `longitude` VARCHAR(20) NULL COMMENT '경도',
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`name`),
  INDEX `fk_store_store_category1_idx` (`categoryName` ASC) VISIBLE,
  INDEX `fk_store_placeCategory1_idx` (`placeCtgName` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = '매장';


-- -----------------------------------------------------
-- Table `cheonildb`.`t_order`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`t_order` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`t_order` (
  `seq` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '주문 시퀀스',
  `storeName` VARCHAR(45) NOT NULL COMMENT '매장명',
  `amount` BIGINT(20) UNSIGNED NOT NULL COMMENT '총 금액\n외상인 경우는 어떻게 처리하지?...',
  `status` ENUM('READY', 'COMPLETE') NOT NULL DEFAULT 'READY' COMMENT 'ready: 준비, complete: 완료',
  `orderTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '주문 시간',
  `completeTime` DATETIME NULL COMMENT '조리완료 시간',
  `reqCmt` VARCHAR(100) NULL COMMENT '요청 사항',
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`seq`, `storeName`),
  INDEX `fk_t_order_store1_idx` (`storeName` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = '주문';


-- -----------------------------------------------------
-- Table `cheonildb`.`t_order_menu`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`t_order_menu` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`t_order_menu` (
  `name` VARCHAR(45) NOT NULL COMMENT '메뉴명',
  `orderSeq` BIGINT(20) UNSIGNED NOT NULL COMMENT '주문 시퀀스',
  `storeName` VARCHAR(45) NOT NULL COMMENT '매장명',
  `price` BIGINT(20) UNSIGNED NOT NULL COMMENT '가격\nmenu는 가격이 바뀔수가 있음',
  `cnt` BIGINT(20) UNSIGNED NOT NULL COMMENT '수량',
  INDEX `fk_t_order_menu_menu1_idx` (`name` ASC) VISIBLE,
  INDEX `fk_t_order_menu_t_order1_idx` (`orderSeq` ASC, `storeName` ASC) VISIBLE,
  PRIMARY KEY (`name`, `orderSeq`, `storeName`))
ENGINE = InnoDB
COMMENT = '주문 메뉴';


-- -----------------------------------------------------
-- Table `cheonildb`.`config`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`config` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`config` (
  `key` VARCHAR(20) NOT NULL,
  `config` JSON NOT NULL,
  PRIMARY KEY (`key`))
ENGINE = InnoDB
COMMENT = '설정\n각종 설정을 json 타입으로 저장한다.';


-- -----------------------------------------------------
-- Table `cheonildb`.`order_rsv`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`order_rsv` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`order_rsv` (
  `seq` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '주문예약 시퀀스',
  `storeName` VARCHAR(45) NOT NULL COMMENT '매장명',
  `amount` BIGINT(20) UNSIGNED NOT NULL COMMENT '총 금액',
  `rsvTime` VARCHAR(5) NOT NULL COMMENT 'HH:MM',
  `weekDay` JSON NOT NULL COMMENT '요일 배열\nex) \n월요일: [1]\n월, 수: [1,3]',
  `reqCmt` VARCHAR(1000) NULL COMMENT '기타 정보',
  `createdAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`seq`, `storeName`),
  INDEX `fk_t_order_rsv_store1_idx` (`storeName` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COMMENT = '주문 예약\n예약 정보에 따라 t_order를 생성한다';


-- -----------------------------------------------------
-- Table `cheonildb`.`order_menu_rsv`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`order_menu_rsv` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`order_menu_rsv` (
  `orderRsvId` BIGINT(20) UNSIGNED NOT NULL COMMENT '주문예약ID',
  `name` VARCHAR(45) NOT NULL COMMENT '메뉴명',
  `storeName` VARCHAR(45) NOT NULL COMMENT '매장명',
  `price` BIGINT(20) UNSIGNED NOT NULL COMMENT '가격\nmenu는 가격이 바뀔수가 있음',
  `cnt` BIGINT(20) UNSIGNED NOT NULL COMMENT '수량',
  INDEX `fk_order_menu_rsv_menu1_idx` (`name` ASC) VISIBLE,
  INDEX `fk_order_menu_rsv_order_rsv1_idx` (`orderRsvId` ASC, `storeName` ASC) VISIBLE,
  PRIMARY KEY (`orderRsvId`, `name`, `storeName`))
ENGINE = InnoDB
COMMENT = '주문 메뉴';


-- -----------------------------------------------------
-- Table `cheonildb`.`payment`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cheonildb`.`payment` ;

CREATE TABLE IF NOT EXISTS `cheonildb`.`payment` (
  `seq` BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '결재ID',
  `orderSeq` BIGINT(20) UNSIGNED NOT NULL COMMENT '주문ID',
  `storeName` VARCHAR(45) NOT NULL COMMENT '매장명',
  `amount` INT(20) UNSIGNED NOT NULL COMMENT '결재금액',
  `payType` ENUM('CASH', 'CARD') NOT NULL COMMENT '결재방식',
  `payDate` DATETIME NOT NULL COMMENT '결재일',
  PRIMARY KEY (`seq`, `orderSeq`, `storeName`),
  INDEX `fk_payment_t_order1_idx` (`orderSeq` ASC, `storeName` ASC) VISIBLE)
ENGINE = InnoDB
COMMENT = '결재';


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
