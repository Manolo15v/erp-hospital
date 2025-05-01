import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM segmentos`);
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
    const { diente_id  , numero_segmento, valor_afectacion} = req.body;
    if (!diente_id || !numero_segmento || !valor_afectacion) {
    return res.status(400).json({ error: 'diente_id  , numero_segmento y valor_afectacion es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO segmentos (diente_id, numero_segmento, valor_afectacion) VALUES (?, ?, ?)
    `,
    [diente_id  , numero_segmento, valor_afectacion]
    );

    const [row] = await pool.query(
        `SELECT * FROM segmentos WHERE segmento_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'segmento creado exitosamente',
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
  
      if (!id || !updateData.diente_id || !updateData.numero_segmento || !updateData.valor_afectacion) {
        return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
      }
  
      const [data] = await pool.query(
        `
        UPDATE segmentos SET 
        diente_id = ? ,numero_segmento = ?, valor_afectacion = ?
        WHERE segmento_id = ?
        `,
        [updateData.diente_id, updateData.numero_segmento, updateData.valor_afectacion, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun segmento con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'segmento actualizado exitosamente',
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
        `DELETE FROM segmentos WHERE segmento_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun segmento con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'segmento eliminado exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};