import { pool } from "../../db.js";

// Get all examenes
export const getAllExamenes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT tp.tipo_id, tp.nombre, tp.descripcion, tp.costo, \
                    tp.duracion, tp.prioridad, tp.categoria \
             FROM tipo_prueba tp'
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
            'SELECT tp.tipo_id, tp.nombre, tp.descripcion, tp.costo, \
                    tp.duracion, tp.prioridad, tp.categoria \
             FROM tipo_prueba tp \
             WHERE tp.tipo_id = ?',
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
        const { nombre, descripcion, costo, duracion, prioridad, categoria } = req.body;

        const [result] = await pool.query(
            'INSERT INTO tipo_prueba (nombre, descripcion, costo, duracion, prioridad, categoria) \
             VALUES (?, ?, ?, ?, ?, ?)',
            [nombre, descripcion, costo, duracion, prioridad, categoria]
        );

        res.status(201).json({
            message: 'Examen creado exitosamente',
            tipo_id: result.insertId
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
        const { nombre, descripcion, costo, duracion, prioridad, categoria } = req.body;

        const [result] = await pool.query(
            'UPDATE tipo_prueba \
             SET nombre = ?, descripcion = ?, costo = ?, duracion = ?, \
                 prioridad = ?, categoria = ? \
             WHERE tipo_id = ?',
            [nombre, descripcion, costo, duracion, prioridad, categoria, id]
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
            'SELECT tipo_id FROM tipo_prueba WHERE tipo_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Examen no encontrado' });
        }

        // Delete the exam
        const [result] = await pool.query(
            'DELETE FROM tipo_prueba WHERE tipo_id = ?',
            [id]
        );

        res.json({ message: 'Examen eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar examen:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                error: 'No se puede eliminar el examen porque tiene solicitudes asociadas'
            });
        }
        res.status(500).json({ error: 'Error al eliminar examen' });
    }
};

// Get examenes by category
export const getExamenesByCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const [rows] = await pool.query(
            'SELECT tp.tipo_id, tp.nombre, tp.descripcion, tp.costo, \
                    tp.duracion, tp.prioridad \
             FROM tipo_prueba tp \
             WHERE tp.categoria = ? \
             ORDER BY tp.nombre',
            [categoria]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener exámenes por categoría:', error);
        res.status(500).json({ error: 'Error al obtener exámenes por categoría' });
    }
};

// Get examenes by price range
export const getExamenesByPrecio = async (req, res) => {
    try {
        const { min, max } = req.query;
        const [rows] = await pool.query(
            'SELECT tp.tipo_id, tp.nombre, tp.descripcion, tp.costo, \
                    tp.duracion, tp.prioridad \
             FROM tipo_prueba tp \
             WHERE tp.costo BETWEEN ? AND ? \
             ORDER BY tp.costo',
            [min, max]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener exámenes por precio:', error);
        res.status(500).json({ error: 'Error al obtener exámenes por precio' });
    }
};

// Get available examenes
export const getExamenesDisponibles = async (req, res) => {
    try {
        // Get all examenes that don't have pending requests
        const [rows] = await pool.query(
            'SELECT tp.tipo_id, tp.nombre, tp.descripcion, tp.costo, \
                    tp.duracion, tp.prioridad \
             FROM tipo_prueba tp \
             WHERE tp.tipo_id NOT IN \
                 (SELECT DISTINCT sl.tipo_id \
                  FROM solicitudes_laboratorio sl \
                  WHERE sl.estado = "pendiente") \
             ORDER BY tp.nombre'
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener exámenes disponibles:', error);
        res.status(500).json({ error: 'Error al obtener exámenes disponibles' });
    }
};