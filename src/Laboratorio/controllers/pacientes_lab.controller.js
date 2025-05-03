import { pool } from "../../db.js";

// Get all pacientes
export const getAllPacientes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.paciente_id, p.nombre, p.apellido, p.cedula, 
                    p.fecha_nacimiento, p.genero, p.telefono, p.direccion, p.email 
             FROM pacientes p`
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener pacientes:', error);
        res.status(500).json({ error: 'Error al obtener pacientes' });
    }
};

// Get paciente by ID
export const getPacienteById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            `SELECT p.paciente_id, p.nombre, p.apellido, p.cedula, 
                    p.fecha_nacimiento, p.genero, p.telefono, p.direccion, p.email 
             FROM pacientes p 
             WHERE p.paciente_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener paciente:', error);
        res.status(500).json({ error: 'Error al obtener paciente' });
    }
};

// Create new paciente
export const createPaciente = async (req, res) => {
    try {
        const { nombre, apellido, cedula, genero, fecha_nacimiento, telefono, direccion, email } = req.body;

        const [result] = await pool.query(
            `INSERT INTO pacientes (nombre, apellido, cedula, genero, fecha_nacimiento, telefono, direccion, email) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, cedula, genero, fecha_nacimiento, telefono, direccion, email]
        );

        res.status(201).json({
            message: 'Paciente creado exitosamente',
            paciente_id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear paciente:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Identificación ya existe' });
        }
        res.status(500).json({ error: 'Error al crear paciente' });
    }
};

// Update paciente
export const updatePaciente = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, cedula, genero, fecha_nacimiento, telefono, direccion, email } = req.body;

        const [result] = await pool.query(
            `UPDATE pacientes 
             SET nombre = ?, apellido = ?, cedula = ?, genero = ?, 
                 fecha_nacimiento = ?, telefono = ?, direccion = ?, email = ? 
             WHERE paciente_id = ?`,
            [nombre, apellido, cedula, genero, fecha_nacimiento, telefono, direccion, email, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        res.json({ message: 'Paciente actualizado exitosamente' });
    } catch (error) {
        console.error('Error al actualizar paciente:', error);
        res.status(500).json({ error: 'Error al actualizar paciente' });
    }
};

// Delete paciente
export const deletePaciente = async (req, res) => {
    try {
        const { id } = req.params;

        // First check if the patient exists
        const [rows] = await pool.query(
            `SELECT paciente_id FROM pacientes WHERE paciente_id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Paciente no encontrado' });
        }

        // Delete the patient
        const [result] = await pool.query(
            `DELETE FROM pacientes WHERE paciente_id = ?`,
            [id]
        );

        res.json({ message: 'Paciente eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar paciente:', error);
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({
                error: 'No se puede eliminar el paciente porque tiene solicitudes asociadas'
            });
        }
        res.status(500).json({ error: 'Error al eliminar paciente' });
    }
};

// Get paciente's medical history
export const getPacienteHistorial = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            `SELECT sl.solicitud_id, sl.fecha_solicitud, sl.estado, sl.observacion, 
                    tp.nombre as prueba, tp.descripcion 
             FROM solicitudes_laboratorio sl 
             INNER JOIN tipo_prueba tp ON sl.tipo_id = tp.tipo_id 
             WHERE sl.paciente_id = ? 
             ORDER BY sl.fecha_solicitud DESC`,
            [id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener historial:', error);
        res.status(500).json({ error: 'Error al obtener historial' });
    }
};

// Get paciente's test results
export const getPacienteResultados = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            `SELECT rl.parametro, rl.valor, rl.rango_referencial, rl.unidad, 
                    sl.fecha_resultados, sl.observacion 
             FROM resultados_laboratorio rl 
             INNER JOIN solicitudes_laboratorio sl ON rl.solicitud_id = sl.solicitud_id 
             WHERE sl.paciente_id = ? 
             ORDER BY sl.fecha_resultados DESC`,
            [id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        res.status(500).json({ error: 'Error al obtener resultados' });
    }
};
