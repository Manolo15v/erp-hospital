import { pool } from "../../db.js";

//Metodos para Modelos Equipos
export const getAll = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM Modelos_Equipos`);
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
    const [data] = await pool.query(`SELECT * FROM Modelos_Equipos WHERE Id_Modelo = ?`, [id]);
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createModelo = async (req, res) => {
  try {
    const { Modelo, Nombre, Descripcion, Codigo, Marca } = req.body;


    if (!Modelo || !Nombre || !Descripcion || !Codigo || !Marca ) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const [data] = await pool.query(
      `
      INSERT INTO Modelos_Equipos (
        Modelo,
        Nombre,
        Descripcion,
        Codigo,
        Marca,
        Unidades
      ) VALUES (?, ?, ?, ?, ?, ?);
      `,
      [Modelo, Nombre, Descripcion, Codigo, Marca, 0]
    );

    const modeloCreado = {
      Id_Modelo: data.insertId,
      Modelo: Modelo,
      Nombre: Nombre,
      Descripcion: Descripcion,
      Codigo: Codigo,
      Marca: Marca,
    };

    res.status(201).json({
      message: 'Modelo creado exitosamente',
      modelo: modeloCreado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const { Modelo, Nombre, Descripcion, Codigo, Marca, Unidades } = req.body;

    if (!id || !Modelo || !Nombre || !Descripcion || !Codigo || !Marca || !Unidades) {
      return res.status(400).json({ error: 'ID y todos los campos de actualización son requeridos' });
    }

    const [data] = await pool.query(
      `
      UPDATE Modelos_Equipos
      SET 
        Modelo = ?,
        Nombre = ?,
        Descripcion = ?,
        Codigo = ?,
        Marca = ?,
        Unidades = ?
      WHERE Id_Modelo = ?;
      `,
      [Modelo, Nombre, Descripcion, Codigo, Marca, Unidades, id]
    );

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ningún modelo con el ID proporcionado' });
    }

    res.status(200).json({
      message: 'Modelo actualizado exitosamente',
      updatedData: {
        Id_Modelo: id,
        Modelo: Modelo,
        Nombre: Nombre,
        Descripcion: Descripcion,
        Codigo: Codigo,
        Marca: Marca,
        Unidades: Unidades,
      },
    });
  } catch (error) {
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
      `DELETE FROM Modelos_Equipos WHERE Id_Modelo = ?`,
      [id]
    );

    // Verificar si se eliminó algún registro
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ningún modelo con el ID proporcionado' });
    }

    // Respuesta con mensaje de éxito
    res.status(200).json({
      message: 'Modelo eliminado exitosamente',
      deletedId: id,
    });
  } catch (error) {
    // Manejo de errores
    res.status(500).json({ error: error.message });
  }
};
