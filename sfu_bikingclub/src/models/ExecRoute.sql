-- The MySQL schema being used (Please modify this if making adjustments on database)
-- Can put AUTO INCREMENT in rid (to increase speed)
CREATE TABLE ExecRoutes (
    rid INTEGER UNSIGNED PRIMARY KEY NOT NULL,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(500) NULL,
    gpx LONGTEXT NOT NULL,
    difficulty VARCHAR(16) NOT NULL,
    distance DECIMAL(8, 2) NOT NULL,
    start_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    date_created DATE NOT NULL,
    CONSTRAINT difficulty_check CHECK (difficulty = 'Intermediate' OR difficulty = 'Beginner' OR difficulty = 'Moderate'),
    CONSTRAINT time_check CHECK (start_time < end_time)
);

-- Create View -- A View that can be called to select one ride along from "Intermediate" and "Beginner" from todays date to the next ride found
CREATE VIEW upcomingRide AS
    SELECT *
    FROM ExecRoutes
    WHERE start_date > CURRENT_DATE()
        AND difficulty IN ('Beginner', 'Moderate', 'Intermediate')
    GROUP BY difficulty
    ORDER BY start_date;

-- Not 100% if these changes are applied to the table
-- ALTER TABLE `ExecRoutes` CHANGE `distance` `distance` DECIMAL(8, 2) NOT NULL;

-- ALTER TABLE `ExecRoutes` CHANGE `rid` `rid`INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT NOT NULL; (Not applying)