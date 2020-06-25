SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

CREATE DATABASE IF NOT EXISTS `delilah-resto` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
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
(52, 'Aleta Gaynes', 'agaynes0', 'agaynes0@mtv.com', 'PdwDrna', '+1 719 715 7628', '1560 Helena Way', 2),
(53, 'Gerhard Challicombe', 'gchallicombe1', 'gchallicombe1@merriam-web', 'w3Lz1XX1MnKV', '+63 333 452 3200', '0 Bonner Alley', 2),
(54, 'Joe Yitzovicz', 'jyitzovicz2', 'jyitzovicz2@chron.com', 'LZCflFbDX', '+375 726 440 7494', '97 Kenwood Road', 2),
(55, 'Guntar Pawden', 'gpawden3', 'gpawden3@hibu.com', 'xbIsKi', '+504 199 551 8403', '32140 Bonner Terrace', 2),
(56, 'Davide Piwall', 'dpiwall4', 'dpiwall4@blinklist.com', 'T1twgIZ', '+86 855 796 8660', '470 Old Gate Park', 2),
(57, 'Gaynor Farryann', 'gfarryann5', 'gfarryann5@mail.ru', 'ejpPI3e1S', '+63 826 547 4811', '3931 Reindahl Drive', 2),
(58, 'Marlane Burburough', 'mburburough6', 'mburburough6@shop-pro.jp', 'rd7vOHy1HLQ', '+54 344 576 9667', '79421 Parkside Road', 2),
(59, 'Devonna Cornner', 'dcornner7', 'dcornner7@opera.com', 'OKdDWEasOp0', '+62 497 253 6354', '4524 Spenser Lane', 2),
(60, 'Rafaelia Le Strange', 'rle8', 'rle8@so-net.ne.jp', '8vlBNeh', '+355 954 638 1120', '37173 Straubel Road', 2),
(61, 'Tuckie Gueste', 'tgueste9', 'tgueste9@adobe.com', 'DNoOJl5UMx22', '+34 104 101 4008', '2 Walton Terrace', 2),
(62, 'Reidar Tapin', 'rtapina', 'rtapina@ft.com', 'uhQz7m0ltQI', '+57 920 271 3969', '87609 Fairview Circle', 2),
(63, 'Dawna Rosendahl', 'drosendahlb', 'drosendahlb@accuweather.c', 'EH11cx382f', '+86 488 137 5800', '4 Moland Center', 2),
(64, 'Annette Bjerkan', 'abjerkanc', 'abjerkanc@economist.com', 'XFMe6OeEP', '+7 461 386 0382', '03783 Pepper Wood Road', 2),
(65, 'Kandace Healey', 'khealeyd', 'khealeyd@ibm.com', 'AOG35gTdzn', '+51 704 588 4462', '66 Marquette Center', 2),
(66, 'Torey Pigrome', 'tpigromee', 'tpigromee@vistaprint.com', 'ED2u6lYEtoxs', '+62 763 398 7520', '05782 Burrows Place', 2),
(67, 'Dorey Acreman', 'dacremanf', 'dacremanf@xinhuanet.com', 'j1F474', '+255 164 263 5246', '979 Westport Avenue', 2),
(68, 'Brig Waldocke', 'bwaldockeg', 'bwaldockeg@delicious.com', 'YZMCGrWF1re', '+86 211 200 1701', '8558 Everett Parkway', 2),
(69, 'Hallie McKeowon', 'hmckeowonh', 'hmckeowonh@prweb.com', 'rO4fq4U', '+63 299 723 0602', '7999 Crest Line Court', 2),
(70, 'Jeannie MacVagh', 'jmacvaghi', 'jmacvaghi@weibo.com', 'TeikYMy', '+236 461 722 4039', '3 Sunbrook Place', 2),
(71, 'Ulysses Eliez', 'ueliezj', 'ueliezj@oaic.gov.au', '8cQcF6DPY', '+503 282 296 5159', '99 Welch Pass', 2),
(72, 'Brady Gutteridge', 'bgutteridgek', 'bgutteridgek@berkeley.edu', 'Ts1n4sS6poQH', '+7 617 203 7833', '6 Ridgeway Road', 2),
(73, 'Marillin Brusby', 'mbrusbyl', 'mbrusbyl@yandex.ru', '1NGpAd', '+93 960 430 0437', '1347 Loomis Hill', 2),
(74, 'Hartley Sly', 'hslym', 'hslym@mit.edu', 'Q6zpLAWV5YD', '+994 407 776 8937', '00429 Charing Cross Plaza', 2),
(75, 'Rhonda Seal', 'rsealn', 'rsealn@redcross.org', '1oMlfxU', '+62 187 556 9719', '164 Hoard Road', 2),
(76, 'Correy Degue', 'cdegueo', 'cdegueo@wordpress.com', '1gEYZPqCb', '+970 921 544 5131', '16 Sherman Junction', 2),
(77, 'Mariele Clelland', 'mclellandp', 'mclellandp@deviantart.com', 'M3rVqZTvvg1', '+66 192 674 2907', '14 Shoshone Street', 2),
(78, 'Rutger Fardo', 'rfardoq', 'rfardoq@devhub.com', 'R7uwjMcvn', '+86 479 106 3108', '5 Petterle Center', 2),
(79, 'Jacquenette Slyde', 'jslyder', 'jslyder@uol.com.br', 'dBOIXmO', '+1 860 704 7467', '88755 Bultman Point', 2),
(80, 'Kimberley Petticrew', 'kpetticrews', 'kpetticrews@washingtonpos', 'IDVVFg57', '+63 347 857 7474', '25 Monica Hill', 2),
(81, 'Katti Bulch', 'kbulcht', 'kbulcht@shop-pro.jp', 'J1DiLS4IKKAj', '+81 976 726 9073', '958 Oakridge Drive', 2),
(82, 'Brice Cota', 'bcotau', 'bcotau@engadget.com', 'qfoy3z', '+86 949 691 2500', '65927 Sloan Center', 2),
(83, 'Alfy Plum', 'aplumv', 'aplumv@abc.net.au', 'd7DYd501x7mW', '+7 724 871 9826', '638 Dwight Circle', 2),
(84, 'Rozina Flitcroft', 'rflitcroftw', 'rflitcroftw@symantec.com', 'LU4ft4v', '+677 838 444 3909', '17 Hooker Point', 2),
(85, 'Fae Gergher', 'fgergherx', 'fgergherx@yellowbook.com', 'zJrHKePH2v5Q', '+55 870 450 8591', '4296 Kinsman Pass', 2),
(86, 'Ronda Welband', 'rwelbandy', 'rwelbandy@alexa.com', 'tmhTHoHa', '+30 909 225 4424', '66310 Everett Circle', 2),
(87, 'Skelly Morgen', 'smorgenz', 'smorgenz@cornell.edu', 'tPfBPz', '+30 883 266 4553', '14316 Prairieview Plaza', 2),
(88, 'Valdemar Hartnup', 'vhartnup10', 'vhartnup10@wiley.com', 'vvA5Rn', '+62 680 353 8307', '5 Magdeline Point', 2),
(89, 'Cletus Bontine', 'cbontine11', 'cbontine11@stanford.edu', 'zNAXPW', '+7 302 935 1893', '048 Forster Court', 2),
(90, 'Leoline Summerbell', 'lsummerbell12', 'lsummerbell12@51.la', '4ZpBVkR', '+351 620 737 7283', '03 Redwing Alley', 2),
(91, 'Selestina Oloman', 'soloman13', 'soloman13@chronoengine.co', 'BEq0qN1', '+84 608 547 7238', '47 School Way', 2),
(92, 'Kati Luxen', 'kluxen14', 'kluxen14@examiner.com', '7mzwNSt', '+7 229 404 7609', '6100 Iowa Court', 2),
(93, 'Hermina Bartle', 'hbartle15', 'hbartle15@slideshare.net', 'idY4oQz3', '+58 640 862 6425', '08837 Texas Avenue', 2),
(94, 'Amalee Cradey', 'acradey16', 'acradey16@harvard.edu', 'UbfMXlKV', '+1 842 744 7844', '94414 La Follette Point', 2),
(95, 'Nicholas Regi', 'nregi17', 'nregi17@istockphoto.com', 'rTXqNJ71VD', '+49 605 608 7172', '7 Parkside Street', 2),
(96, 'Dorthea Jeavons', 'djeavons18', 'djeavons18@ameblo.jp', 'YhjFyya', '+970 551 676 5654', '8 Carey Junction', 2),
(97, 'Allegra Samwaye', 'asamwaye19', 'asamwaye19@google.com.au', 'IoSW0Gie', '+55 943 646 8370', '7119 2nd Crossing', 2),
(98, 'Hortensia Cantero', 'hcantero1a', 'hcantero1a@goodreads.com', 'cbhMbI382cSN', '+86 616 566 8011', '34 Lake View Crossing', 2),
(99, 'Liv Sabin', 'lsabin1b', 'lsabin1b@dropbox.com', 'XtX1e0rXB01', '+33 620 119 6281', '9 Dunning Plaza', 2),
(100, 'Quentin Greathead', 'qgreathead1c', 'qgreathead1c@whitehouse.g', 'jFpML8Xuvn', '+389 731 817 9588', '69687 Old Gate Street', 2),
(101, 'Franni Camier', 'fcamier1d', 'fcamier1d@bravesites.com', '8DkIOgR', '+993 998 472 5183', '710 Merrick Court', 2),
(102, 'Lazaro Roundtree', 'lroundtree1e', 'lroundtree1e@nhs.uk', 'XgELZxJGXK', '+389 572 222 0874', '30493 Ramsey Park', 2),
(103, 'Jillene Garthside', 'jgarthside1f', 'jgarthside1f@intel.com', 'mRIc3o3mOLvt', '+86 762 793 9652', '7 Gulseth Way', 2),
(104, 'Chev Milne', 'cmilne1g', 'cmilne1g@gizmodo.com', 'li3Pi3O', '+93 472 971 4926', '8764 Sutteridge Avenue', 2),
(105, 'Eugine Greneham', 'egreneham1h', 'egreneham1h@toplist.cz', 'fVIFtiT', '+62 864 521 2028', '488 Hayes Hill', 2),
(106, 'Kelley Renvoys', 'krenvoys1i', 'krenvoys1i@dyndns.org', 'SrbfFfS', '+63 845 657 5804', '1 Thackeray Road', 2),
(107, 'Evangelin Hansom', 'ehansom1j', 'ehansom1j@hatena.ne.jp', '5EuHNtwTA', '+1 626 891 2582', '8211 Mandrake Terrace', 2),
(108, 'Cully Lappine', 'clappine1k', 'clappine1k@topsy.com', '7ZC4kRuJW', '+7 837 661 5722', '6525 Cody Circle', 2),
(109, 'Van Gonsalvo', 'vgonsalvo1l', 'vgonsalvo1l@freewebs.com', 'bhKTeO', '+86 134 599 8656', '89920 Kinsman Parkway', 2),
(110, 'Kayley Bromfield', 'kbromfield1m', 'kbromfield1m@nba.com', '6ZWV7AxpIkN4', '+48 859 711 1364', '028 Oak Way', 2),
(111, 'Brook McGruar', 'bmcgruar1n', 'bmcgruar1n@angelfire.com', 'XvoaGttC', '+420 178 436 0184', '9795 Prairie Rose Lane', 2),
(112, 'Justinn Dobbinson', 'jdobbinson1o', 'jdobbinson1o@nymag.com', 'Uzlb3KAf8Sf', '+7 259 911 8201', '857 International Lane', 2),
(113, 'Nertie Lacelett', 'nlacelett1p', 'nlacelett1p@europa.eu', 'S7q48gOUtuv', '+351 229 459 6144', '1 Talisman Trail', 2),
(114, 'Tibold Meates', 'tmeates1q', 'tmeates1q@discuz.net', 'HyFvCYMPOWKM', '+675 339 396 6327', '96 Division Way', 2),
(115, 'Leyla Vautre', 'lvautre1r', 'lvautre1r@ovh.net', 'ANrjs8EJC1', '+86 549 217 1871', '23602 Kinsman Trail', 2),
(116, 'Carlo Hankey', 'chankey1s', 'chankey1s@quantcast.com', 'Do0u2bIf3', '+66 182 559 8490', '66 Bunting Street', 2),
(117, 'Lisa Dart', 'ldart1t', 'ldart1t@washingtonpost.co', 'AhB6RYfc', '+62 703 498 7958', '14510 Stephen Way', 2),
(118, 'Sterne Crawley', 'scrawley1u', 'scrawley1u@apple.com', '1Sic0E77F', '+269 424 479 0618', '731 Melody Park', 2),
(119, 'Tamra Kupisz', 'tkupisz1v', 'tkupisz1v@samsung.com', 'abJD0e', '+7 661 692 4422', '73239 Graceland Way', 2),
(120, 'Evita Reide', 'ereide1w', 'ereide1w@addtoany.com', 'Gev8eLwA', '+55 201 419 0070', '392 Tennessee Park', 2),
(121, 'Hayes Teacy', 'hteacy1x', 'hteacy1x@usda.gov', 'FZFse5p96Lg', '+55 492 200 5808', '519 Old Gate Way', 2),
(122, 'Abbe De Mars', 'ade1y', 'ade1y@aol.com', 'kIbQ0ioFOX', '+351 320 920 9427', '79655 4th Alley', 2),
(123, 'Nissie Summerson', 'nsummerson1z', 'nsummerson1z@patch.com', 'yXCnew', '+212 203 207 0684', '60074 Doe Crossing Junction', 2),
(124, 'Jon Bastone', 'jbastone20', 'jbastone20@mapquest.com', 'MItI6zfcEi3a', '+33 983 918 2023', '9 Dwight Alley', 2),
(126, 'Aubine Bransdon', 'abransdon22', 'abransdon22@hexun.com', 'Xm8roi', '+86 208 662 4065', '631 Sullivan Road', 2),
(127, 'Manny Suffield', 'msuffield23', 'msuffield23@wunderground.', '2QIrWgeTx', '+33 134 798 2320', '7 Dakota Point', 2),
(128, 'Romeo Dable', 'rdable24', 'rdable24@home.pl', '1pU5S2XV', '+63 268 533 9177', '7132 Nova Hill', 2),
(129, 'Abeu Close', 'aclose25', 'aclose25@uiuc.edu', '0dMLo1', '+351 131 504 1860', '94 Mcbride Hill', 2),
(130, 'Kass Cutmore', 'kcutmore26', 'kcutmore26@theguardian.co', 'I7GL41uMty', '+86 430 956 3066', '38 Park Meadow Avenue', 2),
(131, 'Curcio Dufoure', 'cdufoure27', 'cdufoure27@gov.uk', 'VOi2TxdwF', '+255 131 521 2250', '6 Buena Vista Center', 2),
(132, 'Esra Gothrup', 'egothrup28', 'egothrup28@ehow.com', 'yIDGrp1WA9A', '+62 412 507 1070', '77 Straubel Parkway', 2),
(133, 'Elvyn Archley', 'earchley29', 'earchley29@berkeley.edu', 'dgPd1s', '+221 535 499 9403', '8683 Gina Pass', 2),
(134, 'Cybil Blinman', 'cblinman2a', 'cblinman2a@artisteer.com', '3Cs4mO0TqL', '+1 271 817 6352', '79422 Huxley Park', 2),
(135, 'Myron Gregh', 'mgregh2b', 'mgregh2b@senate.gov', 'U1rUn7e2O', '+31 653 789 9866', '4706 Lukken Junction', 2),
(136, 'Hirsch Petriello', 'hpetriello2c', 'hpetriello2c@slideshare.n', 'zW2HuB', '+46 132 224 2282', '870 East Street', 2),
(137, 'Steffi Padillo', 'spadillo2d', 'spadillo2d@digg.com', 'AcT7m9E', '+62 454 658 1930', '11 Stoughton Way', 2),
(138, 'Nilson Po', 'npo2e', 'npo2e@paypal.com', 'UuB1vS', '+58 739 725 9699', '2121 Shopko Place', 2),
(139, 'Flss Magwood', 'fmagwood2f', 'fmagwood2f@zimbio.com', '2dWQ5gMnNa', '+358 762 769 3469', '6 Corben Pass', 2),
(140, 'Ilario Lloyd', 'illoyd2g', 'illoyd2g@posterous.com', 'hBdD9OdVuMxl', '+504 662 979 5978', '9786 Eastwood Terrace', 2),
(141, 'Nicoline Foxon', 'nfoxon2h', 'nfoxon2h@sphinn.com', '7SlUYTD9Nll', '+7 975 987 9984', '2055 Hermina Pass', 2),
(142, 'Roth Spatarul', 'rspatarul2i', 'rspatarul2i@bbb.org', '3DMUadOQoB', '+7 952 505 5932', '70 Shoshone Street', 2),
(143, 'Reamonn Craisford', 'rcraisford2j', 'rcraisford2j@thetimes.co.', 'tBwpRA9B', '+56 944 678 1808', '6744 Hayes Park', 2),
(144, 'Danya Carlsson', 'dcarlsson2k', 'dcarlsson2k@gizmodo.com', 'DDnDUoD4dy', '+62 474 327 5893', '2 Pond Circle', 2),
(145, 'Nollie Suthren', 'nsuthren2l', 'nsuthren2l@infoseek.co.jp', 'CBFGZz5rotE', '+81 262 772 7276', '89 Holy Cross Road', 2),
(146, 'Rikki Normaville', 'rnormaville2m', 'rnormaville2m@google.co.j', 'dPhelLOS', '+63 347 858 0043', '8367 Golf Course Point', 2),
(147, 'Tadio Sharland', 'tsharland2n', 'tsharland2n@fotki.com', 'TyBBmwwtra', '+63 624 435 4399', '973 Spenser Plaza', 2),
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
