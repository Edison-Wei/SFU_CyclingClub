CREATE TABLE `Blog`.`Posts` (
    `pid` SMALLINT UNSIGNED NOT NULL ,
    `title` VARCHAR(64) NOT NULL ,
    `desc` TEXT NOT NULL ,
    `category` CHAR(6) NOT NULL ,
    `authorUid` SMALLINT UNSIGNED NOT NULL ,
    `authorName` VARCHAR(64) NOT NULL ,
    `image` TEXT NULL ,
    `editedBy` VARCHAR(64) NULL ,
    `datePosted` DATE NOT NULL 
) ENGINE = InnoDB;