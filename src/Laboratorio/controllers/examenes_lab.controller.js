import { pool } from "../../db.js";

// Get all examenes
export const getAllExamenes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            ` SELECT e.examen_id, p.nombre, p.apellido, e.fecha, e.tipo_examen, e.estado, e.resultados, e.observaciones 
                FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             ORDER BY e.fecha DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener exámenes:', error);
        res.status(500).json({ error: 'Error al obtener exámenes' });
    }
};

// Get examen by ID
export const getExamenById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
           ` SELECT e.examen_id, e.paciente_id, p.nombre, p.apellido, e.fecha, e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE e.examen_id = ? `,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener examen:', error);
        res.status(500).json({ error: 'Error al obtener examen' });
    }
};

// Create new examen
export const createExamen = async (req, res) => {
    try {
        const { paciente_id, fecha, tipo_examen, estado, resultados, observaciones } = req.body;

        const [result] = await pool.query(
            `INSERT INTO examenes_laboratorio (paciente_id, fecha, tipo_examen, estado, resultados, observaciones) 
             VALUES(?, ?, ?, ?, ?, ?)`,
            [paciente_id, fecha, tipo_examen, estado, resultados, observaciones]
        );

        res.status(201).json({
            message: 'Examen creado exitosamente',
            examen_id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear examen:', error);
        res.status(500).json({ error: 'Error al crear examen' });
    }
};

// Update examen
export const updateExamen = async (req, res) => {
    try {
        const { id } = req.params;
        const { paciente_id, fecha, tipo_examen, estado, resultados, observaciones } = req.body;

        const [result] = await pool.query(
            `UPDATE examenes_laboratorio 
             SET paciente_id = ?, fecha = ?, tipo_examen = ?,
            estado = ?, resultados = ?, observaciones = ? 
                WHERE examen_id = ? `,
            [paciente_id, fecha, tipo_examen, estado, resultados, observaciones, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }

        res.json({ message: 'Examen actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar examen:', error);
        res.status(500).json({ error: 'Error al actualizar examen' });
    }
};

// Delete examen
export const deleteExamen = async (req, res) => {
    try {
        const { id } = req.params;

        // First check if the exam exists
        const [rows] = await pool.query(
            `SELECT examen_id FROM examenes_laboratorio WHERE examen_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }

        // Delete the exam
        const [result] = await pool.query(
            `DELETE FROM examenes_laboratorio WHERE examen_id = ?`,
            [id]
        );

        res.json({ message: 'Examen eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar examen:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                error: 'No se puede eliminar el examen porque tiene relaciones con otras tablas'
            });
        }
        res.status(500).json({ error: 'Error al eliminar examen' });
    }
};

// Get examenes by type
export const getExamenesByTipo = async (req, res) => {
    try {
        const { tipo_examen } = req.params;
        const [rows] = await pool.query(
           ` SELECT e.examen_id, p.nombre, p.apellido, e.fecha, e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE e.tipo_examen = ? 
            ORDER BY e.fecha DESC`,
            [tipo_examen]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener exámenes por tipo:', error);
        res.status(500).json({ error: 'Error al obtener exámenes por tipo' });
    }
};

// Get examenes by date range
export const getExamenesByFecha = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;
        const [rows] = await pool.query(
           ` SELECT e.examen_id, p.nombre, p.apellido, e.fecha, e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE e.fecha BETWEEN ? AND ? 
            ORDER BY e.fecha DESC`,
            [fecha_inicio, fecha_fin]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener exámenes por fecha:', error);
        res.status(500).json({ error: 'Error al obtener exámenes por fecha' });
    }
};

// Get examenes by status
export const getExamenesByEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const [rows] = await pool.query(
           ` SELECT e.examen_id, p.nombre, p.apellido, e.fecha, e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE e.estado = ? 
            ORDER BY e.fecha DESC`,
            [estado]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener exámenes por estado:', error);
        res.status(500).json({ error: 'Error al obtener exámenes por estado' });
    }
};

// Get pending examenes
export const getExamenesPendientes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT e.examen_id, p.nombre, p.apellido, e.fecha, e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE e.estado = "Pendiente" 
             ORDER BY e.fecha ASC`
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener exámenes pendientes:', error);
        res.status(500).json({ error: 'Error al obtener exámenes pendientes' });
    }
};