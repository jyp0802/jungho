DROP DATABASE IF EXISTS junghodb;
CREATE DATABASE junghodb;
USE junghodb;
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS OtherPrayers;
DROP TABLE IF EXISTS MyPrayers;
DROP TABLE IF EXISTS Vistors;
SET FOREIGN_KEY_CHECKS=1;

CREATE TABLE OtherPrayers (
	pid int not null auto_increment,
	user varchar(50),
	detail varchar(3000),
	post_date date,
	PRIMARY KEY (pid)
);

CREATE TABLE MyPrayers (
	pid int not null auto_increment,
	detail varchar(3000),
	PRIMARY KEY (pid)
);

CREATE TABLE Vistors (
	vid int not null auto_increment,
	visitor varchar(50),
	detail varchar(3000),
	PRIMARY KEY (vid)
);

ALTER DATABASE junghodb CHARACTER SET utf8 COLLATE utf8_general_ci;

ALTER TABLE OtherPrayers CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE MyPrayers CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;
ALTER TABLE Vistors CONVERT TO CHARACTER SET utf8 COLLATE utf8_general_ci;