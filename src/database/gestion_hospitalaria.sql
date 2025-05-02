/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

CREATE DATABASE IF NOT EXISTS `sistema_gestion_hospitalaria` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sistema_gestion_hospitalaria`;

CREATE TABLE IF NOT EXISTS `almacenes_ubicaciones` (
  `Id_Ubicacion` int NOT NULL AUTO_INCREMENT,
  `Area` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Ubicacion` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`Id_Ubicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `camas` (
  `cama_id` int NOT NULL AUTO_INCREMENT,
  `habitacion_id` int DEFAULT NULL,
  `estado` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`cama_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `citas` (
  `cita_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_cita` datetime DEFAULT NULL,
  `nueva_fecha` datetime DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tipo_cita_id` int DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`cita_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `consultas_medicas` (
  `consulta_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `medico_id` int DEFAULT NULL,
  `fecha_consulta` datetime DEFAULT NULL,
  `historial_id` int DEFAULT NULL,
  PRIMARY KEY (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `consultas_odontologicas` (
  `consulta_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `odontologo_id` int DEFAULT NULL,
  `fecha_consulta` datetime DEFAULT NULL,
  `historial_id` int DEFAULT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `departamentos` (
  `departamento_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`departamento_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `dientes` (
  `diente_id` int NOT NULL AUTO_INCREMENT,
  `sector_id` int DEFAULT NULL,
  `numero_diente` int DEFAULT NULL,
  PRIMARY KEY (`diente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `empleados` (
  `empleado_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cedula` int DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `fecha_contratacion` date DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rol_id` int DEFAULT NULL,
  `cargo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `departamento_id` int DEFAULT NULL,
  `sueldo` int DEFAULT NULL,
  `estado` text COLLATE utf8mb4_general_ci NOT NULL,
  `area` varchar(250) COLLATE utf8mb4_general_ci NOT NULL,
  `descripcion_empleado` text COLLATE utf8mb4_general_ci,
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

CREATE TABLE IF NOT EXISTS `equipos` (
  `Id_Equipo` int NOT NULL AUTO_INCREMENT,
  `Fecha_Instalacion` date DEFAULT NULL,
  `Estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Frecuencia_mantenimiento` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Numero_de_serie` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Id_Modelo` int NOT NULL,
  `Id_Ubicacion` int NOT NULL,
  PRIMARY KEY (`Id_Equipo`),
  KEY `Id_Modelo` (`Id_Modelo`),
  KEY `Id_Ubicacion` (`Id_Ubicacion`),
  CONSTRAINT `equipos_ibfk_1` FOREIGN KEY (`Id_Modelo`) REFERENCES `modelos_equipos` (`Id_Modelo`) ON DELETE CASCADE,
  CONSTRAINT `equipos_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `examenes_laboratorio` (
  `examen_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `tipo_examen` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  `resultados` text COLLATE utf8mb4_general_ci,
  `observaciones` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`examen_id`),
  KEY `fk_paciente_id` (`paciente_id`),
  CONSTRAINT `fk_paciente_id` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`paciente_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `pruebas_laboratorio` (
  `prueba_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `categoria` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`prueba_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `examenes_hospitalizacion` (
  `hospitalizacion_id` int DEFAULT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cedula` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `titulo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `parametros` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  KEY `hospitalizacion_id` (`hospitalizacion_id`),
  CONSTRAINT `examenes_hospitalizacion_ibfk_1` FOREIGN KEY (`hospitalizacion_id`) REFERENCES `hospitalizaciones` (`hospitalizacion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `habitaciones` (
  `habitacion_id` int NOT NULL AUTO_INCREMENT,
  `ubicacion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`habitacion_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `historial_medico` (
  `id` bigint(20) NOT NULL,
  `consulta_id` int NOT NULL,
  `id_paciente` bigint(20) NOT NULL,
  `fecha_registro` datetime NOT NULL DEFAULT current_timestamp(),
  `diagnostico` text NOT NULL,
  `tratamiento` text NOT NULL,
  `observaciones` text NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `consulta_id` (`consulta_id`),
  FOREIGN KEY (`consulta_id`) REFERENCES `consultas_medicas` (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `historiales_odontologicos` (
  `historial_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `fecha` datetime DEFAULT NULL,
  PRIMARY KEY (`historial_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `horarios` (
  `horario_id` int NOT NULL AUTO_INCREMENT,
  `turno` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dia` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  PRIMARY KEY (`horario_id`),
  KEY `horarios_ibfk_1` (`empleado_id`),
  CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `hospitalizaciones` (
  `hospitalizacion_id` int NOT NULL AUTO_INCREMENT,
  `motivo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_ingreso` datetime DEFAULT NULL,
  `fecha_egreso` datetime DEFAULT NULL,
  `paciente_id` int DEFAULT NULL,
  `diagnostico` text COLLATE utf8mb4_general_ci,
  `notas_medicas` text COLLATE utf8mb4_general_ci,
  `medicamentos` text COLLATE utf8mb4_general_ci,
  `dieta` text COLLATE utf8mb4_general_ci,
  `habitacion_id` int DEFAULT NULL,
  `cama_id` int DEFAULT NULL,
  PRIMARY KEY (`hospitalizacion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `ingresos` (
    `id_ingreso` INT PRIMARY KEY AUTO_INCREMENT,
    `fecha_ingreso` DATE NOT NULL,
    `tipo_ingreso` VARCHAR(50) NOT NULL,
    `monto` DECIMAL(15, 2),
    `descripcion` TEXT,
    `fuente` VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS `egresos` (
    `id_egreso` INT PRIMARY KEY AUTO_INCREMENT,
    `fecha_egreso` DATE NOT NULL,
    `tipo_egreso` VARCHAR(50) NOT NULL,
    `monto` DECIMAL(15, 2) NOT NULL,
    `descripcion` TEXT,
    `id_orden_compra` INT,
    `id_nomina` INT,
    FOREIGN KEY (`id_orden_compra`) REFERENCES `ordenescompra`(`id_orden_compra`),
    FOREIGN KEY (`id_nomina`) REFERENCES `nominas`(`id_nomina`)
);

CREATE TABLE IF NOT EXISTS `ordenescompra` (
    `id_orden_compra` INT PRIMARY KEY AUTO_INCREMENT,
    `fecha_orden` DATE NOT NULL,
    `proveedor` VARCHAR(100) NOT NULL,
    `monto_total` DECIMAL(15, 2) NOT NULL,
    `estado` VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS nominas (
  `id_nomina` int NOT NULL AUTO_INCREMENT,
  `salario_base` float DEFAULT NULL,
  `salario_neto` float DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  `numero_cuenta` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_nomina`),
  UNIQUE KEY `numero_cuenta` (`numero_cuenta`),
  KEY `nominas_ibfk_1` (`empleado_id`)
);

CREATE TABLE IF NOT EXISTS `instrumentos` (
    `Id_Instrumento` INT NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(100) COLLATE utf8mb4_general_ci NOT NULL,
    `Descripcion` TEXT COLLATE utf8mb4_general_ci,
    `Tipo_Instrumento` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    `Unidades` INT DEFAULT '0',
    `Unidades_Minimas` INT DEFAULT '0',
    `Unidades_Maximas` INT DEFAULT NULL,
    `Codigo` VARCHAR(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
    PRIMARY KEY (`Id_Instrumento`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `instrumentos_ubicacion` (
  `Unidades_Por_Ubicacion` int DEFAULT '0',
  `Id_Instrumento` int NOT NULL,
  `Id_Ubicacion` int NOT NULL,
  PRIMARY KEY (`Id_Instrumento`,`Id_Ubicacion`),
  KEY `Id_Ubicacion` (`Id_Ubicacion`),
  CONSTRAINT `instrumentos_ubicacion_ibfk_1` FOREIGN KEY (`Id_Instrumento`) REFERENCES `instrumentos` (`Id_Instrumento`),
  CONSTRAINT `instrumentos_ubicacion_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `lista_espera_hospitalizacion` (
  `paciente_id` int DEFAULT NULL,
  `motivo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `nombre` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  KEY `paciente_id` (`paciente_id`),
  CONSTRAINT `lista_espera_hospitalizacion_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`paciente_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `mantenimiento_equipos` (
  `mantenimiento_id` int NOT NULL AUTO_INCREMENT,
  `tipomantenimiento` varchar(50) DEFAULT NULL,
  `equipo_id` int DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `repuesto_id` int DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`mantenimiento_id`),
  KEY `equipo_id` (`equipo_id`),
  KEY `repuesto_id` (`repuesto_id`),
  CONSTRAINT `mantenimiento_equipos_ibfk_1` FOREIGN KEY (`equipo_id`) REFERENCES `equipos` (`Id_Equipo`),
  CONSTRAINT `mantenimiento_equipos_ibfk_2` FOREIGN KEY (`repuesto_id`) REFERENCES `repuestos` (`Id_Repuesto`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `modelos_equipos` (
  `Id_Modelo` int NOT NULL AUTO_INCREMENT,
  `Modelo` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Descripcion` text COLLATE utf8mb4_general_ci,
  `Codigo` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Marca` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Unidades` int DEFAULT NULL,
  PRIMARY KEY (`Id_Modelo`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `modelos_productos` (
  `Id_Producto` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Descripcion` text COLLATE utf8mb4_general_ci,
  `Codigo` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Tipo_Producto` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Tipo_Unidad` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Unidades_Maximas` int DEFAULT NULL,
  `Unidades_Minimas` int DEFAULT '0',
  PRIMARY KEY (`Id_Producto`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `odontodiagrama` (
  `odontodiagrama_id` int NOT NULL AUTO_INCREMENT,
  `paciente_id` int DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  `historial_id` int DEFAULT NULL,
  PRIMARY KEY (`odontodiagrama_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `ordenes_trabajo` (
  `orden_id` int NOT NULL AUTO_INCREMENT,
  `mantenimiento_id` int DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  `fecha_ejecucion` datetime DEFAULT NULL,
  `fecha_fin` datetime DEFAULT NULL,
  `prioridad` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`orden_id`),
  KEY `empleado_id` (`empleado_id`),
  KEY `mantenimiento_id` (`mantenimiento_id`),
  CONSTRAINT `ordenes_trabajo_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`),
  CONSTRAINT `ordenes_trabajo_ibfk_2` FOREIGN KEY (`mantenimiento_id`) REFERENCES `mantenimiento_equipos` (`mantenimiento_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `pacientes` (
  `paciente_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `apellido` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `genero` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cedula` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`paciente_id`),
  UNIQUE KEY `cedula` (`cedula`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telefono` (`telefono`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `pagos_empleados` (
  `pago_id` int NOT NULL AUTO_INCREMENT,
  `fecha_pago` date DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  `concepto` text COLLATE utf8mb4_general_ci,
  `monto` float NOT NULL,
  `moneda` varchar(255) COLLATE utf8mb4_general_ci DEFAULT '$',
  PRIMARY KEY (`pago_id`),
  UNIQUE KEY `pago_id` (`pago_id`),
  UNIQUE KEY `pago_id_2` (`pago_id`),
  UNIQUE KEY `pago_id_3` (`pago_id`),
  KEY `pagos_empleados_ibfk_1` (`empleado_id`),
  CONSTRAINT `pagos_empleados_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `productos` (
  `Id_Producto` int NOT NULL AUTO_INCREMENT,
  `Id_modelo_productos` int NOT NULL,
  `Unidades` int DEFAULT NULL,
  `Fecha_Vencimiento` date NOT NULL,
  PRIMARY KEY (`Id_Producto`),
  KEY `Id_modelo_productos` (`Id_modelo_productos`),
  CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`Id_modelo_productos`) REFERENCES `modelos_productos` (`Id_Producto`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `productos_ubicacion` (
  `Unidades_Por_Ubicacion` int DEFAULT '0',
  `Id_Producto` int NOT NULL,
  `Id_Ubicacion` int NOT NULL,
  PRIMARY KEY (`Id_Producto`,`Id_Ubicacion`),
  KEY `Id_Ubicacion` (`Id_Ubicacion`),
  CONSTRAINT `productos_ubicacion_ibfk_1` FOREIGN KEY (`Id_Producto`) REFERENCES `productos` (`Id_Producto`),
  CONSTRAINT `productos_ubicacion_ibfk_2` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `proveedores` (
  `proveedor_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ref_direccion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `telefono` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rif` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estado` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`proveedor_id`),
  UNIQUE KEY `proveedor_id_3` (`proveedor_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `telefono` (`telefono`),
  UNIQUE KEY `rif` (`rif`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `recursos` (
  `recurso_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `codigo_recurso` int DEFAULT NULL,
  PRIMARY KEY (`recurso_id`),
  UNIQUE KEY `recurso_id` (`recurso_id`),
  UNIQUE KEY `recurso_id_2` (`recurso_id`),
  UNIQUE KEY `recurso_id_3` (`recurso_id`),
  UNIQUE KEY `codigo_recurso` (`codigo_recurso`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `repuestos` (
  `Id_Repuesto` int NOT NULL AUTO_INCREMENT,
  `Nombre` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Descripcion` text COLLATE utf8mb4_general_ci,
  `Numero_de_Pieza` varchar(100) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `Unidades` int DEFAULT NULL,
  `Unidades_Minimas` int DEFAULT '0',
  `Unidades_Maximas` int DEFAULT NULL,
  `Id_Ubicacion` int NOT NULL,
  PRIMARY KEY (`Id_Repuesto`),
  KEY `Id_Ubicacion` (`Id_Ubicacion`),
  CONSTRAINT `repuestos_ibfk_1` FOREIGN KEY (`Id_Ubicacion`) REFERENCES `almacenes_ubicaciones` (`Id_Ubicacion`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `requisitorias` (
  `requisitoria_id` int NOT NULL AUTO_INCREMENT,
  `empleado_id` int DEFAULT NULL,
  `motivo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `departamento` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` text COLLATE utf8mb4_general_ci,
  `fecha_emision` date DEFAULT NULL,
  `fecha_cierre` date DEFAULT NULL,
  `observaciones` text COLLATE utf8mb4_general_ci,
  `estado` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_modificacion` date DEFAULT NULL,
  `recurso_id_1` int DEFAULT NULL,
  `recurso_codigo_1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cantidad_1` double DEFAULT NULL,
  `unidad_medida_1` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `recurso_id_2` int DEFAULT NULL,
  `recurso_codigo_2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cantidad_2` double DEFAULT NULL,
  `unidad_medida_2` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `recurso_id_3` int DEFAULT NULL,
  `recurso_codigo_3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cantidad_3` double DEFAULT NULL,
  `unidad_medida_3` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `recurso_id_4` int DEFAULT NULL,
  `recurso_codigo_4` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cantidad_4` double DEFAULT NULL,
  `unidad_medida_4` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `recurso_id_5` int DEFAULT NULL,
  `recurso_codigo_5` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cantidad_5` double DEFAULT NULL,
  `unidad_medida_5` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha_requerida` date NOT NULL,
  PRIMARY KEY (`requisitoria_id`),
  UNIQUE KEY `requisitoria_id` (`requisitoria_id`),
  KEY `requisitorias_ibfk_2` (`empleado_id`),
  CONSTRAINT `requisitorias_ibfk_2` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `roles` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `sectores` (
  `sector_id` int NOT NULL AUTO_INCREMENT,
  `odontodiagrama_id` int DEFAULT NULL,
  `nombre_sector` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`sector_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `segmentos` (
  `segmento_id` int NOT NULL AUTO_INCREMENT,
  `diente_id` int DEFAULT NULL,
  `numero_segmento` int DEFAULT NULL,
  `valor_afectacion` int DEFAULT NULL,
  PRIMARY KEY (`segmento_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `signos_vitales` (
  `signos_vitales_id` int NOT NULL AUTO_INCREMENT,
  `frecuencia_cardiaca` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `presion_arterial` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `frecuencia_respiratoria` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `temperatura_corporal` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `saturacion_oxigeno` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `balance_hidrico` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fecha` datetime DEFAULT NULL,
  `hospitalizacion_id` int DEFAULT NULL,
  PRIMARY KEY (`signos_vitales_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `tipo_prueba` (
  `tipo_id` int NOT NULL,
  `categoria_id` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `codigo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `descripcion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `preparacion` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `precio` double DEFAULT NULL,
  `activo` int DEFAULT NULL,
  `fecha_creacion` date DEFAULT NULL,
  PRIMARY KEY (`tipo_id`),
  UNIQUE KEY `tipo_id` (`tipo_id`),
  UNIQUE KEY `tipo_id_2` (`tipo_id`),
  UNIQUE KEY `tipo_id_3` (`tipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `solicitudes_laboratorio` (
  `solicitud_id`    INT NOT NULL AUTO_INCREMENT,
  `paciente_id`     INT DEFAULT NULL,
  `medico_id`       INT DEFAULT NULL,
  `motivo`          VARCHAR(255) DEFAULT NULL,
  `estado`          VARCHAR(255) DEFAULT NULL,
  `fecha_solicitud` DATE DEFAULT NULL,
  `fecha_resultados` DATE DEFAULT NULL,
  `ayuno`           VARCHAR(255) DEFAULT NULL,
  `observacion`     VARCHAR(255) DEFAULT NULL,
  `tipo_id`         INT NOT NULL,
  PRIMARY KEY (`solicitud_id`,`tipo_id`),
  UNIQUE KEY `unq_solicitud_id` (`solicitud_id`),    -- ← add this
  KEY       `idx_tipo_id`       (`tipo_id`),
  CONSTRAINT `solicitudes_laboratorio_ibfk_1`
    FOREIGN KEY (`tipo_id`)
    REFERENCES `tipo_prueba`(`tipo_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `resultados_laboratorio` (
  `resultado_id` int NOT NULL AUTO_INCREMENT,
  `solicitud_id` int DEFAULT NULL,
  `parametro` VARCHAR(255) DEFAULT NULL,
  `rango_referencial` VARCHAR(255) DEFAULT NULL,
  `unidad` VARCHAR(255) DEFAULT NULL,
  `valor` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`resultado_id`),
  KEY `solicitud_id` (`solicitud_id`),
  CONSTRAINT `resultados_laboratorio_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_laboratorio` (`solicitud_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `solicitudes_lab_medicas` (
  `solicitud_id` int NOT NULL,
  `consulta_id` int DEFAULT NULL,
  PRIMARY KEY (`solicitud_id`),
  KEY `consulta_id` (`consulta_id`),
  CONSTRAINT `solicitudes_lab_medicas_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_laboratorio` (`solicitud_id`),
  CONSTRAINT `solicitudes_lab_medicas_ibfk_2` FOREIGN KEY (`consulta_id`) REFERENCES `consultas_medicas` (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `solicitudes_lab_odontologicas` (
  `solicitud_id` int NOT NULL,
  `consulta_id` int DEFAULT NULL,
  PRIMARY KEY (`solicitud_id`),
  KEY `consulta_id` (`consulta_id`),
  CONSTRAINT `solicitudes_lab_odontologicas_ibfk_1` FOREIGN KEY (`solicitud_id`) REFERENCES `solicitudes_laboratorio` (`solicitud_id`),
  CONSTRAINT `solicitudes_lab_odontologicas_ibfk_2` FOREIGN KEY (`consulta_id`) REFERENCES `consultas_odontologicas` (`consulta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `tipos_citas` (
  `tipo_cita_id` int NOT NULL,
  `nombre` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`tipo_cita_id`),
  UNIQUE KEY `tipo_cita_id` (`tipo_cita_id`),
  UNIQUE KEY `tipo_cita_id_2` (`tipo_cita_id`),
  UNIQUE KEY `tipo_cita_id_3` (`tipo_cita_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `usuarios` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `usuario` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `clave` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `empleado_id` int DEFAULT NULL,
  `modulos` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`usuario_id`),
  KEY `usuarios_ibfk_1` (`empleado_id`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`empleado_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
CREATE TABLE IF NOT EXISTS citas_medicas_solicitudes (
  consulta_id  INTEGER NOT NULL,
  cita_id  INTEGER NOT NULL,
  PRIMARY KEY (consulta_id, cita_id),
  FOREIGN KEY (consulta_id)  REFERENCES consultas_medicas   (consulta_id),
  FOREIGN KEY (cita_id) REFERENCES citas (cita_id)
);
CREATE TABLE IF NOT EXISTS citas_consultas_odontologicas (
  consulta_id   INTEGER NOT NULL,
  cita_id  INTEGER NOT NULL,
  PRIMARY KEY (consulta_id, cita_id),
  FOREIGN KEY (consulta_id)  REFERENCES consultas_odontologicas (consulta_id),
  FOREIGN KEY (cita_id) REFERENCES citas  (cita_id)
);

CREATE TABLE IF NOT EXISTS examenes_laboratorio (
  examen_id int NOT NULL AUTO_INCREMENT,
  paciente_id int NOT NULL,
  fecha datetime DEFAULT NULL,
  tipo_examen varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  estado varchar(50) COLLATE utf8mb4_general_ci DEFAULT 'Pendiente',
  resultados text COLLATE utf8mb4_general_ci,
  observaciones text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (examen_id),
  KEY fk_paciente_id (paciente_id),
  CONSTRAINT fk_paciente_id FOREIGN KEY (paciente_id) REFERENCES pacientes (paciente_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS pruebas_laboratorio (
  prueba_id int NOT NULL AUTO_INCREMENT,
  nombre varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  categoria varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  fecha datetime DEFAULT NULL,
  descripcion text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (prueba_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS consumos_consultas_medicas (
  consulta_id   INT        NOT NULL,
  Id_Producto   INT        NOT NULL,
  consumidos    INT        NULL,
  fecha_consumo DATE       NULL,
  PRIMARY KEY (consulta_id, Id_Producto),
  CONSTRAINT fk_ccm_consulta
    FOREIGN KEY (consulta_id)
    REFERENCES consultas_medicas (consulta_id),
  CONSTRAINT fk_ccm_producto
    FOREIGN KEY (Id_Producto)
    REFERENCES productos (Id_Producto)
) ENGINE=InnoDB
  DEFAULT CHARSET = utf8mb4
  COLLATE = utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS consumos_consultas_odontologicas (
  consulta_id   INT        NOT NULL,
  Id_Producto   INT        NOT NULL,
  consumidos    INT        NULL,
  fecha_consumo DATE       NULL,
  PRIMARY KEY (consulta_id, Id_Producto),
  FOREIGN KEY (consulta_id)  REFERENCES consultas_odontologicas (consulta_id),
  FOREIGN KEY (Id_Producto) REFERENCES  productos (Id_Producto)
);
/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
