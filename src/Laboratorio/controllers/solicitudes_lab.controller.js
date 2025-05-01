import { pool } from "../../db.js";

// Get all solicitudes
export const getAllSolicitudes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT sl.solicitud_id, sl.paciente_id, sl.medico_id, sl.motivo, \
                    sl.estado, sl.fecha_solicitud, sl.fecha_resultados, \
                    sl.modulo_solicitante, sl.tipo_id, \
                    p.nombre as paciente_nombre, p.apellido as paciente_apellido \
             FROM solicitudes_laboratorio sl \
             LEFT JOIN pacientes p ON sl.paciente_id = p.paciente_id \
             ORDER BY sl.fecha_solicitud DESC'
        );
        res.json(rows);
    } catch (error) {
        console.error('Error al obtener solicitudes:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
};

// Get solicitud by ID
export const getSolicitudById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(
            'SELECT sl.solicitud_id, sl.paciente_id, sl.medico_id, sl.motivo, \
                    sl.estado, sl.fecha_solicitud, sl.fecha_resultados, \
                    sl.modulo_solicitante, sl.tipo_id, \
                    p.nombre as paciente_nombre, p.apellido as paciente_apellido, \
                    m.nombre as medico_nombre, m.apellido as medico_apellido \
             FROM solicitudes_laboratorio sl \
             LEFT JOIN pacientes p ON sl.paciente_id = p.paciente_id \
             LEFT JOIN medicos m ON sl.medico_id = m.medico_id \
             WHERE sl.solicitud_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error al obtener solicitud:', error);
        res.status(500).json({ error: 'Error al obtener solicitud' });
    }
};

// Create new solicitud
export const createSolicitud = async (req, res) => {
    try {
        const { paciente_id, medico_id, motivo, modulo_solicitante, tipo_id, ayuno, observacion } = req.body;

        const [result] = await pool.query(
            'INSERT INTO solicitudes_laboratorio (paciente_id, medico_id, motivo, \
                    estado, fecha_solicitud, modulo_solicitante, tipo_id, ayuno, observacion) \
             VALUES (?, ?, ?, "pendiente", NOW(), ?, ?, ?, ?)',
            [paciente_id, medico_id, motivo, modulo_solicitante, tipo_id, ayuno, observacion]
        );

        res.status(201).json({
            message: 'Solicitud creada exitosamente',
            solicitud_id: result.insertId
        });
    } catch (error) {
        console.error('Error al crear solicitud:', error);
        res.status(500).json({ error: 'Error al crear solicitud' });
    }
};

// Update solicitud
export const updateSolicitud = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado, fecha_resultados, observacion } = req.body;

        const [result] = await pool.query(
            'UPDATE solicitudes_laboratorio \
             SET estado = ?, fecha_resultados = ?, observacion = ? \
             WHERE solicitud_id = ?',
            [estado, fecha_resultados, observacion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        res.json({ message: 'Solicitud actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar solicitud:', error);
        res.status(500).json({ error: 'Error al actualizar solicitud' });
    }
};

// Delete solicitud
export const deleteSolicitud = async (req, res) => {
    try {
        const { id } = req.params;

        // First check if the request exists
        const [rows] = await pool.query(
            'SELECT solicitud_id FROM solicitudes_laboratorio WHERE solicitud_id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Solicitud no encontrada' });
        }

        // Delete the request
        const [result] = await pool.query(
            'DELETE FROM solicitudes_laboratorio WHERE solicitud_id = ?',
            [id]
        );

        res.json({ message: 'Solicitud eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar solicitud:', error);
        res.status(500).json({ error: 'Error al eliminar solicitud' });
    }
};

// Get solicitudes by paciente
export const getSolicitudesByPaciente = async (req, res) => {
    try {
        const { paciente_id } = req.params;
        const [rows] = await pool.query(
            'SELECT sl.solicitud_id, sl.motivo, sl.estado, sl.fecha_solicitud, \
                    sl.fecha_resultados, sl.modulo_solicitante, \
                    m.nombre as medico_nombre, m.apellido as medico_apellido \
             FROM solicitudes_laboratorio sl \
             LEFT JOIN medicos m ON sl.medico_id = m.medico_id \
             WHERE sl.paciente_id = ? \
             ORDER BY sl.fecha_solicitud DESC',
            [paciente_id]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener solicitudes por paciente:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes por paciente' });
    }
};

// Get solicitudes by estado
export const getSolicitudesByEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const [rows] = await pool.query(
            'SELECT sl.solicitud_id, sl.paciente_id, sl.medico_id, sl.motivo, \
                    sl.fecha_solicitud, sl.fecha_resultados, sl.modulo_solicitante, \
                    p.nombre as paciente_nombre, p.apellido as paciente_apellido \
             FROM solicitudes_laboratorio sl \
             LEFT JOIN pacientes p ON sl.paciente_id = p.paciente_id \
             WHERE sl.estado = ? \
             ORDER BY sl.fecha_solicitud DESC',
            [estado]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener solicitudes por estado:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes por estado' });
    }
};

// Get solicitudes by modulo
export const getSolicitudesByModulo = async (req, res) => {
    try {
        const { modulo } = req.params;
        const [rows] = await pool.query(
            'SELECT sl.solicitud_id, sl.paciente_id, sl.medico_id, sl.motivo, \
                    sl.estado, sl.fecha_solicitud, sl.fecha_resultados, \
                    p.nombre as paciente_nombre, p.apellido as paciente_apellido \
             FROM solicitudes_laboratorio sl \
             LEFT JOIN pacientes p ON sl.paciente_id = p.paciente_id \
             WHERE sl.modulo_solicitante = ? \
             ORDER BY sl.fecha_solicitud DESC',
            [modulo]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener solicitudes por módulo:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes por módulo' });
    }
};

// Get solicitudes pendientes
export const getSolicitudesPendientes = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT sl.solicitud_id, sl.paciente_id, sl.medico_id, sl.motivo, \
                    sl.fecha_solicitud, sl.tipo_id, \
                    p.nombre as paciente_nombre, p.apellido as paciente_apellido \
             FROM solicitudes_laboratorio sl \
             LEFT JOIN pacientes p ON sl.paciente_id = p.paciente_id \
             WHERE sl.estado = "pendiente" \
             ORDER BY sl.fecha_solicitud ASC'
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener solicitudes pendientes:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes pendientes' });
    }
};

// Get solicitudes completadas
export const getSolicitudesCompletadas = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT sl.solicitud_id, sl.paciente_id, sl.medico_id, sl.motivo, \
                    sl.estado, sl.fecha_solicitud, sl.fecha_resultados, \
                    p.nombre as paciente_nombre, p.apellido as paciente_apellido \
             FROM solicitudes_laboratorio sl \
             LEFT JOIN pacientes p ON sl.paciente_id = p.paciente_id \
             WHERE sl.estado = "completado" \
             ORDER BY sl.fecha_resultados DESC'
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener solicitudes completadas:', error);
        res.status(500).json({ error: 'Error al obtener solicitudes completadas' });
    }
};