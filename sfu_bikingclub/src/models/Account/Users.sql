CREATE TABLE `Account`.`Users` (
    `uid` SMALLINT UNSIGNED NOT NULL , 
    `fullname` VARCHAR(32) NOT NULL , 
    `role` VARCHAR(32) NOT NULL,
    `email` VARCHAR(16) NOT NULL , 
    `password` BINARY(60) NOT NULL,
    CONSTRAINT `email_check` CHECK (`email` REGEXP '^[^@]+@sfu\\.ca$')
) ENGINE = InnoDB;