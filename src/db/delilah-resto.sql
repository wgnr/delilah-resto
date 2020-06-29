SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
DROP DATABASE IF EXISTS `delilah-resto`;
CREATE DATABASE `delilah-resto` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `delilah-resto`;

CREATE TABLE IF NOT EXISTS `dishes_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `name_short` varchar(50) NOT NULL,
  `price` decimal(10,0) NOT NULL,
  `img_path` text NOT NULL,
  `is_available` tinyint(1) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

INSERT IGNORE INTO `dishes_list` (`id`, `name`, `name_short`, `price`, `img_path`, `is_available`, `description`) VALUES
(1, 'Burger', 'Brg', '250', './src/img/brg.png', 1, 'A regular Hambuerguer'),
(2, 'Sandwhich', 'Snw', '100', './src/img/snw.png', 1, 'A regular Sandwhich'),
(3, 'Bat', 'Bt', '3500', './src/img/bat.png', 0, 'A coroniviedo bat.');

CREATE TABLE IF NOT EXISTS `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_order_status` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_payment_type` int(11) NOT NULL,
  `payment_total` decimal(10,0) NOT NULL,
  `order_number` int(11) NOT NULL,
  `address` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `id_oder_status` (`id_order_status`,`id_user`,`id_payment_type`),
  KEY `id_payment_type` (`id_payment_type`),
  KEY `id_user` (`id_user`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `orders_dishes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_dish` int(11) NOT NULL,
  `id_order` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitary_price` decimal(10,0) NOT NULL,
  `sub_total` decimal(10,0) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id` (`id`),
  KEY `id_dish` (`id_dish`,`id_order`),
  KEY `id_order` (`id_order`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `order_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_status` int(11) NOT NULL,
  `id_order` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `id_status` (`id_status`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `payment_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(500) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

INSERT IGNORE INTO `payment_types` (`id`, `type`, `description`) VALUES
(1, 'Cash', 'Pays on arrive.'),
(2, 'Credit Card', 'Pays with credit card.'),
(3, 'Debit Card', 'Pays with debit card.'),
(4, 'Crypto', 'Pays with any cryptocurrency.');

CREATE TABLE IF NOT EXISTS `security_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(500) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

INSERT IGNORE INTO `security_types` (`id`, `type`, `description`) VALUES
(1, 'Admin', 'Admin profile'),
(2, 'User', 'Regular user');

CREATE TABLE IF NOT EXISTS `status_type` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(30) NOT NULL,
  `description` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

INSERT IGNORE INTO `status_type` (`id`, `type`, `description`) VALUES
(1, 'New', 'New order'),
(2, 'Confirmed', 'Confirmed order'),
(3, 'In progress', 'Cooking order'),
(4, 'Sent', 'Order is being delivered'),
(5, 'Cancelled', 'Cancelled order'),
(6, 'Received', 'Order has been received!');

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` text NOT NULL,
  `username` varchar(25) NOT NULL,
  `email` varchar(25) NOT NULL,
  `password` text NOT NULL,
  `phone` varchar(25) NOT NULL,
  `address` text NOT NULL,
  `id_security_type` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_security_type` (`id_security_type`)
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8;

INSERT IGNORE INTO `users` (`id`, `full_name`, `username`, `email`, `password`, `phone`, `address`, `id_security_type`) VALUES
(148, 'Dallas Bilt', 'dbilt2o', 'dbilt2o@vk.com', 'kLWXeNLkwsDG', '+46 293 466 3475', '24682 Oriole Avenue', 2),
(149, 'Elvin Beake', 'ebeake2p', 'ebeake2p@cisco.com', 'eelZ1ObPwJ52', '+63 406 817 6809', '9530 Mayer Drive', 2),
(150, 'Uri Roulston', 'uroulston2q', 'uroulston2q@scribd.com', 'Dn1S0cCe', '+358 171 916 8727', '54586 Maple Wood Point', 2),
(151, 'Adrianna Scimoni', 'ascimoni2r', 'ascimoni2r@nih.gov', 'AmAXZDC', '+224 786 826 7217', '3161 Thierer Trail', 2),
(152, 'Juan Wagner', 'admin', 'none@gmail.com', 'admin', '+54938774514', 'Ocampo 1212 1A', 1);


ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`id_order_status`) REFERENCES `order_status` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`id_payment_type`) REFERENCES `payment_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `orders_dishes`
  ADD CONSTRAINT `orders_dishes_ibfk_1` FOREIGN KEY (`id_dish`) REFERENCES `dishes_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_dishes_ibfk_2` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `order_status`
  ADD CONSTRAINT `order_status_ibfk_1` FOREIGN KEY (`id_status`) REFERENCES `status_type` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`id_security_type`) REFERENCES `security_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
USE `phpmyadmin`;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
