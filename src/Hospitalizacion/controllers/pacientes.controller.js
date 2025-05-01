import { pool } from "../../db.js";

export const getAllPacientes = async (req, res) => {
    try {
    const [data] = await pool.query(`SELECT * FROM pacientes `);
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
      const [data] = await pool.query(`SELECT * FROM pacientes WHERE paciente_id = ?`, [id]); // Llama a readById del DAO
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export const getByCedula = async (req, res) => {
    try {
      const cedula = req.params.cedula;
      const [data] = await pool.query(`SELECT * FROM pacientes WHERE cedula  = ?`, [cedula]); // Llama a readById del DAO
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export const createPaciente = async (req, res) => {
    try {
    const { nombre, apellido, genero, cedula, fecha_nacimiento, direccion, email, telefono } = req.body;
    if (!nombre || !apellido || !genero || !cedula || !fecha_nacimiento || !direccion || !email || !telefono) {
    return res.status(400).json({ error: 'nombre, apellido, genero, cedula, fecha_nacimiento, direccion, email y telefono del paciente es requerido' });
    }
    const [data] = await pool.query(
    `INSERT INTO pacientes 
    (nombre, apellido, genero, cedula, fecha_nacimiento, direccion, email, telefono) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nombre, apellido, genero, cedula, fecha_nacimiento, direccion, email, telefono]
    );

    const [row] = await pool.query(
        `SELECT * FROM pacientes WHERE paciente_id = ?`,
        [data.insertId]
    );

    res.status(201).json({
        message: 'Paciente añadido exitosamente',
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
  
      if (!id || !updateData.nombre || !updateData.apellido || !updateData.genero || !updateData.cedula || 
        !updateData.fecha_nacimiento || !updateData.direccion || !updateData.email || !updateData.telefono) {
        return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
      }
  
      const [data] = await pool.query(
        `UPDATE pacientes SET 
        nombre = ?, apellido = ?, genero = ?, cedula = ?, 
        fecha_nacimiento = ?, direccion = ?, email = ?, telefono = ? 
        WHERE paciente_id = ?`,
        [updateData.nombre, updateData.apellido, updateData.genero, updateData.cedula, 
          updateData.fecha_nacimiento, updateData.direccion, updateData.email, updateData.telefono,
          id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningun paciente con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Paciente actualizado exitosamente',
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
        `DELETE FROM pacientes WHERE paciente_id = ?`,
        [id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningún paciente con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'Paciente eliminado exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
};