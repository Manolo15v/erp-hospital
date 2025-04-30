import { pool } from "../../db.js";

export const getAllExamenes = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM examenes_hospitalizacion`);
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getByHospitalizacionId = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM examenes_hospitalizacion WHERE hospitalizacion_id = ?`, [id]); 
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export const getByHospitalizacionIdAndTitle = async (req, res) => {
    try {
      const { id, titulo } = req.params;
      const [data] = await pool.query(`SELECT * FROM examenes_hospitalizacion WHERE hospitalizacion_id = ? AND titulo = ?`, [id,titulo]); // Llama a readById del DAO
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export const createExamen = async (req, res) => {
    try {
    const { hospitalizacion_id, nombre, apellido, cedula, fecha, titulo, parametros } = req.body;
    if (!hospitalizacion_id || !nombre || !apellido || !cedula || !fecha || !titulo || !parametros) {
    return res.status(400).json({ error: 'hospitalizacion_id, nombre, apellido, cedula, fecha, titulo y parametros del examen es requerido' });
    }
    const [data] = await pool.query(
    `INSERT INTO examenes_hospitalizacion (hospitalizacion_id, nombre, apellido, cedula, fecha, titulo, parametros) 
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [hospitalizacion_id, nombre, apellido, cedula, fecha, titulo, parametros]
    );
    res.status(201).json({
      message: 'Examen creada exitosamente',
  });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const updateByHospitalizacionId = async (req, res) => {
    try {
      const { id, titulo } = req.params;
      const updateData = req.body;
  
      if (!id || !titulo ||!updateData.parametros) {
        return res.status(400).json({ error: 'ID, Títulos y parámetros de los examenes son requeridos' });
      }
  
      const [data] = await pool.query(
        `UPDATE examenes_hospitalizacion SET parametros = ?, fecha = NOW() WHERE hospitalizacion_id = ? AND titulo = ?  `,
        [updateData.parametros, id, titulo]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningún examen con el ID proporcionado o el título Proporcionado' });
      }
  
      res.status(200).json({
        message: 'Examen actualizado exitosamente',
        updatedData: { id: id, ...updateData },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
