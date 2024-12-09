-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 09, 2024 at 10:35 AM
-- Server version: 8.3.0
-- PHP Version: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `angular`
--

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
CREATE TABLE IF NOT EXISTS `expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `t_id` int NOT NULL,
  `the_expenses` varchar(255) NOT NULL,
  `cost` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `t_id`, `the_expenses`, `cost`) VALUES
(1, 1, 'papers', 300),
(2, 1, 'notebook', 21),
(3, 1, 'TULFO, IDOL RAFFY', 231),
(4, 1, '21', 21),
(5, 1, 'tt', 213),
(6, 1, 'g', 21),
(7, 1, 'asdas', 21),
(8, 1, '21', 1212),
(9, 1, 'asdasda', 21),
(10, 1, 'asdasdsad', 21),
(11, 1, 'sdsadasd', 312),
(12, 1, '13213123', 21),
(26, 5, '31', 2),
(14, 4, 'jinky rose', 21),
(15, 4, 'dasd', 31),
(16, 2, 'kulayu', 32),
(17, 2, '131', 12),
(18, 2, '213', 13),
(19, 2, '32132', 331),
(20, 2, '1313', 21212),
(21, 2, '213', 12131),
(22, 2, 'asdadsa', 21),
(23, 2, 'dasdsad', 21),
(24, 2, '44', 21),
(25, 2, '45', 21131),
(36, 6, 'gulong', 300),
(35, 5, '412', 12),
(33, 5, '21', 12),
(34, 5, '213', 33333),
(37, 6, 'preno ', 200),
(38, 8, 'papels', 200),
(39, 8, 'books', 2000),
(41, 9, 'kuryente', 1000),
(42, 9, 'tubig', 2000);

-- --------------------------------------------------------

--
-- Table structure for table `title_expense`
--

DROP TABLE IF EXISTS `title_expense`;
CREATE TABLE IF NOT EXISTS `title_expense` (
  `id` int NOT NULL AUTO_INCREMENT,
  `use_id` int NOT NULL,
  `title_of_expenses` varchar(255) NOT NULL,
  `budget` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `title_expense`
--

INSERT INTO `title_expense` (`id`, `use_id`, `title_of_expenses`, `budget`) VALUES
(1, 10, 'School', 5000),
(5, 10, 'ok', 21),
(2, 10, 'notebook', 3000),
(6, 10, 'motor', 15000),
(4, 10, 'bahaysa', 9000),
(8, 15, 'schools', 21),
(9, 15, 'house', 10000);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `age`, `password`) VALUES
(13, 'ime', 21, '$2b$10$b3pHXQr7ZvjRdluD3ZavcOfk3vSeECllJ5mob5TBE0j4qLhjRclhG'),
(14, 'tite', 13, '$2b$10$RNKIjMLq5H9Ky.ijGE7hYug9wbuv1s1KjDX6uTlblMQRofQNBdVWq'),
(12, '313', 213, '$2b$10$4SGv3oP5zz9sg1VFZhHyxuwbP4Yx2.ECtf9CJYdE/DsEBksoCjkY2'),
(11, '21', 23, '$2b$10$017t5ffhhKnz9AvkimJ96en8imL2LqoYBZWR7CTT2SIwhBlKusCxO'),
(10, 'mc', 21, '$2b$10$y9nhptKeGA4Bo1w2Jcg2OOV4lyWIe0Zcbsnnly5dla4xhEt3hkEie'),
(15, 'julius', 22, '$2b$10$xcA5yCyOG5p.5/Bii3l0tuSLeyyxRP4qwgO8ce8L3pO1OeutAC.Xi');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
