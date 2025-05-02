import { pool } from "../../db.js";

export const getAllHospitalizaciones = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM hospitalizaciones ORDER BY ISNULL(fecha_egreso) DESC, fecha_ingreso ASC, fecha_egreso DESC;`);
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getByIdHospitalizaciones = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM hospitalizaciones WHERE hospitalizacion_id = ?`, [id]); // Llama a readById del DAO
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export const createHospitalizaciones = async (req, res) => {
    try {
    const { paciente_id, motivo, diagnostico, notas_medicas, medicamentos, dieta, habitacion_id, cama_id} = req.body;
    if (!paciente_id || !motivo || !diagnostico || !notas_medicas || !medicamentos || !dieta || !habitacion_id || !cama_id) {
    return res.status(400).json({ error: 'paciente_id, motivo, diagnostico, notas_medicas, medicamentos, dieta, habitacion_id y cama_id son requeridos' });
    }
    const [data] = await pool.query(
    `INSERT INTO hospitalizaciones 
    (paciente_id, motivo, diagnostico, notas_medicas, medicamentos, dieta, habitacion_id, cama_id, estado, fecha_ingreso) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Activo', NOW())`,
    [paciente_id, motivo, diagnostico, notas_medicas, medicamentos, dieta, habitacion_id, cama_id]
    );

    const [row] = await pool.query(
        `SELECT * FROM hospitalizaciones WHERE hospitalizacion_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'Hospitalizacion realizada exitosamente',
        ubicacion: row[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const finalizarHospitalizacion = async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
      }
  
      const [data] = await pool.query(
        `UPDATE hospitalizaciones SET estado = 'Finalizado', fecha_egreso = NOW()
        WHERE hospitalizacion_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna hospitalización con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Paciente dado de alta exitosamente',
        updatedData: { id: id },
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};

export const deleteByIdHospitalizacion = async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
      }
  
      const [data] = await pool.query(
        `DELETE FROM hospitalizaciones WHERE hospitalizacion_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna hospitalización con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Hospitalización eliminada exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};
