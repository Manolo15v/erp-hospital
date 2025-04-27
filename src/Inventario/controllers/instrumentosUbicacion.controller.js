import { pool } from "../../db.js";

// Obtener todas las asignaciones de ubicación de instrumentos
export const getAllUbicaciones = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT iu.*, i.Nombre AS Nombre_Instrumento, i.Tipo_Instrumento,
             a.Area, a.Ubicacion AS Nombre_Ubicacion
      FROM Instrumentos_Ubicacion iu
      JOIN Instrumentos i ON iu.Id_Instrumento = i.Id_Instrumento
      JOIN almacenes_ubicaciones a ON iu.Id_Ubicacion = a.Id_Ubicacion;
    `);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron asignaciones' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener asignaciones para un instrumento específico
export const getUbicacionesByInstrumentoId = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID del instrumento es requerido' });
    }
    const [data] = await pool.query(
      `
      SELECT iu.*, i.Nombre AS Nombre_Instrumento, i.Tipo_Instrumento,
             a.Area, a.Ubicacion AS Nombre_Ubicacion
      FROM Instrumentos_Ubicacion iu
      JOIN Instrumentos i ON iu.Id_Instrumento = i.Id_Instrumento
      JOIN almacenes_ubicaciones a ON iu.Id_Ubicacion = a.Id_Ubicacion
      WHERE iu.Id_Instrumento = ?;
      `,
      [id]
    );
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron ubicaciones para este instrumento' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener asignaciones para una ubicación específica
export const getUbicacionesByUbicacionId = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID de la ubicación es requerido' });
    }
    const [data] = await pool.query(
      `
      SELECT iu.*, i.Nombre AS Nombre_Instrumento, i.Tipo_Instrumento,
             a.Area, a.Ubicacion AS Nombre_Ubicacion
      FROM Instrumentos_Ubicacion iu
      JOIN Instrumentos i ON iu.Id_Instrumento = i.Id_Instrumento
      JOIN almacenes_ubicaciones a ON iu.Id_Ubicacion = a.Id_Ubicacion
      WHERE iu.Id_Ubicacion = ?;
      `,
      [id]
    );
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron instrumentos en esta ubicación' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva asignación de ubicación de instrumento
export const createUbicacion = async (req, res) => {
  try {
    const { Unidades_Por_Ubicacion, Id_Instrumento, Id_Ubicacion } = req.body;

    
    const [data] = await pool.query(
      `
      INSERT INTO Instrumentos_Ubicacion (Unidades_Por_Ubicacion, Id_Instrumento, Id_Ubicacion)
      VALUES (?, ?, ?);
      `,
      [Unidades_Por_Ubicacion, Id_Instrumento, Id_Ubicacion]
    );
    const nuevaAsignacion = {
      Id_Asignacion: data.insertId,
      Unidades_Por_Ubicacion: Unidades_Por_Ubicacion,
      Id_Instrumento: Id_Instrumento,
      Id_Ubicacion: Id_Ubicacion,
    };
    res.status(201).json({
      message: 'Asignación creada exitosamente',
      asignacion: nuevaAsignacion,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una asignación existente
export const updateUbicacionById = async (req, res) => {
  try {
    const { Id_Instrumento, Id_Ubicacion } = req.params;
    const { Unidades_Por_Ubicacion } = req.body;
    if (!Id_Instrumento || !Id_Ubicacion || !Unidades_Por_Ubicacion) {
      return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
    }
    const [data] = await pool.query(
      `
      UPDATE Instrumentos_Ubicacion
      SET Unidades_Por_Ubicacion = ?
      WHERE Id_Instrumento = ? AND Id_Ubicacion = ?;
      `,
      [Unidades_Por_Ubicacion, Id_Instrumento, Id_Ubicacion]
    );
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró la asignación con los IDs proporcionados' });
    }
    res.status(200).json({
      message: 'Asignación actualizada exitosamente',
      updatedData: {
        Id_Instrumento: Id_Instrumento,
        Id_Ubicacion: Id_Ubicacion,
        Unidades_Por_Ubicacion: Unidades_Por_Ubicacion,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una asignación existente
export const deleteUbicacionById = async (req, res) => {
  try {
    const { Id_Instrumento, Id_Ubicacion } = req.params;
    if (!Id_Instrumento || !Id_Ubicacion) {
      return res.status(400).json({ error: 'ID del instrumento y ID de la ubicación son requeridos' });
    }
    const [data] = await pool.query(
      `
      DELETE FROM Instrumentos_Ubicacion
      WHERE Id_Instrumento = ? AND Id_Ubicacion = ?;
      `,
      [Id_Instrumento, Id_Ubicacion]
    );
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró la asignación con los IDs proporcionados' });
    }
    res.status(200).json({
      message: 'Asignación eliminada exitosamente',
      deletedIds: {
        Id_Instrumento: Id_Instrumento,
        Id_Ubicacion: Id_Ubicacion,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};