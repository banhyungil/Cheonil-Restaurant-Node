
DROP TABLE Supply;
DROP TABLE Expense;

CREATE TABLE Supply
(
  seq            SMALLINT UNSIGNED AUTO_INCREMENT NOT NULL COMMENT '식자재 Seq',
  name           VARCHAR(100)                     NOT NULL COMMENT '식자재 명',
  unit           VARCHAR(40)                      NOT NULL COMMENT '단위',
  unitCntOptions JSON                             NULL     COMMENT '단위수량 목록',
  cmt            varchar(200)                     NULL     COMMENT '비고',
  options        JSON                             NULL     COMMENT '추가 정보',
  createdAt      DATETIME                         NULL     DEFAULT current_timestamp COMMENT '생성시간',
  updatedAt      DATETIME                         NULL     DEFAULT current_timestamp COMMENT '수정시간',
  PRIMARY KEY (seq)
) COMMENT '식자재';

CREATE TABLE MapStoreSupply
(
  seq       BIGINT UNSIGNED AUTO_INCREMENT NOT NULL COMMENT '맵핑 Seq',
  storeSeq  SMALLINT UNSIGNED              NOT NULL COMMENT '매장 Seq',
  supplySeq SMALLINT UNSIGNED              NOT NULL COMMENT '식자재 Seq',
  price     INT UNSIGNED                   NOT NULL COMMENT '가격',
  unitCnt   SMALLINT UNSIGNED              NULL     COMMENT '단위수량',
  options   JSON                           NULL     COMMENT '추가 정보',
  PRIMARY KEY (seq)
) COMMENT '매장 식자재 맵핑';

CREATE TABLE Expense
(
  seq        BIGINT UNSIGNED AUTO_INCREMENT NOT NULL COMMENT '지출 Seq',
  mapStSpSeq BIGINT UNSIGNED NOT NULL COMMENT '매장 식자재 맵핑 Seq',
  amount     INT UNSIGNED                   NOT NULL COMMENT '금액',
  cnt        SMALLINT UNSIGNED              NOT NULL COMMENT '수량',
  expenseAt  DATETIME                       NOT NULL COMMENT '지출일',
  cmt        varchar(100)                   NULL     COMMENT '비고',
  options    JSON                           NULL     COMMENT '추가 정보',
  updatedAt  DATETIME                       NULL     DEFAULT current_timestamp COMMENT '수정시간',
  PRIMARY KEY (seq)
) COMMENT '지출';


CREATE TABLE StoreExpenseLog
(
  seq       BIGINT UNSIGNED AUTO_INCREMENT NOT NULL COMMENT '매장 지출 로그 Seq',
  storeSeq  SMALLINT UNSIGNED              NOT NULL COMMENT '매장 Seq',
  expenseAt DATETIME                       NOT NULL COMMENT '지출일',
  cmt       varchar(200)                   NOT NULL COMMENT '비고',
  PRIMARY KEY (seq)
) COMMENT '매장 지출 로그';


CREATE INDEX FK_Store_TO_MapStoreSupply ON MapStoreSupply (storeSeq);
CREATE INDEX FK_Supply_TO_MapStoreSupply ON MapStoreSupply (supplySeq);
CREATE INDEX FK_MapStoreSupply_TO_Expense ON Expense (mapStSpSeq);
CREATE INDEX FK_Store_TO_StoreExpenseLog ON StoreExpenseLog (storeSeq);
