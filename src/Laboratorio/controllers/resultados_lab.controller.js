import { pool } from "../../db.js";

// Get all examenes with patient details
export const getAllResultados = async (req, res) => {
    try {
        // Get all examenes with their types
        const [examenes] = await pool.query(
            `SELECT DISTINCT e.examen_id, e.paciente_id, p.nombre, p.apellido, p.cedula, e.fecha as fecha_examen, 
                    e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             ORDER BY e.fecha DESC`
        );

        // Get all pruebas with their categories
        const [pruebas] = await pool.query(
            `SELECT pl.prueba_id, pl.nombre as tipo_examen, pl.categoria 
             FROM pruebas_laboratorio pl 
             ORDER BY pl.nombre`
        );

        // Map examenes with their types
        const examenesConTipos = examenes.map(examen => {
            const prueba = pruebas.find(p => p.tipo_examen === examen.tipo_examen);
            return {
                ...examen,
                categoria: prueba ? prueba.categoria : 'No especificada'
            };
        });

        res.json(examenesConTipos);
    } catch (error) {
        console.error('Error al obtener examenes:', error);
        res.status(500).json({ error: 'Error al obtener examenes' });
    }
};

// Get examenes by paciente
export const getResultadosByPaciente = async (req, res) => {
    try {
        const { nombre, apellido, cedula } = req.params;
        const [rows] = await pool.query(
            `SELECT DISTINCT e.examen_id, e.paciente_id, p.nombre, p.apellido, p.cedula, e.fecha as fecha_examen, 
                    e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE p.nombre = ? AND p.apellido = ? AND p.cedula = ? 
             ORDER BY e.fecha DESC`,
            [nombre, apellido, cedula]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener examenes por paciente:', error);
        res.status(500).json({ error: 'Error al obtener examenes por paciente' });
    }
};

// Get examenes by date range
export const getResultadosByFecha = async (req, res) => {
    try {
        const { start, end } = req.query;
        const [rows] = await pool.query(
            `SELECT DISTINCT e.examen_id, p.nombre, p.apellido, p.cedula, e.fecha as fecha_examen, 
                    e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE e.fecha BETWEEN ? AND ? 
             ORDER BY e.fecha DESC`,
            [start, end]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener examenes por fecha:', error);
        res.status(500).json({ error: 'Error al obtener examenes por fecha' });
    }
};

// Get examenes by estado
export const getResultadosByEstado = async (req, res) => {
    try {
        const { estado } = req.params;
        const [rows] = await pool.query(
            `SELECT DISTINCT e.examen_id, p.nombre, p.apellido, p.cedula, e.fecha as fecha_examen, 
                    e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE e.estado = ? 
             ORDER BY e.fecha DESC`,
            [estado]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener examenes por estado:', error);
        res.status(500).json({ error: 'Error al obtener examenes por estado' });
    }
};

// Get examenes by tipo de examen
export const getResultadosByTipo = async (req, res) => {
    try {
        const { tipo_examen } = req.params;
        const [examenes] = await pool.query(
            `SELECT DISTINCT e.examen_id, p.nombre, p.apellido, p.cedula, e.fecha as fecha_examen, 
                    e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE e.tipo_examen = ? 
             ORDER BY e.fecha DESC`,
            [tipo_examen]
        );

        res.json(rows);
    } catch (error) {
        console.error('Error al obtener examenes por tipo de examen:', error);
        res.status(500).json({ error: 'Error al obtener examenes por tipo de examen' });
    }
};

// Get examenes by multiple filters
export const getResultadosByFilters = async (req, res) => {
    try {
        const { nombre, apellido, cedula, start, end, estado, tipo_examen } = req.query;
        let query = `SELECT DISTINCT e.examen_id, p.nombre, p.apellido, p.cedula, e.fecha as fecha_examen, 
                    e.tipo_examen, e.estado, e.resultados, e.observaciones 
             FROM examenes_laboratorio e 
             JOIN pacientes p ON e.paciente_id = p.paciente_id 
             WHERE 1=1`;

        const params = [];

        if (nombre && apellido) {
            query += ' AND p.nombre = ? AND p.apellido = ?';
            params.push(nombre, apellido);
        }
        if (cedula) {
            query += ' AND p.cedula = ?';
            params.push(cedula);
        }
        if (start && end) {
            query += ' AND e.fecha BETWEEN ? AND ?';
            params.push(start, end);
        }
        if (estado) {
            query += ' AND e.estado = ?';
            params.push(estado);
        }
        if (tipo_examen) {
            query += ' AND e.tipo_examen = ?';
            params.push(tipo_examen);
        }

        query += ' ORDER BY e.fecha DESC';

        const [examenes] = await pool.query(query, params);

        // Get all pruebas
        const [pruebas] = await pool.query(
            `SELECT pl.prueba_id, pl.nombre as tipo_examen, pl.categoria 
             FROM pruebas_laboratorio pl 
             ORDER BY pl.nombre`
        );

        // Map examenes with their types
        const examenesConTipos = examenes.map(examen => {
            const prueba = pruebas.find(p => p.tipo_examen === examen.tipo_examen);
            return {
                ...examen,
                categoria: prueba ? prueba.categoria : 'No especificada'
            };
        });

        res.json(examenesConTipos);
    } catch (error) {
        console.error('Error al obtener examenes por filtros:', error);
        res.status(500).json({ error: 'Error al obtener examenes por filtros' });
    }
};
