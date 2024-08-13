INSERT INTO
  `Menu` (
    `seq`,
    `ctgSeq`,
    `name`,
    `abv`,
    `price`,
    `cmt`,
    `options`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    4,
    2,
    '정식',
    '정식',
    8000,
    '1',
    NULL,
    '2024-08-11 07:36:44',
    '2024-08-11 07:36:44'
  );
INSERT INTO
  `Menu` (
    `seq`,
    `ctgSeq`,
    `name`,
    `abv`,
    `price`,
    `cmt`,
    `options`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    5,
    2,
    '김치찌개',
    '김치',
    8000,
    NULL,
    NULL,
    '2024-08-11 07:46:40',
    '2024-08-11 07:46:40'
  );

INSERT INTO
  `MenuCategory` (`seq`, `name`, `options`, `createdAt`, `updatedAt`)
VALUES
  (
    2,
    '기본',
    NULL,
    '2024-08-11 07:08:39',
    '2024-08-11 07:08:39'
  );

INSERT INTO
  `MyOrder` (
    `seq`,
    `storeSeq`,
    `amount`,
    `status`,
    `orderAt`,
    `completeAt`,
    `cmt`,
    `updatedAt`
  )
VALUES
  (
    3,
    2,
    8000,
    'COOKED',
    '2024-08-11 05:32:14',
    '2024-08-12 05:32:34',
    NULL,
    '2024-08-12 05:32:14'
  );
INSERT INTO
  `MyOrder` (
    `seq`,
    `storeSeq`,
    `amount`,
    `status`,
    `orderAt`,
    `completeAt`,
    `cmt`,
    `updatedAt`
  )
VALUES
  (
    4,
    2,
    8000,
    'COOKED',
    '2024-08-12 05:32:16',
    '2024-08-12 05:32:36',
    NULL,
    '2024-08-12 05:32:16'
  );
INSERT INTO
  `MyOrder` (
    `seq`,
    `storeSeq`,
    `amount`,
    `status`,
    `orderAt`,
    `completeAt`,
    `cmt`,
    `updatedAt`
  )
VALUES
  (
    5,
    2,
    24000,
    'COOKED',
    '2024-08-12 05:32:20',
    '2024-08-12 05:32:37',
    NULL,
    '2024-08-12 05:32:20'
  );
INSERT INTO
  `MyOrder` (
    `seq`,
    `storeSeq`,
    `amount`,
    `status`,
    `orderAt`,
    `completeAt`,
    `cmt`,
    `updatedAt`
  )
VALUES
  (
    6,
    2,
    8000,
    'READY',
    '2024-08-12 23:45:50',
    NULL,
    NULL,
    '2024-08-12 23:45:50'
  );

INSERT INTO
  `OrderMenu` (`menuSeq`, `orderSeq`, `price`, `cnt`)
VALUES
  (4, 3, 8000, 1);
INSERT INTO
  `OrderMenu` (`menuSeq`, `orderSeq`, `price`, `cnt`)
VALUES
  (4, 4, 8000, 1);
INSERT INTO
  `OrderMenu` (`menuSeq`, `orderSeq`, `price`, `cnt`)
VALUES
  (4, 5, 8000, 1);
INSERT INTO
  `OrderMenu` (`menuSeq`, `orderSeq`, `price`, `cnt`)
VALUES
  (4, 6, 8000, 1);
INSERT INTO
  `OrderMenu` (`menuSeq`, `orderSeq`, `price`, `cnt`)
VALUES
  (5, 3, 8000, 1);
INSERT INTO
  `OrderMenu` (`menuSeq`, `orderSeq`, `price`, `cnt`)
VALUES
  (5, 4, 8000, 1);
INSERT INTO
  `OrderMenu` (`menuSeq`, `orderSeq`, `price`, `cnt`)
VALUES
  (5, 6, 8000, 1);
INSERT INTO
  `OrderMenu` (`menuSeq`, `orderSeq`, `price`, `cnt`)
VALUES
  (5, 7, 8000, 3);

INSERT INTO
  `PlaceCategory` (`seq`, `name`, `cmt`, `options`)
VALUES
  (5, '구역1', '11', NULL);
INSERT INTO
  `PlaceCategory` (`seq`, `name`, `cmt`, `options`)
VALUES
  (6, '구역2', NULL, NULL);

INSERT INTO
  `Store` (
    `seq`,
    `ctgSeq`,
    `placeCtgSeq`,
    `name`,
    `cmt`,
    `latitude`,
    `longitude`,
    `options`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    2,
    3,
    6,
    '농협1',
    NULL,
    NULL,
    NULL,
    NULL,
    '2024-08-11 06:56:18',
    '2024-08-11 06:56:18'
  );

INSERT INTO
  `StoreCategory` (
    `seq`,
    `placeCtgSeq`,
    `name`,
    `options`,
    `createdAt`,
    `updatedAt`
  )
VALUES
  (
    3,
    5,
    '농협',
    NULL,
    '2024-08-11 06:49:31',
    '2024-08-11 06:49:31'
  );