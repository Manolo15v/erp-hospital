USE `sistema_gestion_hospitalaria`;
CREATE DATABASE IF NOT EXISTS `sistema_gestion_hospitalaria` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: sistema_gestion_hospitalaria
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `almacenes_ubicaciones`
--

DROP TABLE IF EXISTS `almacenes_ubicaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `almacenes_ubicaciones` (
  `Id_Ubicacion` int NOT NULL AUTO_INCREMENT,
  `Area` varchar(100) NOT NULL,
  `Ubicacion` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id_Ubicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `almacenes_ubicaciones`
--

LOCK TABLES `almacenes_ubicaciones` WRITE;
/*!40000 ALTER TABLE `almacenes_ubicaciones` DISABLE KEYS */;
INSERT INTO `almacenes_ubicaciones` VALUES (1,'Laboratorio','Estante 3-B'),(2,'Farmacia Principal','Pasillo 1-A'),(3,'Emergencia','Depósito E-2'),(4,'Pediatría','Gabinete P-4'),(5,'Quirófano','Sala Q-1');
/*!40000 ALTER TABLE `almacenes_ubicaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `camas`
--

DROP TABLE IF EXISTS `camas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `camas` (
  `cama_id` int NOT NULL AUTO_INCREMENT,
  `habitacion_id` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`cama_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `camas`
--

LOCK TABLES `camas` WRITE;
/*!40000 ALTER TABLE `camas` DISABLE KEYS */;
INSERT INTO `camas` VALUES (1,1,1),(2,1,1),(3,1,1),(4,1,0),(5,2,1),(6,2,1),(7,2,1),(8,2,1),(9,3,1),(10,3,1),(11,3,1),(12,3,1),(13,3,1);
/*!40000 ALTER TABLE `camas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `citas`
--

DROP TABLE IF EXISTS `citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `citas` (
  `cita_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `fecha_cita` datetime DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `tipo_cita_id` int DEFAULT NULL,
  `observaciones` text,
  PRIMARY KEY (`cita_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `citas`
--

LOCK TABLES `citas` WRITE;
/*!40000 ALTER TABLE `citas` DISABLE KEYS */;
/*!40000 ALTER TABLE `citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultas_medicas`
--

DROP TABLE IF EXISTS `consultas_medicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas_medicas` (
  `consulta_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `medico_id` int DEFAULT NULL,
  `fecha_consulta` datetime DEFAULT NULL,
  `historial_id` int DEFAULT NULL,
  `cita_id` int DEFAULT NULL,
  PRIMARY KEY (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultas_medicas`
--

LOCK TABLES `consultas_medicas` WRITE;
/*!40000 ALTER TABLE `consultas_medicas` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultas_medicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `consultas_odontologicas`
--

DROP TABLE IF EXISTS `consultas_odontologicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas_odontologicas` (
  `consulta_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `odontologo_id` int DEFAULT NULL,
  `fecha_consulta` datetime DEFAULT NULL,
  `historial_id` int DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `cita_id` int DEFAULT NULL,
  PRIMARY KEY (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultas_odontologicas`
--

LOCK TABLES `consultas_odontologicas` WRITE;
/*!40000 ALTER TABLE `consultas_odontologicas` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultas_odontologicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departamentos`
--

DROP TABLE IF EXISTS `departamentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departamentos` (
  `departamento_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`departamento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departamentos`
--

LOCK TABLES `departamentos` WRITE;
/*!40000 ALTER TABLE `departamentos` DISABLE KEYS */;
INSERT INTO `departamentos` VALUES (10,'Ninguna','N/A'),(11,'Oncología','Especialista en el diagnóstico y tratamiento del cáncer');
/*!40000 ALTER TABLE `departamentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dientes`
--

DROP TABLE IF EXISTS `dientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dientes` (
  `diente_id` int NOT NULL AUTO_INCREMENT,
  `sector_id` int DEFAULT NULL,
  `numero_diente` int DEFAULT NULL,
  PRIMARY KEY (`diente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dientes`
--

LOCK TABLES `dientes` WRITE;
/*!40000 ALTER TABLE `dientes` DISABLE KEYS */;
/*!40000 ALTER TABLE `dientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `empleado_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `cedula` int DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `rol_id` int DEFAULT NULL,
  `cargo` varchar(255) DEFAULT NULL,
  `departamento_id` int DEFAULT NULL,
  `sueldo` int DEFAULT NULL,
  `estado` text NOT NULL,
  `area` varchar(250) NOT NULL,
  `descripcion_empleado` text,
  PRIMARY KEY (`empleado_id`),
  UNIQUE KEY `empleado_id` (`empleado_id`),
  UNIQUE KEY `empleado_id_2` (`empleado_id`),
  UNIQUE KEY `empleado_id_3` (`empleado_id`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telefono` (`telefono`),
  KEY `empleados_ibfk_1` (`rol_id`),
  KEY `empleados_ibfk_2` (`departamento_id`),
  CONSTRAINT `empleados_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`rol_id`),
  CONSTRAINT `empleados_ibfk_2` FOREIGN KEY (`departamento_id`) REFERENCES `departamentos` (`departamento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (18,'Pedro','Pérez',12786901,'1976-02-10','2025-04-08','Carabobo, Naguanagua','pedroperez@greysloan.com','04146578311',7,'Director',11,2500,'Activo','Gestión de Personal','Ninguna'),(22,'Manuel','López',29768321,'2002-06-11','2025-04-22','Carabobo, Guacara','manuellopez@greysloan.com','04127689432',7,'Empleado',10,1000,'Activo','Gestión de Personal',NULL),(23,'Luis','León',31139586,'2005-05-17','2025-04-24','Carabobo, San Diego','luisleon@greysloan.com','04128316804',8,'Empleado',10,1500,'Activo','Consultas Odontológicas','N/A');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `equipos`
--

DROP TABLE IF EXISTS `equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `equipos` (
  `Id_Equipo` int NOT NULL AUTO_INCREMENT,
  `Fecha_Instalacion` date DEFAULT NULL,
  `Estado` varchar(50) DEFAULT NULL,
  `Frecuencia_mantenimiento` varchar(50) DEFAULT NULL,
  `Numero_de_serie` varchar(100) DEFAULT NULL,
  `Id_Modelo` int NOT NULL,
  `Id_Ubicacion` int NOT NULL,
  PRIMARY KEY (`Id_Equipo`),
  KEY `Id_Modelo` (`Id_Modelo`),
  KEY `Id_Ubicacion` (`Id_Ubicacion`),
  CONSTRAINT `equipos_ibfk_1` FOREIGN KEY (`Id_Modelo`) REFERENCES `modelos_equipos` (`Id_Modelo`) ON DELETE CASCADE,
  CONSTRAINT `equipos_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `equipos`
--

LOCK TABLES `equipos` WRITE;
/*!40000 ALTER TABLE `equipos` DISABLE KEYS */;
INSERT INTO `equipos` VALUES (1,'2025-03-15','Operativo','Trimestral','SN-CEN3000-12345',1,1);
/*!40000 ALTER TABLE `equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `examenes_hospitalizacion`
--

DROP TABLE IF EXISTS `examenes_hospitalizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `examenes_hospitalizacion` (
  `hospitalizacion_id` int DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  `cedula` varchar(50) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `titulo` varchar(50) DEFAULT NULL,
  `parametros` varchar(50) DEFAULT NULL,
  KEY `hospitalizacion_id` (`hospitalizacion_id`),
  CONSTRAINT `examenes_hospitalizacion_ibfk_1` FOREIGN KEY (`hospitalizacion_id`) REFERENCES `hospitalizaciones` (`hospitalizacion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `examenes_hospitalizacion`
--

LOCK TABLES `examenes_hospitalizacion` WRITE;
/*!40000 ALTER TABLE `examenes_hospitalizacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `examenes_hospitalizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `habitaciones`
--

DROP TABLE IF EXISTS `habitaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `habitaciones` (
  `habitacion_id` int NOT NULL AUTO_INCREMENT,
  `ubicacion` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`habitacion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `habitaciones`
--

LOCK TABLES `habitaciones` WRITE;
/*!40000 ALTER TABLE `habitaciones` DISABLE KEYS */;
INSERT INTO `habitaciones` VALUES (1,'Piso 1','Activa'),(2,'Piso 1','Activa'),(3,'Piso 1','Activa');
/*!40000 ALTER TABLE `habitaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historiales_medicos`
--

DROP TABLE IF EXISTS `historiales_medicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historiales_medicos` (
  `historial_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `diagnostico` text,
  `tratamiento` text,
  `observaciones` text,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historiales_medicos`
--

LOCK TABLES `historiales_medicos` WRITE;
/*!40000 ALTER TABLE `historiales_medicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `historiales_medicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historiales_odontologicos`
--

DROP TABLE IF EXISTS `historiales_odontologicos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historiales_odontologicos` (
  `historial_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `descripcion` text,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historiales_odontologicos`
--

LOCK TABLES `historiales_odontologicos` WRITE;
/*!40000 ALTER TABLE `historiales_odontologicos` DISABLE KEYS */;
/*!40000 ALTER TABLE `historiales_odontologicos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `horarios`
--

DROP TABLE IF EXISTS `horarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `horarios` (
  `horario_id` int NOT NULL AUTO_INCREMENT,
  `turno` varchar(255) DEFAULT NULL,
  `dia` varchar(255) DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  PRIMARY KEY (`horario_id`),
  KEY `horarios_ibfk_1` (`empleado_id`),
  CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `horarios`
--

LOCK TABLES `horarios` WRITE;
/*!40000 ALTER TABLE `horarios` DISABLE KEYS */;
INSERT INTO `horarios` VALUES (13,'Diurno, Diurno, Diurno, Diurno, Diurno, No asiste, No asiste','Lunes, Martes, Miércoles, Jueves, Viernes',18),(17,'Diurno, No asiste, Diurno, No asiste, Diurno, No asiste, No asiste','Lunes, Miércoles, Viernes',22),(18,'Diurno, No asiste, Diurno, No asiste, No asiste, No asiste, No asiste','Lunes, Miércoles',23);
/*!40000 ALTER TABLE `horarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitalizaciones`
--

DROP TABLE IF EXISTS `hospitalizaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitalizaciones` (
  `hospitalizacion_id` int NOT NULL AUTO_INCREMENT,
  `motivo` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT NULL,
  `fecha_egreso` datetime DEFAULT NULL,
  `paciente_id` int DEFAULT NULL,
  `diagnostico` text,
  `notas_medicas` text,
  `medicamentos` text,
  `dieta` text,
  `habitacion_id` int DEFAULT NULL,
  `cama_id` int DEFAULT NULL,
  PRIMARY KEY (`hospitalizacion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitalizaciones`
--

LOCK TABLES `hospitalizaciones` WRITE;
/*!40000 ALTER TABLE `hospitalizaciones` DISABLE KEYS */;
INSERT INTO `hospitalizaciones` VALUES (1,'Cuadro clínico complejo','Activo','2025-04-25 00:04:37',NULL,2,'Ninguna','Ninguna','Acetaminofen','Líquida',1,4);
/*!40000 ALTER TABLE `hospitalizaciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingresos`
--

DROP TABLE IF EXISTS `ingresos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingresos` (
  `ingresos_id` int NOT NULL AUTO_INCREMENT,
  `cantidad` int DEFAULT NULL,
  `concepto` text,
  `tipo_ingreso` text,
  `contribuyente` text,
  `fecha` date NOT NULL,
  `moneda` varchar(255) NOT NULL,
  `tipo_contribuyente` varchar(255) NOT NULL,
  `identificacion_contribuyente` varchar(255) NOT NULL,
  PRIMARY KEY (`ingresos_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingresos`
--

LOCK TABLES `ingresos` WRITE;
/*!40000 ALTER TABLE `ingresos` DISABLE KEYS */;
INSERT INTO `ingresos` VALUES (2,10000,'Presupuesto','Estado','Gobernación de Carabobo','2025-04-19','$','Empresa','J - 123456789');
/*!40000 ALTER TABLE `ingresos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instrumentos`
--

DROP TABLE IF EXISTS `instrumentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instrumentos` (
  `Id_Instrumento` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text,
  `Tipo_Instrumento` varchar(50) DEFAULT NULL,
  `Unidades` int DEFAULT '0',
  `Unidades_Minimas` int DEFAULT '0',
  `Unidades_Maximas` int DEFAULT NULL,
  `Codigo` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`Id_Instrumento`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instrumentos`
--

LOCK TABLES `instrumentos` WRITE;
/*!40000 ALTER TABLE `instrumentos` DISABLE KEYS */;
INSERT INTO `instrumentos` VALUES (1,'Pipeta Digital','Pipeta de alta precisión para medición exacta','Medición',20,5,50,'10001'),(2,'Bisturí','Instrumento de corte utilizado en procedimientos quirúrgicos','Corte',100,20,200,'10002'),(3,'Termómetro Digital','Dispositivo para medir la temperatura corporal','Medición',30,10,60,'10003'),(4,'Pinzas Quirúrgicas','Instrumento para sujetar tejidos durante cirugía','Sujeción',5,10,100,'10004'),(5,'Tijeras de Tejido','Tijeras especiales para cortar tejidos en cirugía','Corte',40,10,80,'10005'),(6,'Estetoscopio','Instrumento para auscultar sonidos internos del cuerpo','Diagnóstico',25,5,50,'10006'),(7,'Martillo de Reflejos','Herramienta para pruebas neurológicas','Diagnóstico',3,5,30,'10007'),(8,'Espéculo Vaginal','Instrumento para exámenes ginecológicos','Examinación',60,10,120,'10008'),(9,'Jeringa Estéril','Dispositivo para inyectar o extraer líquidos','Inyección',200,50,500,'10009'),(10,'Bandeja Quirúrgica','Superficie estéril para colocar instrumentos durante cirugías','Apoyo',10,2,20,'10010');
/*!40000 ALTER TABLE `instrumentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instrumentos_ubicacion`
--

DROP TABLE IF EXISTS `instrumentos_ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instrumentos_ubicacion` (
  `Unidades_Por_Ubicacion` int DEFAULT '0',
  `Id_Instrumento` int NOT NULL,
  `Id_Ubicacion` int NOT NULL,
  PRIMARY KEY (`Id_Instrumento`,`Id_Ubicacion`),
  KEY `Id_Ubicacion` (`Id_Ubicacion`),
  CONSTRAINT `instrumentos_ubicacion_ibfk_1` FOREIGN KEY (`Id_Instrumento`) REFERENCES `instrumentos` (`Id_Instrumento`),
  CONSTRAINT `instrumentos_ubicacion_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instrumentos_ubicacion`
--

LOCK TABLES `instrumentos_ubicacion` WRITE;
/*!40000 ALTER TABLE `instrumentos_ubicacion` DISABLE KEYS */;
INSERT INTO `instrumentos_ubicacion` VALUES (51,1,1),(52,1,2),(53,1,3),(10,2,1),(20,2,2),(30,2,3),(51,4,1),(52,4,2),(53,4,3);
/*!40000 ALTER TABLE `instrumentos_ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lista_espera_hospitalizacion`
--

DROP TABLE IF EXISTS `lista_espera_hospitalizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lista_espera_hospitalizacion` (
  `paciente_id` int DEFAULT NULL,
  `motivo` varchar(50) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `nombre` varchar(50) DEFAULT NULL,
  `apellido` varchar(50) DEFAULT NULL,
  KEY `paciente_id` (`paciente_id`),
  CONSTRAINT `lista_espera_hospitalizacion_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`paciente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lista_espera_hospitalizacion`
--

LOCK TABLES `lista_espera_hospitalizacion` WRITE;
/*!40000 ALTER TABLE `lista_espera_hospitalizacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `lista_espera_hospitalizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mantenimiento_equipos`
--

DROP TABLE IF EXISTS `mantenimiento_equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mantenimiento_equipos` (
  `mantenimiento_id` int NOT NULL AUTO_INCREMENT,
  `tipomantenimiento` varchar(255) DEFAULT NULL,
  `equipo_id` int DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `campo` varchar(255) DEFAULT NULL,
  `repuesto_id` int DEFAULT NULL,
  PRIMARY KEY (`mantenimiento_id`),
  KEY `equipo_id` (`equipo_id`),
  KEY `repuesto_id` (`repuesto_id`),
  CONSTRAINT `mantenimiento_equipos_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`Id_Equipo`),
  CONSTRAINT `mantenimiento_equipos_ibfk_2` FOREIGN KEY (`repuesto_id`) REFERENCES `repuestos` (`Id_Repuesto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mantenimiento_equipos`
--

LOCK TABLES `mantenimiento_equipos` WRITE;
/*!40000 ALTER TABLE `mantenimiento_equipos` DISABLE KEYS */;
INSERT INTO `mantenimiento_equipos` VALUES (1,'Correctivo',1,'2025-04-23 00:00:00','Ninguna','En proceso','Cirugía',1);
/*!40000 ALTER TABLE `mantenimiento_equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modelos_equipos`
--

DROP TABLE IF EXISTS `modelos_equipos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelos_equipos` (
  `Id_Modelo` int NOT NULL AUTO_INCREMENT,
  `Modelo` varchar(100) DEFAULT NULL,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text,
  `Codigo` varchar(50) NOT NULL,
  `Marca` varchar(100) DEFAULT NULL,
  `Unidades` int DEFAULT NULL,
  PRIMARY KEY (`Id_Modelo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modelos_equipos`
--

LOCK TABLES `modelos_equipos` WRITE;
/*!40000 ALTER TABLE `modelos_equipos` DISABLE KEYS */;
INSERT INTO `modelos_equipos` VALUES (1,'CEN-3000','Centrífuga Industrial','Centrífuga de alta velocidad para laboratorio','CEN3000','LabTech',5),(2,'ECG-210','Electrocardiógrafo','Equipo para monitoreo de la actividad eléctrica del corazón','ECG210','CardioMed',3),(3,'VEN-800','Ventilador Mecánico','Soporte respiratorio para pacientes en cuidados intensivos','VEN800','RespiraTech',10),(4,'INF-500','Bomba de Infusión','Dispositivo para administrar medicamentos vía intravenosa','INF500','MediFlow',15),(5,'DES-900','Desfibrilador Automático','Equipo para restablecer el ritmo cardíaco en emergencias','DES900','LifeLine',4);
/*!40000 ALTER TABLE `modelos_equipos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modelos_productos`
--

DROP TABLE IF EXISTS `modelos_productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modelos_productos` (
  `Id_Producto` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text,
  `Codigo` varchar(50) DEFAULT NULL,
  `Tipo_Producto` varchar(50) DEFAULT NULL,
  `Tipo_Unidad` varchar(20) DEFAULT NULL,
  `Unidades_Maximas` int DEFAULT NULL,
  `Unidades_Minimas` int DEFAULT '0',
  PRIMARY KEY (`Id_Producto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modelos_productos`
--

LOCK TABLES `modelos_productos` WRITE;
/*!40000 ALTER TABLE `modelos_productos` DISABLE KEYS */;
INSERT INTO `modelos_productos` VALUES (1,'Paracetamol','Analgésico y antipirético utilizado para aliviar dolores leves y reducir la fiebre.','MED001','Medicamento','Tabletas',1000,100),(2,'Amoxicilina','Antibiótico de amplio espectro para infecciones bacterianas.','MED002','Medicamento','Cápsulas',800,80),(3,'Salbutamol','Broncodilatador usado para aliviar los síntomas del asma.','MED003','Medicamento','Aerosol',300,30),(4,'Metformina','Medicamento para el control de la diabetes tipo 2.','MED004','Medicamento','Tabletas',600,60),(5,'Diclofenaco','Antiinflamatorio no esteroideo para tratar dolor e inflamación.','MED005','Medicamento','Tabletas',700,70),(6,'Loratadina','Antihistamínico usado para aliviar síntomas de alergias.','MED006','Medicamento','Tabletas',500,50),(7,'Omeprazol','Inhibidor de la bomba de protones utilizado para tratar el reflujo gástrico.','MED007','Medicamento','Cápsulas',750,75),(8,'Insulina','Hormona utilizada para el tratamiento de la diabetes mellitus.','MED008','Medicamento','Frascos',400,40),(9,'Ceftriaxona','Antibiótico de tercera generación para infecciones graves.','MED009','Medicamento','Ampollas',350,35),(10,'Ibuprofeno','Antiinflamatorio y analgésico usado para dolores leves a moderados.','MED010','Medicamento','Tabletas',900,90);
/*!40000 ALTER TABLE `modelos_productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nominas`
--

DROP TABLE IF EXISTS `nominas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nominas` (
  `nomina_id` int NOT NULL AUTO_INCREMENT,
  `salario_base` float DEFAULT NULL,
  `salario_neto` float DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  `numero_cuenta` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nomina_id`),
  UNIQUE KEY `numero_cuenta` (`numero_cuenta`),
  KEY `nominas_ibfk_1` (`empleado_id`),
  CONSTRAINT `nominas_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nominas`
--

LOCK TABLES `nominas` WRITE;
/*!40000 ALTER TABLE `nominas` DISABLE KEYS */;
INSERT INTO `nominas` VALUES (12,2500,3000,18,'8790001236'),(16,1000,1200,22,'7680000123'),(17,1500,2000,23,'65784793881');
/*!40000 ALTER TABLE `nominas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `odontodiagrama`
--

DROP TABLE IF EXISTS `odontodiagrama`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `odontodiagrama` (
  `odontodiagrama_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `historial_id` int DEFAULT NULL,
  PRIMARY KEY (`odontodiagrama_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `odontodiagrama`
--

LOCK TABLES `odontodiagrama` WRITE;
/*!40000 ALTER TABLE `odontodiagrama` DISABLE KEYS */;
/*!40000 ALTER TABLE `odontodiagrama` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes_compra`
--

DROP TABLE IF EXISTS `ordenes_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes_compra` (
  `orden_compra_id` int NOT NULL AUTO_INCREMENT,
  `tipo_orden` varchar(255) DEFAULT NULL,
  `proveedor_id` int DEFAULT NULL,
  `fecha_orden` date DEFAULT NULL,
  `fecha_esperada` date DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `monto_total` double DEFAULT NULL,
  `moneda` varchar(255) DEFAULT NULL,
  `observaciones` text,
  `numero_orden` int DEFAULT NULL,
  `fecha_modificacion` date DEFAULT NULL,
  `recurso_id_1` int DEFAULT NULL,
  `precio_unitario_1` double DEFAULT NULL,
  `cantidad_1` double DEFAULT NULL,
  `unidad_medida_1` varchar(255) DEFAULT NULL,
  `recurso_id_2` int DEFAULT NULL,
  `precio_unitario_2` double DEFAULT NULL,
  `cantidad_2` double DEFAULT NULL,
  `unidad_medida_2` varchar(255) DEFAULT NULL,
  `recurso_id_3` int DEFAULT NULL,
  `precio_unitario_3` double DEFAULT NULL,
  `cantidad_3` double DEFAULT NULL,
  `unidad_medida_3` varchar(255) DEFAULT NULL,
  `recurso_id_4` int DEFAULT NULL,
  `precio_unitario_4` double DEFAULT NULL,
  `cantidad_4` double DEFAULT NULL,
  `unidad_medida_4` varchar(255) DEFAULT NULL,
  `recurso_id_5` int DEFAULT NULL,
  `precio_unitario_5` double DEFAULT NULL,
  `cantidad_5` double DEFAULT NULL,
  `unidad_medida_5` varchar(255) DEFAULT NULL,
  `forma_pago` varchar(255) NOT NULL,
  `fecha_pago` date DEFAULT NULL,
  `tipo_recurso1` text,
  `tipo_recurso2` text,
  `tipo_recurso3` text,
  `tipo_recurso4` text,
  `tipo_recurso5` text,
  PRIMARY KEY (`orden_compra_id`),
  KEY `ordenes_compra_ibfk_6` (`proveedor_id`),
  CONSTRAINT `ordenes_compra_ibfk_6` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`proveedor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes_compra`
--

LOCK TABLES `ordenes_compra` WRITE;
/*!40000 ALTER TABLE `ordenes_compra` DISABLE KEYS */;
INSERT INTO `ordenes_compra` VALUES (54,'Requisitoria',18,'2025-04-24','2025-05-05','2025-04-24','Completada',348,'$','N/A',43507780,'2025-04-24',12,100,3,'unidades',NULL,NULL,NULL,'',NULL,NULL,NULL,'',NULL,NULL,NULL,'',NULL,NULL,NULL,'','Contado','2025-04-24','Recurso de Requisición',NULL,NULL,NULL,NULL),(55,'Requisitoria',18,'2025-04-24','2025-05-05','2025-04-24','Completada',290,'$','Ninguna',98853173,'2025-04-24',12,50,5,'unidades',NULL,NULL,NULL,'',NULL,NULL,NULL,'',NULL,NULL,NULL,'',NULL,NULL,NULL,'','Contado','2025-04-24','Recurso de Requisición',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `ordenes_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ordenes_trabajo`
--

DROP TABLE IF EXISTS `ordenes_trabajo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ordenes_trabajo` (
  `orden_id` int NOT NULL AUTO_INCREMENT,
  `mantenimiento_id` int DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  `fecha_ejecucion` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `prioridad` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`orden_id`),
  KEY `empleado_id` (`empleado_id`),
  KEY `mantenimiento_id` (`mantenimiento_id`),
  CONSTRAINT `ordenes_trabajo_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`),
  CONSTRAINT `ordenes_trabajo_ibfk_2` FOREIGN KEY (`mantenimiento_id`) REFERENCES `mantenimiento_equipos` (`mantenimiento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ordenes_trabajo`
--

LOCK TABLES `ordenes_trabajo` WRITE;
/*!40000 ALTER TABLE `ordenes_trabajo` DISABLE KEYS */;
INSERT INTO `ordenes_trabajo` VALUES (1,1,18,'2025-04-30 00:00:00','2025-05-06 00:00:00','Media');
/*!40000 ALTER TABLE `ordenes_trabajo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `paciente_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `apellido` varchar(255) DEFAULT NULL,
  `genero` varchar(255) DEFAULT NULL,
  `cedula` varchar(255) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`paciente_id`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telefono` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES (1,'Juan Diego','Cordero','masculino','V31115188','2005-09-07','2, 4, 10, El Rincón','jdcorderor@gmail.com','04120426729'),(2,'Juanito','Alimaña','Masculino','26758911','1991-05-17','El Rincón','juanitoalimana123@gmail.com','04123261881');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagos_empleados`
--

DROP TABLE IF EXISTS `pagos_empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagos_empleados` (
  `pago_id` int NOT NULL AUTO_INCREMENT,
  `fecha_pago` date DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  `concepto` text,
  `monto` float NOT NULL,
  `moneda` varchar(255) DEFAULT '$',
  PRIMARY KEY (`pago_id`),
  UNIQUE KEY `pago_id` (`pago_id`),
  UNIQUE KEY `pago_id_2` (`pago_id`),
  UNIQUE KEY `pago_id_3` (`pago_id`),
  KEY `pagos_empleados_ibfk_1` (`empleado_id`),
  CONSTRAINT `pagos_empleados_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagos_empleados`
--

LOCK TABLES `pagos_empleados` WRITE;
/*!40000 ALTER TABLE `pagos_empleados` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagos_empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos`
--

DROP TABLE IF EXISTS `productos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos` (
  `Id_Producto` int NOT NULL AUTO_INCREMENT,
  `Id_modelo_productos` int NOT NULL,
  `Unidades` int DEFAULT NULL,
  `Fecha_Vencimiento` date NOT NULL,
  PRIMARY KEY (`Id_Producto`),
  KEY `Id_modelo_productos` (`Id_modelo_productos`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`Id_modelo_productos`) REFERENCES `modelos_productos` (`Id_Producto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos`
--

LOCK TABLES `productos` WRITE;
/*!40000 ALTER TABLE `productos` DISABLE KEYS */;
INSERT INTO `productos` VALUES (1,1,300,'2026-12-31'),(2,1,150,'2026-12-31'),(3,1,200,'2026-12-31'),(4,5,100,'2026-12-31'),(5,5,100,'2026-12-31'),(6,7,100,'2026-12-31'),(7,7,100,'2026-12-31'),(8,9,100,'2026-12-31');
/*!40000 ALTER TABLE `productos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productos_ubicacion`
--

DROP TABLE IF EXISTS `productos_ubicacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `productos_ubicacion` (
  `Unidades_Por_Ubicacion` int DEFAULT '0',
  `Id_Producto` int NOT NULL,
  `Id_Ubicacion` int NOT NULL,
  PRIMARY KEY (`Id_Producto`,`Id_Ubicacion`),
  KEY `Id_Ubicacion` (`Id_Ubicacion`),
  CONSTRAINT `productos_ubicacion_ibfk_1` FOREIGN KEY (`Id_Producto`) REFERENCES `productos` (`Id_Producto`),
  CONSTRAINT `productos_ubicacion_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productos_ubicacion`
--

LOCK TABLES `productos_ubicacion` WRITE;
/*!40000 ALTER TABLE `productos_ubicacion` DISABLE KEYS */;
INSERT INTO `productos_ubicacion` VALUES (51,1,1),(52,1,2),(53,1,3),(10,2,1),(20,2,2),(30,2,3),(51,4,1),(52,4,2),(53,4,3);
/*!40000 ALTER TABLE `productos_ubicacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedores`
--

DROP TABLE IF EXISTS `proveedores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedores` (
  `proveedor_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `ref_direccion` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `telefono` varchar(255) DEFAULT NULL,
  `rif` varchar(255) DEFAULT NULL,
  `estado` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`proveedor_id`),
  UNIQUE KEY `proveedor_id_3` (`proveedor_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telefono` (`telefono`),
  UNIQUE KEY `rif` (`rif`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedores`
--

LOCK TABLES `proveedores` WRITE;
/*!40000 ALTER TABLE `proveedores` DISABLE KEYS */;
INSERT INTO `proveedores` VALUES (18,'Proveedor 1','Carabobo, Naguanagua','Frente al Consulado','proveedor1@gmail.com','0241 - 7589431','J - 123456789','Activo');
/*!40000 ALTER TABLE `proveedores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `recurso_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `codigo_recurso` int DEFAULT NULL,
  PRIMARY KEY (`recurso_id`),
  UNIQUE KEY `recurso_id` (`recurso_id`),
  UNIQUE KEY `recurso_id_2` (`recurso_id`),
  UNIQUE KEY `recurso_id_3` (`recurso_id`),
  UNIQUE KEY `codigo_recurso` (`codigo_recurso`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (12,'Mesa','Mesa de madera',19200030);
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `repuestos`
--

DROP TABLE IF EXISTS `repuestos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repuestos` (
  `Id_Repuesto` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) NOT NULL,
  `Descripcion` text,
  `Numero_de_Pieza` varchar(100) DEFAULT NULL,
  `Unidades` int DEFAULT NULL,
  `Unidades_Minimas` int DEFAULT '0',
  `Unidades_Maximas` int DEFAULT NULL,
  `Id_Ubicacion` int NOT NULL,
  PRIMARY KEY (`Id_Repuesto`),
  KEY `Id_Ubicacion` (`Id_Ubicacion`),
  CONSTRAINT `repuestos_ibfk_1` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `repuestos`
--

LOCK TABLES `repuestos` WRITE;
/*!40000 ALTER TABLE `repuestos` DISABLE KEYS */;
INSERT INTO `repuestos` VALUES (1,'Motor centrífuga','Motor de repuesto para centrífuga','MCF-123',2,2,10,1);
/*!40000 ALTER TABLE `repuestos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requisitorias`
--

DROP TABLE IF EXISTS `requisitorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requisitorias` (
  `requisitoria_id` int NOT NULL AUTO_INCREMENT,
  `empleado_id` int DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `departamento` varchar(255) DEFAULT NULL,
  `descripcion` text,
  `fecha_emision` date DEFAULT NULL,
  `fecha_cierre` date DEFAULT NULL,
  `observaciones` text,
  `estado` varchar(255) DEFAULT NULL,
  `fecha_modificacion` date DEFAULT NULL,
  `recurso_id_1` int DEFAULT NULL,
  `recurso_codigo_1` varchar(255) DEFAULT NULL,
  `cantidad_1` double DEFAULT NULL,
  `unidad_medida_1` varchar(255) DEFAULT NULL,
  `recurso_id_2` int DEFAULT NULL,
  `recurso_codigo_2` varchar(255) DEFAULT NULL,
  `cantidad_2` double DEFAULT NULL,
  `unidad_medida_2` varchar(255) DEFAULT NULL,
  `recurso_id_3` int DEFAULT NULL,
  `recurso_codigo_3` varchar(255) DEFAULT NULL,
  `cantidad_3` double DEFAULT NULL,
  `unidad_medida_3` varchar(255) DEFAULT NULL,
  `recurso_id_4` int DEFAULT NULL,
  `recurso_codigo_4` varchar(255) DEFAULT NULL,
  `cantidad_4` double DEFAULT NULL,
  `unidad_medida_4` varchar(255) DEFAULT NULL,
  `recurso_id_5` int DEFAULT NULL,
  `recurso_codigo_5` varchar(255) DEFAULT NULL,
  `cantidad_5` double DEFAULT NULL,
  `unidad_medida_5` varchar(255) DEFAULT NULL,
  `fecha_requerida` date NOT NULL,
  PRIMARY KEY (`requisitoria_id`),
  UNIQUE KEY `requisitoria_id` (`requisitoria_id`),
  KEY `requisitorias_ibfk_2` (`empleado_id`),
  CONSTRAINT `requisitorias_ibfk_2` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requisitorias`
--

LOCK TABLES `requisitorias` WRITE;
/*!40000 ALTER TABLE `requisitorias` DISABLE KEYS */;
INSERT INTO `requisitorias` VALUES 
(41,22,'Requerimiento','Gestión de Personal','Requerimiento','2025-04-24','2025-04-24','N/A','Completada','2025-04-24',12,NULL,3,'unidades',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-05-06'),
(43,22,'Requerimiento','Gestión de Personal','Requerimiento','2025-04-24','2025-04-24',NULL,'Completada','2025-04-24',12,NULL,5,'unidades',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-05-07');
/*!40000 ALTER TABLE `requisitorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (7,'Médico','Médico general'),(8,'Odontólogo','Especialista en dientes');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sectores`
--

DROP TABLE IF EXISTS `sectores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sectores` (
  `sector_id` int NOT NULL AUTO_INCREMENT,
  `odontodiagrama_id` int DEFAULT NULL,
  `nombre_sector` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sectores`
--

LOCK TABLES `sectores` WRITE;
/*!40000 ALTER TABLE `sectores` DISABLE KEYS */;
/*!40000 ALTER TABLE `sectores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `segmentos`
--

DROP TABLE IF EXISTS `segmentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `segmentos` (
  `segmento_id` int NOT NULL AUTO_INCREMENT,
  `diente_id` int DEFAULT NULL,
  `numero_segmento` int DEFAULT NULL,
  `valor_afectacion` int DEFAULT NULL,
  PRIMARY KEY (`segmento_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `segmentos`
--

LOCK TABLES `segmentos` WRITE;
/*!40000 ALTER TABLE `segmentos` DISABLE KEYS */;
/*!40000 ALTER TABLE `segmentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `signos_vitales`
--

DROP TABLE IF EXISTS `signos_vitales`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `signos_vitales` (
  `signos_vitales_id` int NOT NULL AUTO_INCREMENT,
  `frecuencia_cardiaca` varchar(255) DEFAULT NULL,
  `presion_arterial` varchar(255) DEFAULT NULL,
  `frecuencia_respiratoria` varchar(255) DEFAULT NULL,
  `temperatura_corporal` varchar(255) DEFAULT NULL,
  `saturacion_oxigeno` varchar(255) DEFAULT NULL,
  `balance_hidrico` varchar(255) DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `hospitalizacion_id` int DEFAULT NULL,
  PRIMARY KEY (`signos_vitales_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `signos_vitales`
--

LOCK TABLES `signos_vitales` WRITE;
/*!40000 ALTER TABLE `signos_vitales` DISABLE KEYS */;
/*!40000 ALTER TABLE `signos_vitales` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_lab_medicas`
--

DROP TABLE IF EXISTS `solicitudes_lab_medicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_lab_medicas` (
  `solicitud_id` int NOT NULL,
  `consulta_id` int DEFAULT NULL,
  PRIMARY KEY (`solicitud_id`),
  KEY `consulta_id` (`consulta_id`),
  CONSTRAINT `solicitudes_lab_medicas_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_laboratorio` (`solicitud_id`),
  CONSTRAINT `solicitudes_lab_medicas_ibfk_2` FOREIGN KEY (`consulta_id`) REFERENCES `consultas_medicas` (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_lab_medicas`
--

LOCK TABLES `solicitudes_lab_medicas` WRITE;
/*!40000 ALTER TABLE `solicitudes_lab_medicas` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_lab_medicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_lab_odontologicas`
--

DROP TABLE IF EXISTS `solicitudes_lab_odontologicas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_lab_odontologicas` (
  `solicitud_id` int NOT NULL,
  `consulta_id` int DEFAULT NULL,
  PRIMARY KEY (`solicitud_id`),
  KEY `consulta_id` (`consulta_id`),
  CONSTRAINT `solicitudes_lab_odontologicas_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_laboratorio` (`solicitud_id`),
  CONSTRAINT `solicitudes_lab_odontologicas_ibfk_2` FOREIGN KEY (`consulta_id`) REFERENCES `consultas_odontologicas` (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_lab_odontologicas`
--

LOCK TABLES `solicitudes_lab_odontologicas` WRITE;
/*!40000 ALTER TABLE `solicitudes_lab_odontologicas` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_lab_odontologicas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `solicitudes_laboratorio`
--

DROP TABLE IF EXISTS `solicitudes_laboratorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `solicitudes_laboratorio` (
  `solicitud_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `medico_id` int DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `fecha` date DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`solicitud_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `solicitudes_laboratorio`
--

LOCK TABLES `solicitudes_laboratorio` WRITE;
/*!40000 ALTER TABLE `solicitudes_laboratorio` DISABLE KEYS */;
/*!40000 ALTER TABLE `solicitudes_laboratorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_prueba`
--

DROP TABLE IF EXISTS `tipo_prueba`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_prueba` (
  `tipo_id` int NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipo_id`),
  UNIQUE KEY `tipo_id` (`tipo_id`),
  UNIQUE KEY `tipo_id_2` (`tipo_id`),
  UNIQUE KEY `tipo_id_3` (`tipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_prueba`
--

LOCK TABLES `tipo_prueba` WRITE;
/*!40000 ALTER TABLE `tipo_prueba` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_prueba` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_citas`
--

DROP TABLE IF EXISTS `tipos_citas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_citas` (
  `tipo_cita_id` int NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`tipo_cita_id`),
  UNIQUE KEY `tipo_cita_id` (`tipo_cita_id`),
  UNIQUE KEY `tipo_cita_id_2` (`tipo_cita_id`),
  UNIQUE KEY `tipo_cita_id_3` (`tipo_cita_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_citas`
--

LOCK TABLES `tipos_citas` WRITE;
/*!40000 ALTER TABLE `tipos_citas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipos_citas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) DEFAULT NULL,
  `clave` varchar(255) DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  `modulos` text NOT NULL,
  PRIMARY KEY (`usuario_id`),
  KEY `usuarios_ibfk_1` (`empleado_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'administrador','greysloanmemorial',NULL,'1,2,3,4,5,6,7,8,9,10'),(6,'pedroperez','drpedroperez',18,'1,9,10'),(7,'manuellopez','drmanuellopez',22,'1,9,10'),(8,'luisleon','odluisleon',23,'1,6,9,10');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-25  0:42:59






