INSERT INTO category VALUES (NULL, 0, NULL, '디지털', 0, '2022-06-05 12:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, 'iPhone', 1, '2022-06-05 15:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, 'GALAY폰', 1, '2022-06-05 18:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '기타 모바일', 1, '2022-06-05 21:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '스마트워치', 1, '2022-06-06 02:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '노트북', 1, '2022-06-06 06:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '테블릿', 1, '2022-06-06 11:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, 'TV/모니터', 1, '2022-06-07 07:00:00'), now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '게임', 1, '2022-06-07 18:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '음향기기', 1, '2022-06-08 11:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '카메라', 1, '2022-06-08 21:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '드론', 1, '2022-06-09 22:00:00'), now(), NULL);
INSERT INTO category VALUES (NULL, 0, 3, '기타', 1, '2022-06-10 19:00:00', now(), NULL);


INSERT INTO user VALUES(NULL, 0, "test1", "testpassword", 0, 0, "2022-05-26", "test1@email.com", "01012345678", '2022-06-05 12:00:00', now(),null, "testAccount");
INSERT INTO user VALUES(NULL, 0, "test2", "test2pwd", 0, 0, "2022-06-26", "test2@email.com", "01098765432", '2022-06-07 13:00:00', now(),null, "testAccount2");


INSERT INTO item VALUES(NULL, 0, 1, 4, 1000, 1000, 500000, "iPhone13S PlusMax", "iPhone13S Plus Max 거의 신품", "2022-06-30 00:00:00", 0, 5, 5, now(), now(), null);
INSERT INTO item VALUES(NULL, 0, 1, 4, 2000, 2000, 600000, "iPhone13", "iPhone13 사용감 없음", "2022-07-30 00:00:00", 0, 5, 5, now(), now(), null);
INSERT INTO item VALUES(NULL, 0, 1, 5, 3000, 3000, 100000, "갤럭시22S", "갤럭시22S 급처", "2022-06-10 00:00:00", 0, 4, 2, now(), now(), null);
INSERT INTO item VALUES(NULL, 0, 1, 11, 4000, 4000, 700000, "PS5", "PS5 사용감 있음. 직거래", "2022-06-15 00:00:00", 0, 4, 3, now(), now(), null);


INSERT INTO item VALUES(NULL, 0, 2, 4, 100000, 100000, 1550000, "iPhone13S PlusMax", "iPhone13S Plus Max신품", "2022-07-30 00:00:00", 0, 5, 5, now(), now(), null);
INSERT INTO item VALUES(NULL, 0, 2, 4, 2000, 2000, 400000, "iPhone12", "iPhone14 급처", "2022-07-30 00:00:00", 0, 5, 4, now(), now(), null);
INSERT INTO item VALUES(NULL, 0, 2, 7, 10000, 10000, 150000, "애플워치5세대", "애플워치5세대", "2022-06-20 00:00:00", 0, 4, 4, now(), now(), null);
INSERT INTO item VALUES(NULL, 0, 2, 11, 400000, 400000, 650000, "PS5", "PS5 직거래", "2022-06-25 00:00:00", 0, 5, 4, now(), now(), null);