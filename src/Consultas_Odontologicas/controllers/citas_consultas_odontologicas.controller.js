import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM citas_consultas_odontologicas`);
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
    const { consulta_id , cita_id } = req.body;
    if (!consulta_id || !cita_id) {
    return res.status(400).json({ error: 'Id de la consulta y de la cita es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO citas_consultas_odontologicas (consulta_id, cita_id) VALUES (?, ?)
    `,
    [consulta_id,cita_id]
    );

    const [row] = await pool.query(
        `SELECT * FROM citas_consultas_odontologicas WHERE consulta_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'cita creada exitosamente',
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
  
      if (!id || !updateData.cita_id) {
        return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
      }
  
      const [data] = await pool.query(
        `
        UPDATE citas_consultas_odontologicas SET cita_id = ? WHERE consulta_id = ?
        `,
        [updateData.cita_id, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna cita con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'cita actualizada exitosamente',
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
        `DELETE FROM citas_consultas_odontologicas WHERE cama_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna cita con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'cita eliminada exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};