import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM lista_espera_hospitalizacion ORDER BY fecha DESC`);
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getByPacienteId = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM lista_espera_hospitalizacion WHERE paciente_id = ?`, [id]); // Llama a readById del DAO
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export const create = async (req, res) => {
    try {
    const { paciente_id, motivo, fecha, nombre, apellido } = req.body;
    if (!paciente_id || !motivo || !fecha || !nombre || !apellido) {
    return res.status(400).json({ error: 'Id de la habitación es requerido' });
    }
    const [data] = await pool.query(
    `INSERT INTO lista_espera_hospitalizacion 
    (paciente_id, motivo, fecha, nombre, apellido) 
    VALUES (?, ?, ?, ?, ?)`,
    [paciente_id, motivo, fecha, nombre, apellido]
    );

    const [row] = await pool.query(
        `SELECT * FROM lista_espera_hospitalizacion WHERE paciente_id = ?`,
        [data.insertId]
    );
    res.status(201).json({
        message: 'Paciente añadido a la lista de espera exitosamente',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteById = async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
      }
  
      const [data] = await pool.query(
        `DELETE FROM lista_espera_hospitalizacion WHERE paciente_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna registro con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Paciente eliminado de la Lista de Espera',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};