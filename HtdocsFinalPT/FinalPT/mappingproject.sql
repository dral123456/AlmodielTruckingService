-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2025 at 03:35 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mappingproject`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fname` varchar(20) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `role` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `fname`, `lname`, `role`) VALUES
(1, 'admin', '123', 'Jethro', 'Almodiel', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fname` varchar(50) NOT NULL,
  `lname` varchar(50) NOT NULL,
  `number` varchar(11) NOT NULL,
  `role` varchar(10) NOT NULL,
  `city` varchar(50) NOT NULL,
  `brgy` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `client`
--

INSERT INTO `client` (`id`, `username`, `password`, `fname`, `lname`, `number`, `role`, `city`, `brgy`) VALUES
(0, 'Pending driver', '123', 'Driver not yet assigned', 'Driver not yet assigned', '0912345678', 'driver', 'Bacolod', 'Mansilingan'),
(1, 'mika', '$2y$10$obopY8YTBIVwVUUT7BkIlewtcRQlXaPqSGLnEXiYBlFmMlNQY/WDK', 'Jethro', 'Almodiel', '2147483647', 'user', 'Bacolod', 'Mansilingan'),
(2, 'jewel', '$2y$10$BXxcRpxOE6UGh6s0YqTE9eny6AOqGG6PQ4orCA8ft4sOEu7EVabZ6', 'Jewel', 'Alfaras', '912345678', 'driver', 'Bacolod', 'Mansilingan'),
(3, 'JM', '$2y$10$BXxcRpxOE6UGh6s0YqTE9eny6AOqGG6PQ4orCA8ft4sOEu7EVabZ6', 'JM', 'Joniega', '09123456789', 'driver', 'Bacolod', 'Mansilingan'),
(4, 'arldrich', '$2y$10$n44XCAqvkefxu1VGc5wrzOCvY9KpDDlV7RmbXcUVxGYQ3VYfECBci', 'Arldrich', 'Marcelino', '09369430341', 'user', 'Bacolod', 'Mansilingan'),
(6, 'user3', '$2y$10$5wl4bbTcqOFXJvYF6Kki7uR17MezENj0W72928EoeCXn03aHaFSt6', 'user', '3', '11111111111', 'user', 'Hinigaran', 'idk');

-- --------------------------------------------------------

--
-- Table structure for table `location`
--

CREATE TABLE `location` (
  `id` int(11) NOT NULL,
  `pickup` varchar(255) NOT NULL,
  `destination` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` date NOT NULL,
  `userID` int(11) NOT NULL,
  `pickuplat` decimal(9,6) NOT NULL,
  `pickuplng` decimal(9,6) NOT NULL,
  `destinationlat` decimal(9,6) NOT NULL,
  `destinationlng` decimal(9,6) NOT NULL,
  `status` varchar(50) NOT NULL,
  `driverid` int(11) NOT NULL,
  `time` time NOT NULL,
  `price` decimal(8,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `location`
--

INSERT INTO `location` (`id`, `pickup`, `destination`, `description`, `date`, `userID`, `pickuplat`, `pickuplng`, `destinationlat`, `destinationlng`, `status`, `driverid`, `time`, `price`) VALUES
(1, 'Mansilingan', 'Alijis', 'Mansilingan', '2025-10-01', 1, 10.669828, 122.947193, 10.668680, 122.950509, 'Delivered', 2, '00:00:00', 5.00),
(2, 'Cadiz', 'Sagay', 'dawdwa', '2025-10-18', 1, 10.669200, 122.948459, 10.668052, 122.951077, 'Transmitting', 2, '00:00:00', 0.00),
(3, 'Alijis', 'Mansilingan', 'Tubang poste', '2025-10-15', 1, 10.636478, 122.950487, 10.631285, 122.974176, 'Delivered', 3, '00:00:00', 0.00),
(4, 'SILAY', 'Talisay', 'hehe', '2025-10-14', 1, 10.696466, 122.968493, 10.695876, 122.974501, 'pending', 0, '02:27:00', 0.00),
(5, 'Bacolod', 'Talisay', 'HEHE', '2025-10-17', 1, 10.651823, 122.932789, 10.645746, 122.953646, 'pending', 0, '13:02:00', 0.00),
(6, 'Himamaylan', 'Bacolod', 'Tubang balay', '2025-10-30', 4, 10.089882, 122.868347, 10.676128, 122.952461, 'pending', 0, '06:20:00', 0.00),
(7, 'Tangub', 'Estefania', 'tubang balay', '2025-10-29', 1, 10.632603, 122.932205, 10.663982, 123.002930, 'pending', 0, '18:40:00', 0.00),
(8, 'tangub', 'mandalagan', 'tubang', '2025-10-23', 1, 10.632940, 122.938728, 10.685912, 122.971687, 'pending', 2, '16:29:00', 60.00);

-- --------------------------------------------------------

--
-- Table structure for table `locationtagging`
--

CREATE TABLE `locationtagging` (
  `id` int(11) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `longitude` decimal(9,6) NOT NULL,
  `category` varchar(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `locationtagging`
--

INSERT INTO `locationtagging` (`id`, `latitude`, `longitude`, `category`, `name`, `description`) VALUES
(1, 10.671275, 122.949437, 'Church', '', ''),
(2, 10.671358, 122.946464, 'Restaurant', '', ''),
(3, 10.671717, 122.949564, 'Mall', '', ''),
(4, 10.672056, 122.948717, 'Park', '', ''),
(5, 10.670875, 122.948942, 'Church', '', ''),
(6, 10.675124, 122.947901, 'Mall', '', '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `location`
--
ALTER TABLE `location`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `locationtagging`
--
ALTER TABLE `locationtagging`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `location`
--
ALTER TABLE `location`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `locationtagging`
--
ALTER TABLE `locationtagging`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
