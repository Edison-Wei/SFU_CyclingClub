-- The MySQL schema being used (Please modify this if making adjustments on database)
-- should put AUTO_INCREMENT int rid
CREATE TABLE ExecRoutes (
    rid INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL,
    title VARCHAR(64) NOT NULL,
    gpx LONGTEXT NOT NULL,
    difficulty VARCHAR(16) NOT NULL,
    distance DECIMAL(8, 2) NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    date_created DATE NOT NULL,
    CONSTRAINT difficulty_check CHECK (difficulty = 'Intermediate' OR difficulty = 'Beginner'),
    CONSTRAINT time_check CHECK (start_time < end_time)
);

-- Create View -- A View that can be called to select one ride along from "Intermediate" and "Beginner" from todays date to the next ride found
CREATE VIEW upcomingRide AS
    (SELECT * FROM ExecRoutes WHERE difficulty = 'Intermediate' AND start_date = (SELECT MIN(start_date) FROM ExecRoutes WHERE difficulty = 'Intermediate' AND start_date >= CURRENT_DATE()))
        UNION
    (SELECT * FROM ExecRoutes WHERE difficulty = 'Beginner' AND start_date = (SELECT MIN(start_date) FROM ExecRoutes WHERE difficulty = 'Beginner' AND start_date >= CURRENT_DATE()));

-- ALTER TABLE `ExecRoutes` CHANGE `distance` `distance` DECIMAL(8, 2) NOT NULL;
-- ALTER TABLE `ExecRoutes` CHANGE `rid` `rid`INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL;