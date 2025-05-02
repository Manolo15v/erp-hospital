import { pool } from "../../db.js";

export const getAll = async (req, res) => {
  try {
  const [data] = await pool.query(`SELECT * FROM signos_vitales ORDER BY hospitalizacion_id`);
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
      const [data] = await pool.query(`SELECT * FROM signos_vitales WHERE hospitalizacion_id = ? ORDER BY fecha DESC`, [id]); // Llama a readById del DAO
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
    const { hospitalizacion_id, frecuencia_cardiaca, presion_arterial, 
      frecuencia_respiratoria, temperatura_corporal, saturacion_oxigeno, 
      balance_hidrico } = req.body;
    if (!hospitalizacion_id || !frecuencia_cardiaca || !presion_arterial || 
      !frecuencia_respiratoria || !temperatura_corporal || !saturacion_oxigeno || 
      !balance_hidrico) {
    return res.status(400).json({ error: 'Error en la creacion de signos viatales' });
    }
    const [data] = await pool.query(
    `INSERT INTO signos_vitales 
    (hospitalizacion_id, frecuencia_cardiaca, presion_arterial, frecuencia_respiratoria, 
    temperatura_corporal, saturacion_oxigeno, balance_hidrico, fecha) 
    VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
    [hospitalizacion_id, frecuencia_cardiaca, presion_arterial, 
      frecuencia_respiratoria, temperatura_corporal, saturacion_oxigeno, 
      balance_hidrico]
    );

    const [row] = await pool.query(
        `SELECT * FROM signos_vitales WHERE hospitalizacion_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'Signos Vitales Añadidos exitosamente',
        ubicacion: row[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}