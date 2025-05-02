import { pool } from '../../db.js';


export const getAllPacientes = async (req, res) => {//obtiene todos los pacientes que esten en la base de datos
    try {
        const [data] = await pool.query(`SELECT * FROM pacientes`);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron pacientes registrados." });
        }
        res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getPacienteById = async (req, res) => { //obtiene pacientes por id(cedula)
    try {
        const { id } = req.params;
        const [data] = await pool.query(`SELECT * FROM pacientes WHERE paciente_id = ?`, [id]);

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Paciente no encontrado." });
        }

        res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


export const createPaciente = async (req, res) => { // Crear pacientes, para los transeuntes de consultas
    try {
        const { nombre, apellido, genero, cedula, fecha_nacimiento, direccion, email, telefono } = req.body;

        if (!nombre || !apellido || !genero || !cedula || !fecha_nacimiento || !direccion || !email || !telefono) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
        }

        const [result] = await pool.query(
            `INSERT INTO pacientes (nombre, apellido, genero, cedula, fecha_nacimiento, direccion, email, telefono) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, genero, cedula, fecha_nacimiento, direccion, email, telefono]
        );

        res.status(201).json({ message: "Paciente creado exitosamente.", paciente_id: result.insertId });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

