import { pool } from "../../db.js";

export const getAll = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM almacenes_ubicaciones`);
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
    const [data] = await pool.query(`SELECT * FROM almacenes_ubicaciones WHERE Id_Ubicacion = ?;`, [id]); // Llama a readById del DAO
    if (!data || data.length == 0) {
      return res.status(404).json({ error: 'No encontrado' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getByArea = async (req, res) => {
  try {
    const area = req.params.area;
    const [data] = await pool.query(`SELECT * FROM almacenes_ubicaciones WHERE Area = ?`, [area]); // Llama a readByArea del DAO
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
    const { Area, Ubicacion } = req.body;
    if (!Area || !Ubicacion) {
      return res.status(400).json({ error: 'Area y Ubicacion son requeridos' });
    }
    const [data] = await pool.query(
      `
      INSERT INTO
        almacenes_ubicaciones (Area, Ubicacion)
      VALUES
        (?, ?)
      `,
      [Area, Ubicacion]
    );
    const [row] = await pool.query(
      `SELECT * FROM almacenes_ubicaciones WHERE Id_Ubicacion = ?`,
      [data.insertId]
    );
    res.status(201).json({
      message: 'Ubicación creada exitosamente',
      ubicacion: row[0],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    if (!id || !updateData.Area || !updateData.Ubicacion) {
      return res.status(400).json({ error: 'ID y datos de actualización (Area y Ubicacion) son requeridos' });
    }

    const [data] = await pool.query(
      `
      UPDATE
        almacenes_ubicaciones
      SET
        Area = ?,
        Ubicacion = ?
      WHERE
        Id_Ubicacion = ?
      `,
      [updateData.Area, updateData.Ubicacion, id]
    );

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ninguna ubicación con el ID proporcionado' });
    }

    res.status(200).json({
      message: 'Ubicación actualizada exitosamente',
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
      `DELETE FROM almacenes_ubicaciones WHERE Id_Ubicacion = ?`,
      [id]
    );

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ninguna ubicación con el ID proporcionado' });
    }

    res.status(200).json({
      message: 'Ubicación eliminada exitosamente',
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};