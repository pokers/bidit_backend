SHOW STATUS LIKE 'Threads_connected';
show tables;
select * from user;
select * from kakaoAccount;
delete from user where id=9;
delete from kakaoAccount where id=2233153000;
update kakaoAccount set id=2233153001 where id=2233153000;


select * from successfulBid;
select * from bidding;
select * from bidding where itemId=5 order by price DESC limit 5;

select * from (select * from bidding where itemId=5 order by price) as t group by t.userId limit 5;

select * from item;
update item set status = 1, dueDate = "2022-07-26 23:58:00" where id=5;
select * from itemDescription;
select * from category;
delete from category where id=3;
select * from pushToken;
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