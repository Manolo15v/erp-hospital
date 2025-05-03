import { pool } from "../config/db.js";
import multer from "multer";
import path from "path";

// Obtener todas las consultas
async function getConsultas(req, res) {
    try {
        const [consultas] = await pool.query(`
            SELECT 
                cm.consulta_id as id,
                cm.fecha_consulta,
                CONCAT(p.nombre, ' ', p.apellido) as nombre,
                p.paciente_id,
                CONCAT(e.nombre, ' ', e.apellido) as medico,
                c.cita_id,
                c.estado,
                c.fecha_cita,
                hm.id as id_historial,
                CASE 
                    WHEN hm.id IS NOT NULL THEN 'completado'
                    ELSE 'pendiente'
                END as estado
            FROM consultas_medicas cm
            LEFT JOIN historial_medico hm ON cm.consulta_id = hm.consulta_id
            LEFT JOIN citas_medicas_solicitudes cms ON cm.consulta_id = cms.consulta_id
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            JOIN pacientes p ON cm.paciente_id = p.paciente_id
            JOIN empleados e ON cm.medico_id = e.empleado_id
            ORDER BY cm.fecha_consulta DESC
        `);

        console.log('Consultas obtenidas:', consultas); // Para debug
        res.json( {data:consultas});
    } catch (error) {
        console.error('Error en getConsultas:', error);
        res.status(500).json({ 
            error: 'Error al obtener consultas',
            details: error.message 
        });
    }
}

// Crear una nueva consulta
async function createConsulta(req, res) {
    try {
        const { paciente_id, medico_id, fecha_consulta, historial_id } = req.body;
        
        if (!paciente_id || !medico_id || !fecha_consulta) {
            return res.status(400).json({ error: "Faltan campos requeridos" });
        }

        const [consultaResult] = await pool.query(
            `INSERT INTO consultas_medicas 
             (paciente_id, medico_id, fecha_consulta, historial_id) 
             VALUES (?, ?, ?, ?)`,
            [paciente_id, medico_id, fecha_consulta, historial_id || null]
        );
        
        res.status(201).json({ 
            consulta_id: consultaResult.insertId,
            message: "Consulta creada exitosamente"
        });
    } catch (error) {
        console.error('Error en createConsulta:', error);
        res.status(500).json({ 
            error: "Error al crear la consulta",
            details: error.message 
        });
    }
}
// Obtener consultas completadas
async function getConsultasCompletada(req, res) {
    try {
        const [consultas] = await pool.query(`
            SELECT 
                cm.consulta_id,
                cm.fecha_consulta,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido,
                p.paciente_id,
                c.cita_id,
                c.estado,
                c.fecha_cita,
                hm.id AS historial_id,
                hm.img AS historia_pdf
            FROM consultas_medicas cm
            JOIN historial_medico hm ON cm.consulta_id = hm.consulta_id
            LEFT JOIN citas_medicas_solicitudes cms ON cm.consulta_id = cms.consulta_id
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            JOIN pacientes p ON cm.paciente_id = p.paciente_id
            WHERE c.estado = 'completado'
            ORDER BY cm.fecha_consulta DESC
        `);

        res.json({ data: consultas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener consultas pendientes
async function getConsultasPendiente(req, res) {
    try {
        const [consultas] = await pool.query(`
            SELECT 
                cm.consulta_id,
                cm.fecha_consulta,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido,
                p.paciente_id,
                c.cita_id,
                c.estado,
                c.fecha_cita
            FROM consultas_medicas cm
            LEFT JOIN citas_medicas_solicitudes cms ON cm.consulta_id = cms.consulta_id
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            JOIN pacientes p ON cm.paciente_id = p.paciente_id
            WHERE c.estado = 'pendiente' OR c.estado IS NULL
            ORDER BY cm.fecha_consulta DESC
        `);

        res.json({ data: consultas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Buscar consultas
async function searchConsultations(req, res) {
    try {
        const { searchTerm } = req.query;
        
        const [rows] = await pool.query(`
            SELECT 
                cm.consulta_id,
                cm.fecha_consulta,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido,
                p.paciente_id,
                c.cita_id,
                c.estado,
                c.fecha_cita,
                hm.id AS historial_id,
                hm.img AS historia_pdf
            FROM consultas_medicas cm
            LEFT JOIN historial_medico hm ON cm.consulta_id = hm.consulta_id
            LEFT JOIN citas_medicas_solicitudes cms ON cm.consulta_id = cms.consulta_id
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            JOIN pacientes p ON cm.paciente_id = p.paciente_id
            WHERE p.nombre LIKE ? OR p.apellido LIKE ? OR c.estado LIKE ? OR hm.id LIKE ?
            ORDER BY cm.fecha_consulta DESC
        `, [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`]);
        
        res.json({ data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Crear historia médica
async function createHistoria(req, res) {
    try {
        const { consulta_id, paciente_id, cita_id, diagnostico, tratamiento, observaciones } = req.body;
        const archivo = req.file ? `/uploads/${req.file.filename}` : null;
        
        const [historialResult] = await pool.query(
            "INSERT INTO historial_medico (consulta_id, id_paciente, diagnostico, tratamiento, observaciones, img) VALUES (?, ?, ?, ?, ?, ?)",
            [consulta_id, paciente_id, diagnostico, tratamiento, observaciones, archivo]
        );
        
        if (cita_id) {
            await pool.query(
                "UPDATE citas SET estado = 'completado' WHERE cita_id = ?",
                [cita_id]
            );
        }
        
        res.status(201).json({ 
            historial_id: historialResult.insertId,
            message: "Historial médico creado exitosamente"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener consulta por ID
async function getConsultaById(req, res) {
    try {
        const { id } = req.params;
        
        const [consulta] = await pool.query(`
            SELECT 
                cm.consulta_id,
                cm.fecha_consulta,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido,
                p.paciente_id,
                c.cita_id,
                c.estado,
                c.fecha_cita,
                hm.id AS historial_id,
                hm.diagnostico,
                hm.tratamiento,
                hm.observaciones,
                hm.img AS historia_pdf
            FROM consultas_medicas cm
            LEFT JOIN historial_medico hm ON cm.consulta_id = hm.consulta_id
            LEFT JOIN citas_medicas_solicitudes cms ON cm.consulta_id = cms.consulta_id
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            JOIN pacientes p ON cm.paciente_id = p.paciente_id
            WHERE cm.consulta_id = ?
        `, [id]);
        
        if (consulta.length === 0) {
            return res.status(404).json({ error: "Consulta no encontrada" });
        }
        
        res.json({ data: consulta[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Actualizar consulta
async function updateConsulta(req, res) {
    try {
        const { id } = req.params;
        const { fecha_consulta } = req.body;
        
        const [result] = await pool.query(
            "UPDATE consultas_medicas SET fecha_consulta = ? WHERE consulta_id = ?",
            [fecha_consulta, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Consulta no encontrada" });
        }
        
        res.json({ message: "Consulta actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Actualizar historia médica
async function updateHistoria(req, res) {
    try {
        const { id } = req.params;
        const { diagnostico, tratamiento, observaciones } = req.body;
        const archivo = req.file ? `/uploads/${req.file.filename}` : null;
        
        const [result] = await pool.query(
            `UPDATE historial_medico 
             SET diagnostico = IFNULL(?, diagnostico), 
                 tratamiento = IFNULL(?, tratamiento), 
                 observaciones = IFNULL(?, observaciones), 
                 img = IFNULL(?, img) 
             WHERE id = ?`,
            [diagnostico, tratamiento, observaciones, archivo, id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }
        
        res.json({ message: "Historial médico actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Eliminar consulta
async function deleteConsulta(req, res) {
    try {
        const { id } = req.params;
        
        // Verificar si tiene historial
        const [historial] = await pool.query(
            "SELECT 1 FROM historial_medico WHERE consulta_id = ?",
            [id]
        );
        
        if (historial.length > 0) {
            return res.status(400).json({ error: "No se puede eliminar una consulta con historial médico" });
        }
        
        // Eliminar relación cita-consulta si existe
        const [cita] = await pool.query(
            "SELECT cita_id FROM citas_medicas_solicitudes WHERE consulta_id = ?",
            [id]
        );
        
        if (cita.length > 0) {
            await pool.query(
                "UPDATE citas SET estado = 'pendiente' WHERE cita_id = ?",
                [cita[0].cita_id]
            );
            
            await pool.query(
                "DELETE FROM citas_medicas_solicitudes WHERE consulta_id = ?",
                [id]
            );
        }
        
        // Eliminar la consulta
        await pool.query(
            "DELETE FROM consultas_medicas WHERE consulta_id = ?",
            [id]
        );
        
        res.json({ message: "Consulta eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Estadísticas
async function getConsultasTotalCount(req, res) {
    try {
        const [rows] = await pool.query("SELECT COUNT(*) AS total FROM consultas_medicas");
        res.json({ total: rows[0].total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getConsultasCompletadasCount(req, res) {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(*) AS completadas 
            FROM citas_medicas_solicitudes cms
            JOIN citas c ON cms.cita_id = c.cita_id
            WHERE c.estado = 'completado'
        `);
        res.json({ completadas: rows[0].completadas });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getConsultasPendientesCount(req, res) {
    try {
        const [rows] = await pool.query(`
            SELECT COUNT(*) AS pendientes 
            FROM citas_medicas_solicitudes cms
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            WHERE c.estado = 'pendiente' OR c.estado IS NULL
        `);
        res.json({ pendientes: rows[0].pendientes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Hospitalización
async function crearHospitalizacion(req, res) {
    try {
        const { paciente_id, nombre, apellido, motivo } = req.body;
        
        if (!nombre || !apellido || !motivo) {
            return res.status(400).json({ error: "Nombre, apellido y motivo son requeridos" });
        }

        const [result] = await pool.query(
            `INSERT INTO lista_espera_hospitalizacion (paciente_id, nombre, apellido, motivo, fecha)
             VALUES (?, ?, ?, ?, NOW())`,
            [paciente_id || null, nombre, apellido, motivo]
        );

        res.json({ 
            message: "Paciente agregado a lista de espera",
            insertId: result.insertId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(process.cwd(), 'public', 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.pdf', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos PDF o DOCX'), false);
        }
    }
});

export {
    getConsultas,
    getConsultasCompletada,
    getConsultasPendiente,
    searchConsultations,
    createConsulta,
    createHistoria,
    getConsultaById,
    updateConsulta,
    updateHistoria,
    deleteConsulta,
    getConsultasTotalCount,
    getConsultasCompletadasCount,
    getConsultasPendientesCount,
    crearHospitalizacion,
    upload
};