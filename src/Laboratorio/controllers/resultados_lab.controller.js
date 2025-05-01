import { pool } from "../../db.js";

// Get all resultados
export const getAllResultados = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT rl.resultado_id, rl.solicitud_id, rl.parametro, rl.valor, \
                    rl.rango_referencial, rl.unidad, rl.fecha_registro, \
                    sl.paciente_id, sl.estado, sl.fecha_resultados \
             FROM resultados_laboratorio rl \
             INNER JOIN solicitudes_laboratorio sl ON rl.solicitud_id = sl.solicitud_id \
             ORDER BY rl.fecha_registro DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        res.status(500).json({ error: 'Error al obtener resultados' });
    }
};

// Get resultados by solicitud
export const getResultadosBySolicitud = async (req, res) => {
    try {
        const { solicitud_id } = req.params;
        const [rows] = await pool.query(
            'SELECT rl.parametro, rl.valor, rl.rango_referencial, rl.unidad, \
                    rl.fecha_registro, rl.observacion \
             FROM resultados_laboratorio rl \
             WHERE rl.solicitud_id = ? \
             ORDER BY rl.fecha_registro DESC',
            [solicitud_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener resultados por solicitud:', error);
        res.status(500).json({ error: 'Error al obtener resultados por solicitud' });
    }
};

// Get resultados by paciente
export const getResultadosByPaciente = async (req, res) => {
    try {
        const { paciente_id } = req.params;
        const [rows] = await pool.query(
            'SELECT rl.parametro, rl.valor, rl.rango_referencial, rl.unidad, \
                    rl.fecha_registro, rl.observacion, \
                    sl.fecha_resultados, sl.estado \
             FROM resultados_laboratorio rl \
             INNER JOIN solicitudes_laboratorio sl ON rl.solicitud_id = sl.solicitud_id \
             WHERE sl.paciente_id = ? \
             ORDER BY rl.fecha_registro DESC',
            [paciente_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener resultados por paciente:', error);
        res.status(500).json({ error: 'Error al obtener resultados por paciente' });
    }
};

// Create new resultado
export const createResultado = async (req, res) => {
    try {
        const { solicitud_id, parametro, valor, rango_referencial, unidad, observacion } = req.body;

        const [result] = await pool.query(
            'INSERT INTO resultados_laboratorio (solicitud_id, parametro, valor, \
                    rango_referencial, unidad, observacion) \
             VALUES (?, ?, ?, ?, ?, ?)',
            [solicitud_id, parametro, valor, rango_referencial, unidad, observacion]
        );

        // Update solicitud status to completed
        await pool.query(
            'UPDATE solicitudes_laboratorio \
             SET estado = "completado", fecha_resultados = NOW() \
             WHERE solicitud_id = ?',
            [solicitud_id]
        );

        res.status(201).json({
            message: 'Resultado creado exitosamente',
            resultado_id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear resultado:', error);
        res.status(500).json({ error: 'Error al crear resultado' });
    }
};

// Update resultado
export const updateResultado = async (req, res) => {
    try {
        const { id } = req.params;
        const { parametro, valor, rango_referencial, unidad, observacion } = req.body;

        const [result] = await pool.query(
            'UPDATE resultados_laboratorio \
             SET parametro = ?, valor = ?, rango_referencial = ?, \
                 unidad = ?, observacion = ? \
             WHERE resultado_id = ?',
            [parametro, valor, rango_referencial, unidad, observacion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Resultado no encontrado' });
        }

        res.json({ message: 'Resultado actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar resultado:', error);
        res.status(500).json({ error: 'Error al actualizar resultado' });
    }
};

// Delete resultado
export const deleteResultado = async (req, res) => {
    try {
        const { id } = req.params;

        // First check if the result exists
        const [rows] = await pool.query(
            'SELECT resultado_id FROM resultados_laboratorio WHERE resultado_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Resultado no encontrado' });
        }

        // Delete the result
        const [result] = await pool.query(
            'DELETE FROM resultados_laboratorio WHERE resultado_id = ?',
            [id]
        );

        res.json({ message: 'Resultado eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar resultado:', error);
        res.status(500).json({ error: 'Error al eliminar resultado' });
    }
};

// Get resultados by date range
export const getResultadosByFecha = async (req, res) => {
    try {
        const { start, end } = req.query;
        const [rows] = await pool.query(
            'SELECT rl.parametro, rl.valor, rl.rango_referencial, rl.unidad, \
                    rl.fecha_registro, rl.observacion, \
                    sl.paciente_id, sl.fecha_resultados \
             FROM resultados_laboratorio rl \
             INNER JOIN solicitudes_laboratorio sl ON rl.solicitud_id = sl.solicitud_id \
             WHERE rl.fecha_registro BETWEEN ? AND ? \
             ORDER BY rl.fecha_registro DESC',
            [start, end]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener resultados por fecha:', error);
        res.status(500).json({ error: 'Error al obtener resultados por fecha' });
    }
};

// Get resultados by parameter
export const getResultadosByParametro = async (req, res) => {
    try {
        const { parametro } = req.params;
        const [rows] = await pool.query(
            'SELECT rl.valor, rl.rango_referencial, rl.unidad, \
                    rl.fecha_registro, rl.observacion, \
                    sl.paciente_id, sl.fecha_resultados \
             FROM resultados_laboratorio rl \
             INNER JOIN solicitudes_laboratorio sl ON rl.solicitud_id = sl.solicitud_id \
             WHERE rl.parametro = ? \
             ORDER BY rl.fecha_registro DESC',
            [parametro]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener resultados por parámetro:', error);
        res.status(500).json({ error: 'Error al obtener resultados por parámetro' });
    }
};