import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM solicitudes_laboratorio`);
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
    const { paciente_id  , medico_id, motivo, estado, fecha_solicitud, fecha_resultados, ayuno, observacion, tipo_id} = req.body;
    if (!paciente_id  || !medico_id || !motivo || !estado || !fecha_solicitud || !fecha_resultados || !ayuno || !observacion || !tipo_id) {
    return res.status(400).json({ error: 'paciente_id  , medico_id, motivo, estado, fecha_solicitud, fecha_resultados, ayuno, observacion y tipo_id es requerido' });
    }
    const [data] = await pool.query(
    `
    INSERT INTO solicitudes_laboratorio 
    (paciente_id  , medico_id, motivo, estado, fecha_solicitud, fecha_resultados, ayuno, observacion, tipo_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [paciente_id  , medico_id, motivo, estado, fecha_solicitud, fecha_resultados, ayuno, observacion, tipo_id]
    );

    const [row] = await pool.query(
        `SELECT * FROM solicitudes_laboratorio WHERE solicitud_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'solicitud creada exitosamente',
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
  
      if (!id || !updateData.paciente_id || !updateData.medico_id || !updateData.motivo || 
        !updateData.estado || !updateData.fecha_solicitud || !updateData.fecha_resultados || 
        !updateData.ayuno || !updateData.observacion || !updateData.tipo_id) {
        return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
      }
  
      const [data] = await pool.query(
        `
        UPDATE solicitudes_laboratorio SET 
        paciente_id  = ? , medico_id = ?, motivo = ?, estado = ?, fecha_solicitud = ?, fecha_resultados = ?, ayuno = ?, observacion = ?, tipo_id = ? 
        diente_id = ? ,numero_segmento = ?, valor_afectacion = ?
        WHERE solicitud_id = ?
        `,
        [updateData.paciente_id, updateData.medico_id, updateData.motivo, 
          updateData.estado, updateData.fecha_solicitud, updateData.fecha_resultados, 
          updateData.ayuno, updateData.observacion, updateData.tipo_id, id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun solicitud con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'solicitud actualizado exitosamente',
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
        `DELETE FROM solicitudes_laboratorio WHERE solicitud_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun solicitud con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'solicitud eliminado exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};