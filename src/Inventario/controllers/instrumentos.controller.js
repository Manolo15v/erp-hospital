import { pool } from "../../db.js";

export const getAll = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM Instrumentos`);
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
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }
    const [data] = await pool.query(`SELECT * FROM Instrumentos WHERE Id_Instrumento = ?`,[id]);
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'Instrumento no encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const create = async (req, res) => {
  try {
    const { Nombre, Descripcion, Codigo, Tipo_Instrumento, Unidades, Unidades_Minimas, Unidades_Maximas } = req.body;

    if (!Nombre || !Descripcion || !Codigo || !Tipo_Instrumento || !Unidades || !Unidades_Minimas || !Unidades_Maximas) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const [data] = await pool.query(
      `
      INSERT INTO Instrumentos (
        Nombre,
        Descripcion,
        Codigo,
        Tipo_Instrumento,
        Unidades,
        Unidades_Minimas,
        Unidades_Maximas
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [Nombre, Descripcion, Codigo, Tipo_Instrumento, Unidades, Unidades_Minimas, Unidades_Maximas]
    );

    const instrumentoCreado = {
      Id_Instrumento: data.insertId,
      Nombre: Nombre,
      Descripcion: Descripcion,
      Codigo: Codigo,
      Tipo_Instrumento: Tipo_Instrumento,
      Unidades: Unidades,
      Unidades_Minimas: Unidades_Minimas,
      Unidades_Maximas: Unidades_Maximas,
    };

    res.status(201).json({
      message: 'Instrumento creado exitosamente',
      instrumento: instrumentoCreado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const { Nombre, Descripcion, Codigo, Tipo_Instrumento, Unidades, Unidades_Minimas, Unidades_Maximas } = req.body;

    // Validación de campos obligatorios
    if (!id || !Nombre || !Descripcion || !Codigo || !Tipo_Instrumento || !Unidades || !Unidades_Minimas || !Unidades_Maximas) {
      return res.status(400).json({ error: 'ID y todos los campos de actualización son requeridos' });
    }

    // Actualizar el registro en la base de datos
    const [data] = await pool.query(
      `
      UPDATE Instrumentos
      SET 
        Nombre = ?,
        Descripcion = ?,
        Codigo = ?,
        Tipo_Instrumento = ?,
        Unidades = ?,
        Unidades_Minimas = ?,
        Unidades_Maximas = ?
      WHERE Id_Instrumento = ?;
      `,
      [Nombre, Descripcion, Codigo, Tipo_Instrumento, Unidades, Unidades_Minimas, Unidades_Maximas, id]
    );

    // Verificar si se actualizó algún registro
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ningún instrumento con el ID proporcionado' });
    }

    // Respuesta con mensaje de éxito y los datos actualizados
    res.status(200).json({
      message: 'Instrumento actualizado exitosamente',
      updatedData: {
        Id_Instrumento: id,
        Nombre: Nombre,
        Descripcion: Descripcion,
        Codigo: Codigo,
        Tipo_Instrumento: Tipo_Instrumento,
        Unidades: Unidades,
        Unidades_Minimas: Unidades_Minimas,
        Unidades_Maximas: Unidades_Maximas,
      },
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ error: error.message });
  }
};

export const deleteById = async (req, res) => {
  try {
    const id = req.params.id;

    // Validación de ID
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }

    // Eliminar el registro de la base de datos
    const [data] = await pool.query(
      `DELETE FROM Instrumentos WHERE Id_Instrumento = ?`,
      [id]
    );

    // Verificar si se eliminó algún registro
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ningún instrumento con el ID proporcionado' });
    }

    // Respuesta con mensaje de éxito
    res.status(200).json({
      message: 'Instrumento eliminado exitosamente',
      deletedId: id,
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ error: error.message });
  }
};