SHOW STATUS LIKE 'Threads_connected';
show tables;
select * from user;
select * from userAlarm;
select * from kakaoAccount;
delete from user where id=9;
delete from kakaoAccount where id=2233153000;
update kakaoAccount set id=2233153001 where id=2233153000;

insert into penalty values(null, 0, 30, 'BIDDING', '2022-07-31 00:00:00', 'test test', now(), now(), null);
select * from successfulBid;
select * from bidding;
select * from bidding where itemId=5 order by price DESC limit 5;


insert into alarm values(NULL, 0, "MASTER", NULL, NULL, now(), now(), NULL);
insert into userAlarm values(null, 0, 1,1, now(), now(), null);

select * from (select * from bidding where itemId=5 order by price) as t group by t.userId limit 5;
(SELECT max(price) FROM bidding WHERE itemId=5 AND createdAt <= "2022-07-28T23:58:00.000Z" group by userId);
SELECT * FROM bidding as t1, (SELECT max(price) as price FROM bidding WHERE itemId=5 AND createdAt <= "2022-07-28T23:58:00.000Z" group by userId) as t2 WHERE itemId=5 AND createdAt <= "2022-07-01T01:58:00.000Z" and t1.price=t2.price LIMIT 5;
SELECT * FROM bidding as t1 INNER JOIN user ON t1.userId = user.id INNER JOIN pushToken ON t1.userId = pushToken.userId , (SELECT max(price) as price FROM bidding WHERE status=0 AND itemId=5 AND createdAt <= "2022-07-26T23:58:00.000Z" GROUP BY userId) as t2 
WHERE t1.status=0 AND t1.itemId=5 AND t1.createdAt <= "2022-07-26T23:58:00.000Z" AND t1.price=t2.price ORDER BY t1.price DESC LIMIT 5;
select * from item;
update item set status = 1, dueDate = "2022-07-26 23:58:00" where id=5;
select * from itemDescription;
select * from category;
delete from category where id=3;
select * from pushToken;
update pushToken set token="dsj2fOOJS7KeRYBMxEjHtL:APA91bF-ZK_bjl1gEpoVaILBgxNzLKIegHiWvUf8qGR2qeez_80fAyIL_cMEh2QxDbyb2cdNxMooFLR6w7KMT_zkFNcz8FSkiqhnnAlvbQgTAQjUdaqCCEmpxLdJ2Ri-R3vUh_iS0sJ2" where id=4;
insert into pushToken values(null, 0, 33, "dsj2fOOJS7KeRYBMxEjHtL:APA91bF-ZK_bjl1gEpoVaILBgxNzLKIegHiWvUf8qGR2qeez_80fAyIL_cMEh2QxDbyb2cdNxMooFLR6w7KMT_zkFNcz8FSkiqhnnAlvbQgTAQjUdaqCCEmpxLdJ2Ri-R3vUh_iS0sJ2", now(), now(), null);
select * from penalty;

show tables;
select * from bidding;
INSERT INTO category VALUES (NULL, 0, NULL, '디지털', 0, '2022-06-05 12:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, 'iPhone', 1, '2022-06-05 15:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, 'GALAY폰', 1, '2022-06-05 18:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '기타 모바일', 1, '2022-06-05 21:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '스마트워치', 1, '2022-06-06 02:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '노트북', 1, '2022-06-06 06:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '테블릿', 1, '2022-06-06 11:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, 'TV/모니터', 1, '2022-06-07 07:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '게임', 1, '2022-06-07 18:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '음향기기', 1, '2022-06-08 11:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '카메라', 1, '2022-06-08 21:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '드론', 1, '2022-06-09 22:00:00', now(), NULL);
INSERT INTO category VALUES (NULL, 0, 1, '기타', 1, '2022-06-10 19:00:00', now(), NULL);
