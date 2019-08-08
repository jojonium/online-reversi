/*
 * Create a database called reversi_db and then run this to create tables in it
 * Something like this should work:
 * mysql -h host.example.com -u reversi -p reversi_db < create-tables.sql
 */

-- drop all tables to start fresh
-- make sure these are in the right order to delete foreign key holders first
DROP TABLE IF EXISTS `plays`;
DROP TABLE IF EXISTS `game`;
DROP TABLE IF EXISTS `player`;

CREATE TABLE `game` (
	id         VARCHAR(10) NOT NULL PRIMARY KEY,
	created    DATETIME NOT NULL,
	modified   DATETIME,
	numPlayers INT -- TODO make a trigger to enforce this
);

CREATE TABLE `player` (
	id       INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name     VARCHAR(20) NOT NULL,
	password VARCHAR(128) NOT NULL,
	created  DATETIME NOT NULL
);

CREATE TABLE `plays` (
	gID VARCHAR(10) NOT NULL,
	pID INT NOT NULL
);

ALTER TABLE plays ADD CONSTRAINT pk_gidpid PRIMARY KEY (gID, pID);
ALTER TABLE plays ADD CONSTRAINT fk_gid FOREIGN KEY (gID) REFERENCES game(id);
ALTER TABLE plays ADD CONSTRAINT fk_pid FOREIGN KEY (pID) REFERENCES player(id);


/* Test Data */

INSERT INTO game VALUES ('asdf', '2019-02-03 10:52:00', '2019-08-09 01:22:00', 2);
INSERT INTO game VALUES ('qwerty', '2017-10-27 09:22:00', NULL, 3);

INSERT INTO player (name, password, created) VALUES 
	('John', 'asldkfjaldskfj', '2019-01-01 10:20:20'),
	('Paul', 'oianbeine', '2018-09-27 22:30:33'),
	('George', '0asd9jnbkwj', '2017-02-20 18:33:00'),
	('Ringo', '9v0n3n113nk3lbv', '2018-01-01 19:30:00');

INSERT INTO plays VALUES ('asdf', 1);
INSERT INTO plays VALUES ('asdf', 2); 
INSERT INTO plays VALUES ('asdf', 3);
INSERT INTO plays VALUES ('qwerty', 4);

