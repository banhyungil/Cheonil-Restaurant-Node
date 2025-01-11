-- 제품, 식자재, 식자재 단위 생성해야함
ALTER TABLE cheonil.Unit MODIFY COLUMN isUnitCnt BOOL DEFAULT 0 NOT NULL COMMENT '단위수량 여부';
ALTER TABLE cheonil.Unit CHANGE name id varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '단위';
