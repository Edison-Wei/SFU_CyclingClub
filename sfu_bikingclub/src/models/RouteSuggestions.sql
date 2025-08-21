-- The MySQL schema being used (Please modify this if making adjustments on database)
CREATE TABLE RouteSuggestions (
    sid INTEGER UNSIGNED PRIMARY KEY NOT NULL AUTO_INCREMENT,
    created_by VARCHAR(255) NOT NULL,
    date_created DATE NOT NULL,
    gpx LONGTEXT NOT NULL,
    distance DECIMAL(8, 2) NOT NULL,
    CONSTRAINT email_check CHECK (created_by REGEXP '^[^@]+@sfu\\.ca$')
);