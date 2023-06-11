-- Create a database first. Then, execute following commands to create the schema:

CREATE TABLE IF NOT EXISTS `sensor_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL COMMENT 'UTC',
  `temperature` decimal(3,1) NOT NULL,
  `humidity` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `relay_history` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `relay` smallint unsigned NOT NULL,
  `relay_name` VARCHAR(100) NOT NULL,
  `enabled` datetime NOT NULL,
  `disabled` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `dates` (`enabled`, `disabled`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

CREATE TABLE IF NOT EXISTS `state` (
  `name` VARCHAR(100),
  `updated` datetime NOT NULL,
  `data` smallint unsigned NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
