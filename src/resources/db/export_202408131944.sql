INSERT INTO cheonil.Menu (ctgSeq,name,abv,price,cmt,`options`,createdAt,updatedAt) VALUES
	 (2,'김치찌개','김치',7000,NULL,NULL,'2024-08-12 12:27:09','2024-08-12 12:27:09'),
	 (3,'제육','제육',8000,NULL,NULL,'2024-08-12 12:27:19','2024-08-12 12:27:19'),
	 (4,'정식','정식',6500,NULL,NULL,'2024-08-12 12:27:29','2024-08-12 12:27:29'),
	 (6,'갈비탕','갈비',8000,NULL,NULL,'2024-08-12 12:27:40','2024-08-12 12:27:40'),
	 (5,'돈까스','돈까',8000,NULL,NULL,'2024-08-12 12:27:52','2024-08-12 12:27:52'),
	 (7,'잔치국수','잔치',6000,NULL,NULL,'2024-08-12 12:28:06','2024-08-12 12:28:06');
INSERT INTO cheonil.MenuCategory (name,`options`,createdAt,updatedAt) VALUES
	 ('찌개류',NULL,'2024-08-12 12:25:49','2024-08-12 12:25:49'),
	 ('고기류',NULL,'2024-08-12 12:25:54','2024-08-12 12:25:54'),
	 ('정식',NULL,'2024-08-12 12:25:58','2024-08-12 12:25:58'),
	 ('분식',NULL,'2024-08-12 12:26:02','2024-08-12 12:26:02'),
	 ('복만네',NULL,'2024-08-12 12:26:25','2024-08-12 12:26:25'),
	 ('면',NULL,'2024-08-12 12:26:40','2024-08-12 12:26:40');
INSERT INTO cheonil.PlaceCategory (name,cmt,`options`) VALUES
	 ('구역1',NULL,NULL);
INSERT INTO cheonil.Store (ctgSeq,placeCtgSeq,name,cmt,latitude,longitude,`options`,createdAt,updatedAt) VALUES
	 (3,NULL,'농협 109',NULL,NULL,NULL,NULL,'2024-08-12 13:38:35','2024-08-12 13:38:35');
INSERT INTO cheonil.StoreCategory (placeCtgSeq,name,`options`,createdAt,updatedAt) VALUES
	 (NULL,'중앙',NULL,'2024-08-12 12:23:54','2024-08-12 12:23:54'),
	 (NULL,'농협',NULL,'2024-08-12 12:23:59','2024-08-12 12:23:59'),
	 (NULL,'대양',NULL,'2024-08-12 12:24:04','2024-08-12 12:24:04'),
	 (NULL,'원예',NULL,'2024-08-12 12:24:11','2024-08-12 12:24:11'),
	 (NULL,'외부',NULL,'2024-08-12 12:24:22','2024-08-12 12:24:22');
