import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM sectores`);
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
    const { odontodiagrama_id  , nombre_sector} = req.body;
    if (!odontodiagrama_id || !nombre_sector) {
    return res.status(400).json({ error: 'odontodiagrama_id y nombre_sector es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO sectores (odontodiagrama_id  , nombre_sector) VALUES (?, ?)
    `,
    [odontodiagrama_id  , nombre_sector]
    );

    const [row] = await pool.query(
        `SELECT * FROM sectores WHERE sector_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'sector creado exitosamente',
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
  
      if (!id || !updateData.odontodiagrama_id || !updateData.nombre_sector) {
        return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
      }
  
      const [data] = await pool.query(
        `
        UPDATE sectores SET 
        odontodiagrama_id = ? ,nombre_sector = ? 
        WHERE sector_id = ?
        `,
        [updateData.odontodiagrama_id, updateData.nombre_sector, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun sector con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'sector actualizado exitosamente',
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
        `DELETE FROM sectores WHERE sector_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun sector con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'sector eliminado exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};