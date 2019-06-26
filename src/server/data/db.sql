-- Create a database first. Then, execute following commands to create the schema:

CREATE TABLE IF NOT EXISTS `sensor_data` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `date` datetime NOT NULL COMMENT 'UTC',
  `temperature` decimal(3,1) NOT NULL,
  `humidity` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `date` (`date`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;
