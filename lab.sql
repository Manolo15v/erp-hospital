/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- 1. Crear estructura para solicitudes de laboratorio

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
  `modulo_solicitante` VARCHAR(50) NOT NULL AFTER `medico_id`; --Módulo para botón de solicitudes
  `tipo_id`         INT NOT NULL,
  PRIMARY KEY (`solicitud_id`,`tipo_id`),
  UNIQUE KEY `unq_solicitud_id` (`solicitud_id`),   
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

-- 2. Registro de nueva solicitud desde módulo específico

INSERT INTO `solicitudes_laboratorio` (
  `paciente_id`,
  `medico_id`,
  `modulo_solicitante`,
  `motivo`,
  `estado`,
  `fecha_solicitud`,
  `tipo_id`
) VALUES (
  1,
  1,
  'urgencias',  -- Módulo que realiza la solicitud
  'Dolor torácico agudo',
  'pendiente',
  CURDATE(),
  1
);

-- 3. Actualización de estado desde laboratorio
UPDATE `solicitudes_laboratorio` 
SET 
  `estado` = 'completado',
  `fecha_resultados` = NOW(),
  `observacion` = 'Resultados validados'
WHERE `solicitud_id` = 1;

-- 4. Consulta de solicitudes por módulo
SELECT 
  sl.`solicitud_id`,
  p.`nombre` AS paciente,
  p.`apellido`,
  sl.`modulo_solicitante`,
  tp.`nombre` AS prueba,
  sl.`fecha_solicitud`,
  sl.`estado`
FROM `solicitudes_laboratorio` sl
INNER JOIN `pacientes` p ON sl.`paciente_id` = p.`paciente_id`
INNER JOIN `tipo_prueba` tp ON sl.`tipo_id` = tp.`tipo_id`
WHERE sl.`modulo_solicitante` = 'urgencias';

-- 5. Vista consolidada con módulo solicitante
CREATE OR REPLACE VIEW `vista_examenes_modulos` AS
SELECT 
  sl.`solicitud_id`,
  sl.`modulo_solicitante`,
  p.`nombre` AS paciente,
  p.`cedula`,
  tp.`nombre` AS prueba,
  sl.`fecha_solicitud`,
  sl.`fecha_resultados`,
  rl.`parametro`,
  rl.`valor`,
  rl.`rango_referencial`,
  sl.`estado`
FROM `solicitudes_laboratorio` sl
LEFT JOIN `resultados_laboratorio` rl ON sl.`solicitud_id` = rl.`solicitud_id`
INNER JOIN `pacientes` p ON sl.`paciente_id` = p.`paciente_id`
INNER JOIN `tipo_prueba` tp ON sl.`tipo_id` = tp.`tipo_id`;

-- 6. Historial filtrado por módulo
SELECT * FROM `vista_examenes_modulos`
WHERE `modulo_solicitante` = 'cardiologia'
  AND `estado` = 'completado';

-- 7. Registro de resultados de laboratorio
INSERT INTO `resultados_laboratorio` (
  `solicitud_id`,
  `parametro`,
  `rango_referencial`,
  `unidad`,
  `valor`
) VALUES
(1, 'Glucosa', '70-100 mg/dL', 'mg/dL', '85'),
(1, 'Colesterol LDL', '<100 mg/dL', 'mg/dL', '92');

-- 8. Eliminación de solicitud (con validación de módulo)
DELETE FROM `solicitudes_laboratorio`
WHERE `solicitud_id` = 1
  AND `modulo_solicitante` = 'urgencias';

-- 9. Estadísticas por módulo
SELECT 
  `modulo_solicitante`,
  COUNT(*) AS total_solicitudes,
  SUM(`estado` = 'pendiente') AS pendientes,
  SUM(`estado` = 'completado') AS completados,
  SUM(`estado` = 'cancelado') AS cancelados
FROM `solicitudes_laboratorio`
GROUP BY `modulo_solicitante`;

-- 10. Actualización desde módulo origen
UPDATE `solicitudes_laboratorio` 
SET 
  `motivo` = 'Nuevo síntoma detectado',
  `observacion` = 'Actualización desde urgencias'
WHERE `solicitud_id` = 1
  AND `modulo_solicitante` = 'urgencias';

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;