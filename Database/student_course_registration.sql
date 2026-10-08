CREATE DATABASE  IF NOT EXISTS `student_course_registration` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `student_course_registration`;
-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: student_course_registration
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `courses`
--

DROP TABLE IF EXISTS `courses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `courses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_seats` int NOT NULL,
  `capacity` int NOT NULL,
  `course_code` varchar(20) NOT NULL,
  `course_name` varchar(100) NOT NULL,
  `fee` decimal(10,2) NOT NULL,
  `faculty_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKp02ts69sh53ptd62m3c67v0` (`course_code`),
  KEY `FKkb7y7evjam6951oast40wqk1b` (`faculty_id`),
  CONSTRAINT `FKkb7y7evjam6951oast40wqk1b` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `courses`
--

LOCK TABLES `courses` WRITE;
/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` VALUES (1,49,50,'CS101','Introduction to Computer',25000.00,1),(10,39,40,'CS102','Database Management Systems',22000.00,6),(11,28,30,'CS103','Web Development',20000.00,7),(17,17,20,'cs1010','cyber security',500.00,9),(20,50,50,'CS104','Java Programming',20000.00,5),(21,40,40,'CS105','Database Systems',22000.00,5);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `faculty`
--

DROP TABLE IF EXISTS `faculty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `faculty` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `department` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKeivw7fxg6ss3qdh80ew3ol3u9` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `faculty`
--

LOCK TABLES `faculty` WRITE;
/*!40000 ALTER TABLE `faculty` DISABLE KEYS */;
INSERT INTO `faculty` VALUES (1,'Computer Science','suresh123@college.com','Dr. Suresh Kumar'),(3,'Computer science','gangasukumar05@gmail.com','ganga'),(5,'Computer Science','suresh@college.com','Dr. Suresh Kumar'),(6,'Information Technology','meena@college.com','Dr. Meena Devi'),(7,'Computer Applications','rajesh@college.com','Dr. Rajesh Kumar'),(8,'Database management system','raj@gmail.com','raj'),(9,'Cyber Security','sukumarganga76@gmail.com','suku');
/*!40000 ALTER TABLE `faculty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registrations`
--

DROP TABLE IF EXISTS `registrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `registration_date` date NOT NULL,
  `status` varchar(20) NOT NULL,
  `course_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKcq9uobpm92n9a5awu6hyhe0up` (`student_id`,`course_id`),
  KEY `FKsfbbeggcdx583ihht1yngeam6` (`course_id`),
  CONSTRAINT `FKcmo9lk1tap4hpbawuxhb8qf94` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  CONSTRAINT `FKsfbbeggcdx583ihht1yngeam6` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registrations`
--

LOCK TABLES `registrations` WRITE;
/*!40000 ALTER TABLE `registrations` DISABLE KEYS */;
INSERT INTO `registrations` VALUES (10,'2026-10-06','ACTIVE',1,2),(15,'2026-10-05','CANCELLED',1,4),(16,'2026-10-08','CANCELLED',10,10),(17,'2026-10-05','ACTIVE',10,4),(18,'2026-10-02','ACTIVE',11,6),(19,'2026-10-05','ACTIVE',11,2),(20,'2026-10-05','ACTIVE',17,11),(21,'2026-10-05','ACTIVE',17,2),(22,'2026-10-05','ACTIVE',17,6);
/*!40000 ALTER TABLE `registrations` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_registration_insert` AFTER INSERT ON `registrations` FOR EACH ROW BEGIN

    IF NEW.status = 'ACTIVE' THEN

        UPDATE courses

        SET available_seats =
            available_seats - 1

        WHERE id = NEW.course_id;

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_registration_update` AFTER UPDATE ON `registrations` FOR EACH ROW BEGIN

    -- ACTIVE → CANCELLED
    IF OLD.status = 'ACTIVE'
       AND NEW.status = 'CANCELLED' THEN

        UPDATE courses

        SET available_seats =
            available_seats + 1

        WHERE id = NEW.course_id;

    END IF;


    -- CANCELLED → ACTIVE
    IF OLD.status = 'CANCELLED'
       AND NEW.status = 'ACTIVE' THEN

        UPDATE courses

        SET available_seats =
            available_seats - 1

        WHERE id = NEW.course_id;

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `after_registration_delete` AFTER DELETE ON `registrations` FOR EACH ROW BEGIN

    IF OLD.status = 'ACTIVE' THEN

        UPDATE courses

        SET available_seats =
            available_seats + 1

        WHERE id = OLD.course_id;

    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `phone` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKe2rndfrsx22acpq2ty1caeuyw` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (2,'arun123@gmail.com','Arun karthi','9876543210'),(4,'sukumarganga76@gmail.com','jai','6383729084'),(6,'rahul@gmail.com','Rahul Raj','9876543212'),(10,'priyakumar@gmail.com','kaviya','9876543210'),(11,'anbu2006@gamil.com','anbu','9688908704'),(12,'arun@gmail.com','Arun Kumar','9876543210'),(16,'arun2@gmail.com','Aaa','9876543210'),(17,'santhi2006@gmail.com','santhi kumar','1234567890'),(18,'hema2006@gmail.com','hema','1234567834');
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2a$10$qDoWw36VSsa2yLVNBBVT1.teKm/HNzW9HQ3319TK0d0DPSpSt16dK','ADMIN'),(16,'testuser','$2a$10$ZCk95HkjFD4zV3/4gZIlW.V8UFAdFBuqT1DPobySOp.RSPqOWv98e','USER'),(17,'Ganga','$2a$10$bj59nHPRVYxXjATnPX/VUOH1S3SOjsFg4jEA0ugMDeTEtZqLH80jW','USER');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'student_course_registration'
--
/*!50003 DROP FUNCTION IF EXISTS `count_student_courses` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` FUNCTION `count_student_courses`(
    p_student_id BIGINT
) RETURNS int
    READS SQL DATA
    DETERMINISTIC
BEGIN

    DECLARE v_course_count INT;

    SELECT COUNT(*)
    INTO v_course_count

    FROM registrations

    WHERE student_id = p_student_id
      AND status = 'ACTIVE';

    RETURN v_course_count;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `register_student` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `register_student`(
    IN p_student_id BIGINT,
    IN p_course_id BIGINT
)
BEGIN

    DECLARE v_available_seats INT;
    DECLARE v_registration_status VARCHAR(20);

    -- ----------------------------------------
    -- Check student
    -- ----------------------------------------

    IF NOT EXISTS (
        SELECT 1
        FROM students
        WHERE id = p_student_id
    ) THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student does not exist';

    END IF;


    -- ----------------------------------------
    -- Check course
    -- ----------------------------------------

    IF NOT EXISTS (
        SELECT 1
        FROM courses
        WHERE id = p_course_id
    ) THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Course does not exist';

    END IF;


    -- ----------------------------------------
    -- Lock course row
    -- This helps prevent two users from
    -- taking the same last seat.
    -- ----------------------------------------

    SELECT available_seats
    INTO v_available_seats

    FROM courses

    WHERE id = p_course_id

    FOR UPDATE;


    -- ----------------------------------------
    -- Check available seats
    -- ----------------------------------------

    IF v_available_seats <= 0 THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No seats available';

    END IF;


    -- ----------------------------------------
    -- Check existing registration
    -- ----------------------------------------

    SELECT status
    INTO v_registration_status

    FROM registrations

    WHERE student_id = p_student_id
      AND course_id = p_course_id

    LIMIT 1;


    -- ----------------------------------------
    -- If ACTIVE registration already exists
    -- ----------------------------------------

    IF v_registration_status = 'ACTIVE' THEN

        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Student is already registered';

    END IF;


    -- ----------------------------------------
    -- If CANCELLED registration exists,
    -- reactivate it instead of creating
    -- another row.
    -- ----------------------------------------

    IF v_registration_status = 'CANCELLED' THEN

        UPDATE registrations

        SET
            status = 'ACTIVE',
            registration_date = CURDATE()

        WHERE student_id = p_student_id
          AND course_id = p_course_id;

    ELSE

        -- ------------------------------------
        -- New registration
        -- ------------------------------------

        INSERT INTO registrations (
            student_id,
            course_id,
            registration_date,
            status
        )

        VALUES (
            p_student_id,
            p_course_id,
            CURDATE(),
            'ACTIVE'
        );

    END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-07  0:23:58
