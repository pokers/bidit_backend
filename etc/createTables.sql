DROP DATABASE IF EXISTS bidit;

CREATE DATABASE bidit;
USE bidit;

CREATE TABLE IF NOT EXISTS user(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    nickname    VARCHAR(255) NULL,
    passwd      VARCHAR(255) NULL,
    joinPath    VARCHAR(16) NULL,
    gender      VARCHAR(16) NULL,
    birth       VARCHAR(64) NULL,
    email       VARCHAR(64) NULL,
    phone       VARCHAR(64) NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    description VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    PRIMARY KEY(id),
    UNIQUE KEY unique_user (joinPath, email, phone),
    INDEX status(status),
    INDEX nickname(nickname),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS kakaoAccount(
    id                              BIGINT NOT NULL,
    status                          INT UNSIGNED NOT NULL,
    userId                          INT UNSIGNED NOT NULL,
    profile_needs_agreement         BOOLEAN NULL,
    profile_nickname_needs_agreement BOOLEAN NULL,
    profile_image_needs_agreement   BOOLEAN NULL,
    name_needs_agreement            BOOLEAN NULL,
    name                            VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    email_needs_agreement           BOOLEAN NULL,
    is_email_valid                  BOOLEAN NULL,
    is_email_verified               BOOLEAN NULL,
    email                           VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    age_range_needs_agreement       BOOLEAN NULL,
    age_range                       VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    birthyear_needs_agreement       BOOLEAN NULL,
    birthyear                       VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    birthday_needs_agreement        BOOLEAN NULL,
    birthday                        VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    birthday_type                   VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    gender_needs_agreement          BOOLEAN NULL,
    gender                          VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    phone_number_needs_agreement    BOOLEAN NULL,
    phone_number                    VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    ci_needs_agreement              BOOLEAN NULL,
    ci                              VARCHAR(256) CHARACTER SET UTF8MB4 NULL,
    ci_authenticated_at             DATETIME NULL,
    nickname                        VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    thumbnail_image_url             VARCHAR(2048) CHARACTER SET UTF8MB4 NULL,
    profile_image_url               VARCHAR(2048) CHARACTER SET UTF8MB4 NULL,
    is_default_image                BOOLEAN NULL,
    createdAt                       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt                       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt                       DATETIME NULL,
    description                     VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_kakaoAccount FOREIGN KEY(userId) REFERENCES user(id),
    INDEX status(status),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS pushToken(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    userId      INT UNSIGNED NOT NULL,
    token       VARCHAR(512) NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    PRIMARY KEY(id),
    UNIQUE KEY unique_pushToken (userId, token),
    CONSTRAINT fk_user_pushToken FOREIGN KEY(userId) REFERENCES user(id)
);

CREATE TABLE IF NOT EXISTS userAlarm(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    userId      INT UNSIGNED NOT NULL,
    alarmId     INT UNSIGNED NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_userAlarm FOREIGN KEY(userId) REFERENCES user(id),
    CONSTRAINT fk_alarm_userAlarm FOREIGN KEY(alarmId) REFERENCES alarm(id)
);

CREATE TABLE IF NOT EXISTS alarm(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    type        INT UNSIGNED NULL,
    title       VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    content     VARCHAR(511) CHARACTER SET UTF8MB4 NULL,    
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    PRIMARY KEY(id),
    INDEX (type)
);

CREATE TABLE IF NOT EXISTS penalty(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    userId      INT UNSIGNED NOT NULL,
    type        VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    dueDate     DATETIME NOT NULL,
    description VARCHAR(511) CHARACTER SET UTF8MB4 NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_penalty FOREIGN KEY(userId) REFERENCES user(id),
    INDEX (type),
    INDEX (dueDate)
);

CREATE TABLE IF NOT EXISTS category (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    parentId    INT UNSIGNED NULL,
    name        VARCHAR(32) CHARACTER SET UTF8MB4 NULL,
    depth       INT UNSIGNED NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    PRIMARY KEY(id),
    UNIQUE KEY unique_category (parentId, depth, name),
    CONSTRAINT fk_category_category FOREIGN KEY(parentId) REFERENCES category(id),
    INDEX depth(depth),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS item (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    userId      INT UNSIGNED NOT NULL,
    categoryId  INT UNSIGNED NOT NULL,
    sPrice      INT UNSIGNED NULL,
    cPrice      INT UNSIGNED NULL,
    buyNow      INT UNSIGNED NULL,
    viewCount   INT UNSIGNED NULL,
    name        VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    title       VARCHAR(255) CHARACTER SET UTF8MB4 NULL,
    dueDate         DATETIME NULL,
    deliveryType    INT UNSIGNED NULL,
    sCondition   INT UNSIGNED NULL,
    aCondition  INT UNSIGNED NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    PRIMARY KEY(id),
    UNIQUE KEY unique_item (userId, categoryId, name, title),
    CONSTRAINT fk_user_item FOREIGN KEY(userId) REFERENCES user(id),
    CONSTRAINT fk_category_item FOREIGN KEY(categoryId) REFERENCES category(id),
    INDEX dueDate(dueDate),
    INDEX status(status),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS itemDescription (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    itemId      INT UNSIGNED NOT NULL,
    type        INT UNSIGNED NOT NULL,
    description TEXT CHARACTER SET UTF8MB4 NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_item_itemDescription FOREIGN KEY(itemId) REFERENCES item(id),
    INDEX type(type),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS itemImage (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    itemId      INT UNSIGNED NOT NULL,
    type        INT UNSIGNED NOT NULL,
    url         TEXT CHARACTER SET UTF8MB4 NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt   DATETIME NULL,
    PRIMARY KEY(id),
    CONSTRAINT fk_item_itemImage FOREIGN KEY(itemId) REFERENCES item(id),
    INDEX type(type),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS bidding (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    userId      INT UNSIGNED NOT NULL,
    itemId      INT UNSIGNED NOT NULL,
    price       INT UNSIGNED NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_bidding FOREIGN KEY(userId) REFERENCES user(id),
    CONSTRAINT fk_item_bidding FOREIGN KEY(itemId) REFERENCES item(id),
    INDEX createdAt(createdAt)
);

CREATE TABLE IF NOT EXISTS successfulBid (
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    userId      INT UNSIGNED NOT NULL,
    itemId      INT UNSIGNED NOT NULL,
    biddingId   INT UNSIGNED NOT NULL,
    createdAt   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    CONSTRAINT fk_user_successfulBid FOREIGN KEY(userId) REFERENCES user(id),
    CONSTRAINT fk_item_successfulBid FOREIGN KEY(itemId) REFERENCES item(id),
    CONSTRAINT fk_bidding_successfulBid FOREIGN KEY(biddingId) REFERENCES bidding(id),
    INDEX createdAt(createdAt)
);

