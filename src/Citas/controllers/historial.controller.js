import { pool } from '../../db.js';

export const getAllCitas = async (req, res) => {//el controlador que muestra todas las citas en su respectiva tabla 
    try {
        const [data] = await pool.query(`SELECT * FROM citas`);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: "No se encontraron citas registradas." });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const borrarCita = async (req, res) => {//el controlador que elimina las citas, solo se usa en historial
    try {
        const { id } = req.params;

        // Verificar si la cita existe
        const [cita] = await pool.query(
            `SELECT * FROM citas WHERE cita_id = ?`,
             [id]
            );

        if (!cita || cita.length === 0) {
            return res.status(404).json({ error: "Cita no encontrada." });
        }

        await pool.query(`DELETE FROM citas WHERE cita_id = ?`, [id]);
        res.status(200).json({ message: "Cita eliminada correctamente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



