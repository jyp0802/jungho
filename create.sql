DROP DATABASE IF EXISTS junghodb;
CREATE DATABASE junghodb;
USE junghodb;
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS Classes;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE Prayers (
	mid int not null auto_increment,
	user varchar(50),
	detail varchar(3000),
	post_date date,
	PRIMARY KEY (mid)
);

ALTER DATABASE junghodb CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE Prayers CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;