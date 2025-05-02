import { pool } from "../../db.js";
import multer from "multer";
import path from "path";

// Obtener todos los historiales médicos
async function getHistorias(req, res) {
    try {
        const [rows] = await pool.query(`
            SELECT 
                hm.id,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido,
                hm.fecha_registro,
                hm.diagnostico,
                hm.observaciones,
                c.cita_id,
                c.estado,
                c.fecha_cita
            FROM historial_medico hm
            JOIN consultas_medicas cm ON hm.consulta_id = cm.consulta_id
            LEFT JOIN citas_medicas_solicitudes cms ON cm.consulta_id = cms.consulta_id
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            JOIN pacientes p ON hm.id_paciente = p.paciente_id
            ORDER BY hm.fecha_registro DESC
        `);
        
        res.json({ data: rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Obtener un historial médico específico
async function getHistoriaId(req, res) {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                cm.consulta_id,
                CONCAT(e.nombre, ' ', e.apellido) AS medico_nombre,
                p.nombre AS paciente_nombre,
                p.apellido AS paciente_apellido,
                hm.diagnostico,
                hm.tratamiento,
                hm.observaciones,
                hm.img,
                hm.fecha_registro,
                c.cita_id,
                c.estado,
                c.fecha_cita
            FROM historial_medico hm
            JOIN consultas_medicas cm ON hm.consulta_id = cm.consulta_id
            JOIN empleados e ON cm.medico_id = e.empleado_id
            JOIN pacientes p ON hm.id_paciente = p.paciente_id
            LEFT JOIN citas_medicas_solicitudes cms ON cm.consulta_id = cms.consulta_id
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            WHERE hm.id = ?
        `, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }

        res.json({ data: rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Crear un nuevo historial médico
async function createHistoria(req, res) {
    try {
        const { consulta_id, paciente_id, cita_id, diagnostico, tratamiento, observaciones } = req.body;
        const archivo = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await pool.query(`
            INSERT INTO historial_medico 
            (consulta_id, id_paciente, diagnostico, tratamiento, observaciones, img) 
            VALUES (?, ?, ?, ?, ?, ?)
        `, [consulta_id, paciente_id, diagnostico, tratamiento, observaciones, archivo]);

        if (cita_id) {
            await pool.query(`
                UPDATE citas SET estado = 'completado' 
                WHERE cita_id = ?
            `, [cita_id]);
        }

        res.status(201).json({ 
            id: result.insertId,
            message: "Historial médico creado exitosamente"
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Actualizar un historial médico
async function updateHistoria(req, res) {
    try {
        const { id } = req.params;
        const { diagnostico, tratamiento, observaciones } = req.body;
        const archivo = req.file ? `/uploads/${req.file.filename}` : null;

        const [result] = await pool.query(`
            UPDATE historial_medico 
            SET diagnostico = IFNULL(?, diagnostico), 
                tratamiento = IFNULL(?, tratamiento), 
                observaciones = IFNULL(?, observaciones), 
                img = IFNULL(?, img) 
            WHERE id = ?
        `, [diagnostico, tratamiento, observaciones, archivo, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }

        res.json({ message: "Historial médico actualizado exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Eliminar un historial médico
async function deleteHistoria(req, res) {
    try {
        const { id } = req.params;

        // Obtener la cita asociada si existe
        const [historial] = await pool.query(`
            SELECT c.cita_id 
            FROM historial_medico hm
            LEFT JOIN citas_medicas_solicitudes cms ON hm.consulta_id = cms.consulta_id
            LEFT JOIN citas c ON cms.cita_id = c.cita_id
            WHERE hm.id = ?
        `, [id]);

        // Eliminar el historial
        const [result] = await pool.query(`
            DELETE FROM historial_medico 
            WHERE id = ?
        `, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Historial no encontrado" });
        }

        // Si tenía cita asociada, marcarla como pendiente
        if (historial.length > 0 && historial[0].cita_id) {
            await pool.query(`
                UPDATE citas SET estado = 'pendiente' 
                WHERE cita_id = ?
            `, [historial[0].cita_id]);
        }

        res.status(204).send();
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
        cb(null, 'historia-' + uniqueSuffix + ext);
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
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // Límite de 5MB
    }
});

export { 
    getHistorias, 
    getHistoriaId, 
    createHistoria, 
    updateHistoria, 
    deleteHistoria, 
    upload 
};