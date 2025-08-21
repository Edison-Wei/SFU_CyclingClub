CREATE TABLE PreviousRoute (
    rid INTEGER UNSIGNED PRIMARY KEY NOT NULL,
    title VARCHAR(64) NOT NULL,
    description VARCHAR(500) NULL,
    gpx LONGTEXT NOT NULL,
    elapsed_time VARCHAR(8),
    date_created DATE NOT NULL
);