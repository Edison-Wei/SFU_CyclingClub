CREATE TABLE `CyclingRoute`.`LiveTracker` (
    `mid` INT UNSIGNED PRIMARY KEY NOT NULL,
    `latitude` DECIMAL(11,8) NOT NULL,
    `longitude` DECIMAL(11,8) NOT NULL,
    `marker_type` VARCHAR(8) NOT NULL,
    `comment` VARCHAR(64) NULL,
    `date` DATE NOT NULL
)