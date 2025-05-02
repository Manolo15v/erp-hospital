import { pool } from '../../db.js';

export const getAll = async (req, res) => {//controlador paara obtener todos los recursos
    try {
        const [data] = await pool.query('SELECT * FROM recursos');
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No se encontraron recursos.' });
        }
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {//controlador para obtener por id, util con id_orden_compra
    const { id } = req.params;

    try {
        const [data] = await pool.query('SELECT * FROM recursos WHERE recurso_id = ?', [id]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Recurso no encontrado.' });
        }
        res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createRecurso = async (req, res) => {//crea recursos(?)
    const { nombre, descripcion, codigo_recurso } = req.body;

    try {
        const query = `
            INSERT INTO recursos (nombre, descripcion, codigo_recurso)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(query, [nombre, descripcion, codigo_recurso]);
        res.status(201).json({ message: 'Recurso creado exitosamente', id: result.insertId });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateRecurso = async (req, res) => {//actualiza los recursos
    const { id } = req.params;
    const { nombre, descripcion, codigo_recurso } = req.body;

    try {
        const query = `
            UPDATE recursos
            SET nombre = ?, descripcion = ?, codigo_recurso = ?
            WHERE recurso_id = ?
        `;
        const [result] = await pool.query(query, [nombre, descripcion, codigo_recurso, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recurso no encontrado.' });
        }

        res.status(200).json({ message: 'Recurso actualizado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const deleteRecurso = async (req, res) => {//borra los recursos, creo que no se hace desde aca
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM recursos WHERE recurso_id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recurso no encontrado.' });
        }

        res.status(200).json({ message: 'Recurso eliminado exitosamente' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
