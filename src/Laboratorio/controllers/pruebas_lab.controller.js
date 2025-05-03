import { pool } from "../../db.js";

// Get all pruebas
export const getAllPruebas = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT pl.prueba_id, pl.nombre, pl.categoria, pl.fecha, pl.descripcion, pl.resultados \
             FROM pruebas_laboratorio pl \
             ORDER BY pl.nombre'
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
            'SELECT pl.prueba_id, pl.nombre, pl.categoria, pl.fecha, pl.descripcion, pl.resultados \
             FROM pruebas_laboratorio pl \
             WHERE pl.prueba_id = ?',
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

// Función para generar un valor aleatorio basado en la categoría
function generateRandomValue(categoria) {
    const min = 0;
    const max = 100;
    const middle = (max - min) / 2;

    switch (categoria) {
        case "Sangre":
            return Math.round((Math.random() * (max - middle) + middle) * 100) / 100;
        case "Orina":
            return Math.round((Math.random() * (middle - min) + min) * 100) / 100;
        case "Microbiología":
            return Math.round((Math.random() * (max - min) + min) * 100) / 100;
        case "Bioquímica":
            return Math.round((Math.random() * (middle - min) + min) * 100) / 100;
        case "Otras":
            return Math.round((Math.random() * (max - min) + min) * 100) / 100;
        default:
            return Math.round((Math.random() * (max - min) + min) * 100) / 100;
    }
}

// Create new prueba
export const createPrueba = async (req, res) => {
    try {
        const { nombre, categoria, descripcion } = req.body;
        const fecha = new Date();
        const resultados = generateRandomValue(categoria);

        const [result] = await pool.query(
            'INSERT INTO pruebas_laboratorio (nombre, categoria, fecha, descripcion, resultados) \
             VALUES (?, ?, ?, ?, ?)',
            [nombre, categoria, fecha, descripcion, resultados]
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
        const { nombre, categoria, descripcion } = req.body;

        const fecha = new Date();
        const [result] = await pool.query(
            'UPDATE pruebas_laboratorio \
             SET nombre = ?, categoria = ?, descripcion = ?, fecha = ?\
              WHERE prueba_id = ?',
            [nombre, categoria, descripcion, fecha, id]
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
            'SELECT prueba_id FROM pruebas_laboratorio WHERE prueba_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Prueba no encontrada' });
        }

        // Delete the test
        const [result] = await pool.query(
            'DELETE FROM pruebas_laboratorio WHERE prueba_id = ?',
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

// Get pruebas by category
export const getPruebasByCategoria = async (req, res) => {
    try {
        const { categoria } = req.params;
        const [rows] = await pool.query(
            'SELECT pl.prueba_id, pl.nombre, pl.descripcion, pl.resultados \
             FROM pruebas_laboratorio pl \
             WHERE pl.categoria = ? \
            ORDER BY pl.nombre',
            [categoria]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pruebas por categoría:', error);
        res.status(500).json({ error: 'Error al obtener pruebas por categoría' });
    }
};

// Get active pruebas - Since the new table doesn't have an activo field, we'll get all pruebas
export const getPruebasActivas = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT pl.prueba_id, pl.nombre, pl.descripcion, pl.resultados \
             FROM pruebas_laboratorio pl \
             ORDER BY pl.nombre'
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pruebas activas:', error);
        res.status(500).json({ error: 'Error al obtener pruebas activas' });
    }
};

// Get available pruebas - Since the new table doesn't have an activo field or relationship with solicitudes, we'll get all pruebas
export const getPruebasDisponibles = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT pl.prueba_id, pl.nombre, pl.descripcion, pl.resultados \
             FROM pruebas_laboratorio pl \
             ORDER BY pl.nombre'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pruebas disponibles:', error);
        res.status(500).json({ error: 'Error al obtener pruebas disponibles' });
    }
};