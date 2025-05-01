import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM consultas_odontologicas`);
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
    const { paciente_id , odontologo_id, fecha_consulta, historial_id, motivo} = req.body;
    if (!paciente_id || !odontologo_id || !fecha_consulta || !historial_id || !motivo) {
    return res.status(400).json({ error: 'paciente_id , odontologo_id, fecha_consulta, historial_id y motivo es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO consultas_odontologicas (paciente_id , odontologo_id, fecha_consulta, historial_id, motivo) VALUES (?, ?, ?, ?, ?)
    `,
    [paciente_id , odontologo_id, fecha_consulta, historial_id, motivo]
    );

    const [row] = await pool.query(
        `SELECT * FROM consultas_odontologicas WHERE consulta_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'Consulta creada exitosamente',
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
  
      if (!id || !updateData.paciente_id || !updateData.odontologo_id || 
        !updateData.fecha_consulta || !updateData.historial_id || !updateData.motivo) {
        return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
      }
  
      const [data] = await pool.query(
        `
        UPDATE consultas_odontologicas SET 
        paciente_id = ? ,odontologo_id = ? ,fecha_consulta = ? ,historial_id = ? ,motivo = ? 
        WHERE consulta_id = ?
        `,
        [updateData.paciente_id, updateData.odontologo_id, updateData.fecha_consulta, updateData.historial_id, updateData.motivo, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna consulta con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'consulta actualizada exitosamente',
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
        `DELETE FROM consultas_odontologicas WHERE consulta_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna consulta con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'consulta eliminada exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};