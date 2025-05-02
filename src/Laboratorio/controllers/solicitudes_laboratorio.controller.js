import { pool } from "../../db.js";

export const getAll = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT 
        sl.solicitud_id
        p.nombre AS paciente,
        p.apellido,
        sl.modulo_solicitante,
        tp.nombre AS prueba,
        sl.fecha_solicitud,
        sl.estado
      FROM solicitudes_laboratorio sl
      INNER JOIN pacientes p ON sl.paciente_id = p.paciente_id
      INNER JOIN tipo_prueba tp ON sl.tipo_id = tp.tipo_id
    `);
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getById = async (req, res) => {
    try {
        const id = req.params.id;
        const [data] = await pool.query(`SELECT 
            sl.solicitud_id
            p.nombre AS paciente,
            p.apellido,
            sl.modulo_solicitante,
            tp.nombre AS prueba,
            sl.fecha_solicitud,
            sl.estado
            FROM solicitudes_laboratorio sl
            INNER JOIN pacientes p ON sl.paciente_id = p.paciente_id
            INNER JOIN tipo_prueba tp ON sl.tipo_id = tp.tipo_id
            WHERE sl.solicitud_id = ?
        `, [id]); 
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
  
        res.status(200).json(data);
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
}
  

export const getByModulo = async (req, res) => {
  try {
    const modulo = req.params.modulo;
    const [data] = await pool.query(`SELECT 
        sl.solicitud_id
        p.nombre AS paciente,
        p.apellido,
        sl.modulo_solicitante,
        tp.nombre AS prueba,
        sl.fecha_solicitud,
        sl.estado
      FROM solicitudes_laboratorio sl
      INNER JOIN pacientes p ON sl.paciente_id = p.paciente_id
      INNER JOIN tipo_prueba tp ON sl.tipo_id = tp.tipo_id
      WHERE sl.modulo_solicitante = ?
    `, [modulo]); 
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
    const { Paciente_id, Medico_id, Modulo_solicitante, Motivo, Estado, Fecha_solicitud, Tipo_id } = req.body;
    if (!Paciente_id || !Medico_id || !Modulo_solicitante || !Motivo || !Estado || !Fecha_solicitud || !Tipo_id) {
      return res.status(400).json({ error: 'Paciente_id, Medico_id, Modulo_solicitante, Motivo, Estado, Fecha_solicitud y Tipo_id son requeridos' });
    }
    const [data] = await pool.query(
        `INSERT INTO solicitudes_laboratorio (
            paciente_id,
            medico_id,
            modulo_solicitante,
            motivo,
            estado,
            fecha_solicitud,
            tipo_id
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?
          )`,
      [Paciente_id, Medico_id, Modulo_solicitante, Motivo, Estado, Fecha_solicitud, Tipo_id]
    );

    const [row] = await pool.query(
      `SELECT * FROM solicitudes_laboratorio WHERE solicitud_id = ?`,
      [data.insertId]
    );

    res.status(201).json({
      message: 'Solicitud creada exitosamente',
      ubicacion: row[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const {  estado , fecha_resultados, observacion } = req.body;

    if (!id || !estado || !fecha_resultados || !observacion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const [data] = await pool.query(
      `
        UPDATE solicitudes_laboratorio 
        SET 
         estado = ?,
         fecha_resultados = ?,
         observacion = ?
        WHERE solicitud_id = ?;
      `,
      [estado , fecha_resultados, observacion, id]
    );

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ninguna ubicación con el ID proporcionado' });
    }

    res.status(200).json({
      message: 'Solicitud actualizada exitosamente',
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
      return res.status(404).json({ error: 'No se encontró ninguna ubicación con el ID proporcionado' });
    }

    res.status(200).json({
      message: 'Solicitud eliminada exitosamente',
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};