-- DROP DATABASE IF EXISTS bidit;

-- CREATE DATABASE bidit;
-- USE bidit;

CREATE TABLE IF NOT EXISTS user(
    id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
    status      INT UNSIGNED NOT NULL,
    uniqueID    VARCHAR(255) NULL,
    passwd      VARCHAR(255),
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
    INDEX uniqueID(uniqueID),
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
    UNIQUE KEY unique_category (status, parentId, depth, name),
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
    UNIQUE KEY unique_item (status, userId, categoryId, name, title),
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
    UNIQUE KEY unique_itemImage (status, itemId, type, url),
    CONSTRAINT fk_item_itemImage FOREIGN KEY(itemId) REFERENCES item(id),
    INDEX type(type),
    INDEX createdAt(createdAt)
);