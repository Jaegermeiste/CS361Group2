-- Group 2
-- CS361 - Software Engineering

-- ---------------- --
# Cleanup as necessary
-- ---------------- --
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `anomalies`;
DROP TABLE IF EXISTS `anomaly_types`;
DROP TABLE IF EXISTS `employee_group`;
DROP TABLE IF EXISTS `employee_groups`;	-- Kill this with fire
DROP TABLE IF EXISTS `employees`;
DROP TABLE IF EXISTS `discrepancy_types`;
DROP TABLE IF EXISTS `rules`; 
DROP TABLE IF EXISTS `features_disabled`;
DROP TABLE IF EXISTS `lockdown_boundaries`;
DROP TABLE IF EXISTS `groups`;

-- ---------- --
# DB Creation
-- ---------- --

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` 				INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
  `timestamp` 			timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `username` 			VARCHAR(64) NOT NULL,
  `password_hash` 		BLOB NOT NULL,
  `salt`			BLOB NOT NULL
);

--
-- Table structure for table `anomalies`
--

CREATE TABLE `anomalies` (
  `id` int(11) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `employee_id` int(11) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `latitude` int(11) DEFAULT NULL,
  `longitude` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `anomalies`
--

INSERT INTO `anomalies` (`id`, `timestamp`, `employee_id`, `group_id`, `type_id`, `latitude`, `longitude`) VALUES
(5, NULL, 7, 2, 2, 10, 33),
(8, NULL, 3, 6, 2, 100, -40),
(9, NULL, 5, 2, 1, NULL, NULL),
(10, NULL, 3, 2, 1, NULL, NULL),
(11, NULL, 6, 2, 1, NULL, NULL),
(12, NULL, 5, 2, 2, 100, -100),
(13, NULL, 4, 1, 1, NULL, NULL),
(14, NULL, 6, 4, 2, 40, -60),
(15, NULL, 2, 1, 1, NULL, NULL),
(16, NULL, 4, 3, 1, NULL, NULL),
(17, NULL, 2, 6, 1, NULL, NULL),
(18, NULL, 6, 5, 1, NULL, NULL),
(19, NULL, 7, 5, 1, NULL, NULL),
(20, NULL, 2, 5, 2, 70, -50);

-- --------------------------------------------------------

--
-- Table structure for table `anomaly_types`
--

CREATE TABLE `anomaly_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `anomaly_types`
--

INSERT INTO `anomaly_types` (`id`, `name`) VALUES
(1, 'TIME'),
(2, 'LOCATION');

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int(11) NOT NULL,
  `f_name` varchar(255) NOT NULL,
  `l_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `employees`
--

INSERT INTO `employees` (`id`, `f_name`, `l_name`) VALUES
(1, 'Cody', 'Hannan'),
(2, 'Rick', 'James'),
(3, 'Jerry', 'Seinfeld'),
(4, 'George', 'Costanza'),
(5, 'Brook', 'Shields'),
(6, 'Mable', 'Pines'),
(7, 'Dipper', 'Pines');

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups` (
  `id` INT AUTO_INCREMENT UNIQUE NOT NULL PRIMARY KEY,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `groups`
--

INSERT INTO `groups` (`id`, `name`) VALUES
(1, 'Red'),
(2, 'Blue'),
(3, 'Green'),
(4, 'Yellow'),
(5, 'Orange'),
(6, 'Purple');


CREATE TABLE `employee_group` (
  `employeeId`	INT DEFAULT NULL,
  `groupId`		INT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


INSERT INTO `employee_group` (`employeeId`, `groupId`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `anomalies`
--
ALTER TABLE `anomalies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `eid_fk` (`employee_id`),
  ADD KEY `gid_fk` (`group_id`),
  ADD KEY `tid_fk` (`type_id`);

--
-- Indexes for table `anomaly_types`
--
ALTER TABLE `anomaly_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `anomalies`
--
ALTER TABLE `anomalies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `anomaly_types`
--
ALTER TABLE `anomaly_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `groups`
--
ALTER TABLE `groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `anomalies`
--
ALTER TABLE `anomalies`
  ADD CONSTRAINT `eid_fk` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `gid_fk` FOREIGN KEY (`group_id`) REFERENCES `groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `tid_fk` FOREIGN KEY (`type_id`) REFERENCES `anomaly_types` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

ALTER TABLE `employee_group`
  ADD CONSTRAINT `eg_eid_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `eg_gid_fk` FOREIGN KEY (`groupId`) REFERENCES `groups` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

CREATE TABLE `lockdown_boundaries` (
	`id` int(11) NOT NULL AUTO_INCREMENT, 
	`name` varchar(255) NOT NULL, 
	`latitude` int(11), 
	`longitude` int(11),
	PRIMARY KEY (`id`)
 )ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE `features_disabled` (
	`id` int(11) NOT NULL AUTO_INCREMENT, 
	`name` varchar(255) NOT NULL, 
	PRIMARY KEY (`id`)
 )ENGINE=InnoDB CHARSET=utf8;

CREATE TABLE `rules` (
    `id` int(11) NOT NULL AUTO_INCREMENT, 
    `group_id` int(11) NOT NULL,
    `lb_id` int(11) NOT NULL, 
    `fd_id` int(11) NOT NULL, 
    PRIMARY KEY (`id`), 
    FOREIGN KEY (`group_id`) REFERENCES `groups`(`id`), 
    FOREIGN KEY (`lb_id`) REFERENCES `lockdown_boundaries`(`id`), 
    FOREIGN KEY (`fd_id`) REFERENCES `features_disabled`(`id`)
 )ENGINE=InnoDB; 