import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM camas ORDER BY habitacion_id`);
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getByHabitacionId = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM camas WHERE habitacion_id = ?`, [id]);
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
    const { habitacion_id } = req.body;
    if (!habitacion_id ) {
    return res.status(400).json({ error: 'Id de la habitación es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO camas (habitacion_id, estado) VALUES (?, 1)
    `,
    [habitacion_id]
    );

    const [row] = await pool.query(
        `SELECT * FROM camas WHERE habitacion_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'Cama creada exitosamente',
        ubicacion: row[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateById = async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
  
      if (!id || (!updateData.estado && updateData.estado !== 0)) {
        return res.status(400).json({ error: 'ID y datos de actualización (estado) son requeridos' });
      }
  
      const [data] = await pool.query(
        `
        UPDATE camas SET estado = ? WHERE cama_id = ?
        `,
        [updateData.estado, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna cama con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Cama actualizada exitosamente',
        updatedData: { id: id, ...updateData },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


export const deleteById = async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
      }
  
      const [data] = await pool.query(
        `DELETE FROM camas WHERE cama_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna cama con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Cama eliminada exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};