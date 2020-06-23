CREATE TABLE IF NOT EXISTS 'hola' (
 'key' INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
 'id_usuario' INTEGER NOT NULL UNIQUE,
 'is_bot' INTEGER,
 'username' TEXT,
 'first_name' TEXT,
 'last_name' TEXT,
 'language_code' TEXT
);

-- CREATE TABLE `delilah-resto`.`status_type2` ( `id` INT NOT NULL AUTO_INCREMENT ,  `type` VARCHAR(36) NOT NULL ,  `description` TEXT NULL ,    PRIMARY KEY  (`id`),    UNIQUE  (`type`)) ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_spanish_ci;