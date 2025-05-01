import { pool } from "../../db.js";

// Get all pruebas
export const getAllPruebas = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT p.prueba_id, p.tipo_id, p.nombre, p.descripcion, \
                    p.duracion, p.prioridad, p.estado \
             FROM pruebas p \
             ORDER BY p.nombre'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pruebas:', error);
        res.status(500).json({ error: 'Error al obtener pruebas' });
    }
};

// Get prueba by ID
export const getPruebaById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            'SELECT p.prueba_id, p.tipo_id, p.nombre, p.descripcion, \
                    p.duracion, p.prioridad, p.estado \
             FROM pruebas p \
             WHERE p.prueba_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Prueba no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener prueba:', error);
        res.status(500).json({ error: 'Error al obtener prueba' });
    }
};

// Create new prueba
export const createPrueba = async (req, res) => {
    try {
        const { tipo_id, nombre, descripcion, duracion, prioridad, estado } = req.body;

        const [result] = await pool.query(
            'INSERT INTO pruebas (tipo_id, nombre, descripcion, duracion, prioridad, estado) \
             VALUES (?, ?, ?, ?, ?, ?)',
            [tipo_id, nombre, descripcion, duracion, prioridad, estado]
        );

        res.status(201).json({
            message: 'Prueba creada exitosamente',
            prueba_id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear prueba:', error);
        res.status(500).json({ error: 'Error al crear prueba' });
    }
};

// Update prueba
export const updatePrueba = async (req, res) => {
    try {
        const { id } = req.params;
        const { tipo_id, nombre, descripcion, duracion, prioridad, estado } = req.body;

        const [result] = await pool.query(
            'UPDATE pruebas \
             SET tipo_id = ?, nombre = ?, descripcion = ?, duracion = ?, \
                 prioridad = ?, estado = ? \
             WHERE prueba_id = ?',
            [tipo_id, nombre, descripcion, duracion, prioridad, estado, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Prueba no encontrada' });
        }

        res.json({ message: 'Prueba actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar prueba:', error);
        res.status(500).json({ error: 'Error al actualizar prueba' });
    }
};

// Delete prueba
export const deletePrueba = async (req, res) => {
    try {
        const { id } = req.params;

        // First check if the test exists
        const [rows] = await pool.query(
            'SELECT prueba_id FROM pruebas WHERE prueba_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Prueba no encontrada' });
        }

        // Delete the test
        const [result] = await pool.query(
            'DELETE FROM pruebas WHERE prueba_id = ?',
            [id]
        );

        res.json({ message: 'Prueba eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar prueba:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                error: 'No se puede eliminar la prueba porque tiene solicitudes asociadas'
            });
        }
        res.status(500).json({ error: 'Error al eliminar prueba' });
    }
};

// Get pruebas by type
export const getPruebasByTipo = async (req, res) => {
    try {
        const { tipo_id } = req.params;
        const [rows] = await pool.query(
            'SELECT p.prueba_id, p.nombre, p.descripcion, p.duracion, \
                    p.prioridad, p.estado \
             FROM pruebas p \
             WHERE p.tipo_id = ? \
             ORDER BY p.nombre',
            [tipo_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pruebas por tipo:', error);
        res.status(500).json({ error: 'Error al obtener pruebas por tipo' });
    }
};

// Get pruebas by priority
export const getPruebasByPrioridad = async (req, res) => {
    try {
        const { prioridad } = req.params;
        const [rows] = await pool.query(
            'SELECT p.prueba_id, p.nombre, p.descripcion, p.duracion, \
                    p.tipo_id, p.estado \
             FROM pruebas p \
             WHERE p.prioridad = ? \
             ORDER BY p.nombre',
            [prioridad]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pruebas por prioridad:', error);
        res.status(500).json({ error: 'Error al obtener pruebas por prioridad' });
    }
};

// Get available pruebas
export const getPruebasDisponibles = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT p.prueba_id, p.nombre, p.descripcion, p.duracion, \
                    p.prioridad, p.estado \
             FROM pruebas p \
             WHERE p.estado = "disponible" \
             AND p.prueba_id NOT IN \
                 (SELECT DISTINCT sl.prueba_id \
                  FROM solicitudes_laboratorio sl \
                  WHERE sl.estado = "pendiente") \
             ORDER BY p.nombre'
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pruebas disponibles:', error);
        res.status(500).json({ error: 'Error al obtener pruebas disponibles' });
    }
};