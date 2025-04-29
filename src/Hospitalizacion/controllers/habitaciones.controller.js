import { pool } from "../../db.js";

export const getAllHabitaciones = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM habitaciones ORDER BY habitacion_id`);
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getByIdHabitaciones = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM habitaciones WHERE habitacion_id = ?`, [id]); // Llama a readById del DAO
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export const createHabitaciones = async (req, res) => {
    try {
    const { ubicacion } = req.body;
    if (!habitacion_id ) {
    return res.status(400).json({ error: 'Ubicacion es requerida' });
    }
    const [data] = await pool.query(
    `INSERT INTO habitaciones (ubicacion, estado) VALUES (?, "Activa")`,
    [ubicacion]
    );

    const [row] = await pool.query(
        `SELECT * FROM habitaciones WHERE habitacion_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'Habitación creada exitosamente',
        ubicacion: row[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const deleteByIdHabitacion = async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
      }
  
      const [data] = await pool.query(
        `DELETE FROM habitaciones WHERE habitacion_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna habitación con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Habitación eliminada exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};