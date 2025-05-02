import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM dientes`);
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
    const { sector_id , numero_diente} = req.body;
    if (!sector_id || !numero_diente) {
    return res.status(400).json({ error: 'sector_id y numero_diente es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO dientes (sector_id , numero_diente) VALUES (?, ?)
    `,
    [sector_id , numero_diente]
    );

    const [row] = await pool.query(
        `SELECT * FROM dientes WHERE diente_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'diente creado exitosamente',
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
        UPDATE dientes SET 
        sector_id = ? ,numero_diente = ? 
        WHERE consulta_id = ?
        `,
        [updateData.sector_id, updateData.numero_diente, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun diente con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'diente actualizado exitosamente',
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
        `DELETE FROM dientes WHERE diente_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun diente con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'diente eliminado exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};