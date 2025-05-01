import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM consumos_consultas_odontologicas`);
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
    const { consulta_id , Id_Producto, consumidos, fecha_consumo} = req.body;
    if (!consulta_id || !Id_Producto || !consumidos || !fecha_consumo) {
    return res.status(400).json({ error: 'consulta_id , Id_Producto, consumidos y fecha_consumo es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO consumos_consultas_odontologicas (consulta_id , Id_Producto, consumidos, fecha_consumo) VALUES (?, ?, ?, ?)
    `,
    [consulta_id , Id_Producto, consumidos, fecha_consumo]
    );

    const [row] = await pool.query(
        `SELECT * FROM consumos_consultas_odontologicas WHERE consulta_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'consumo creada exitosamente',
        ubicacion: row[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateByConsultaId = async (req, res) => {
    try {
      const id = req.params.id;
      const updateData = req.body;
  
      if (!id || !updateData.Id_Producto || !updateData.consumidos || !updateData.fecha_consumo) {
        return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
      }
  
      const [data] = await pool.query(
        `
        UPDATE consumos_consultas_odontologicas SET 
        Id_Producto = ? ,consumidos = ? ,fecha_consumo = ? 
        WHERE consulta_id = ?
        `,
        [updateData.Id_Producto, updateData.consumidos, updateData.fecha_consumo, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun consumo con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Consumo actualizada exitosamente',
        updatedData: { id: id, ...updateData },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};


export const deleteByConsultaId = async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
      }
  
      const [data] = await pool.query(
        `DELETE FROM consumos_consultas_odontologicas WHERE consulta_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna consumo con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'consumo eliminado exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};