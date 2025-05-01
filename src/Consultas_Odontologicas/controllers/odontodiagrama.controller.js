import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM odontodiagrama`);
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
    const { paciente_id  , fecha_creacion, historial_id} = req.body;
    if (!paciente_id || !fecha_creacion || !historial_id) {
    return res.status(400).json({ error: 'paciente_id  , fecha_creacion y historial_id es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO odontodiagrama (paciente_id  , fecha_creacion, historial_id) VALUES (?, ?, ?)
    `,
    [paciente_id  , fecha_creacion, historial_id]
    );

    const [row] = await pool.query(
        `SELECT * FROM odontodiagrama WHERE odontodiagrama_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'odontodiagrama creado exitosamente',
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
  
      if (!id || !updateData.sector_id || !updateData.numero_diente) {
        return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
      }
  
      const [data] = await pool.query(
        `
        UPDATE odontodiagrama SET 
        paciente_id = ? ,fecha_creacion = ?, historial_id = ? 
        WHERE consulta_id = ?
        `,
        [updateData.paciente_id, updateData.fecha_creacion, updateData.historial_id, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun odontodiagrama con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'odontodiagrama actualizado exitosamente',
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
        `DELETE FROM odontodiagrama WHERE odontodiagrama_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun odontodiagrama con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'odontodiagrama eliminado exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};