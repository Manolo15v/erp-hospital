import { pool } from "../../db.js";

// Obtener todas las asignaciones de ubicación de productos
export const getAllProductosUbicacion = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT pu.*, p.Fecha_Vencimiento, mp.Nombre AS Nombre_Producto, 
       a.Area, a.Ubicacion
      FROM Productos_Ubicacion pu
      JOIN Productos p ON pu.Id_Producto = p.Id_Producto
      JOIN Modelos_Productos mp ON p.Id_modelo_productos = mp.Id_Producto
      JOIN almacenes_ubicaciones a ON pu.Id_Ubicacion = a.Id_Ubicacion;`);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron asignaciones' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener asignaciones para una ubicación específica
export const getProductosUbicacionByUbicacionId = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID de la ubicación es requerido' });
    }
    const [data] = await pool.query(

      `SELECT pu.*, p.Fecha_Vencimiento, mp.Nombre AS Nombre_Producto, a.Area, a.Ubicacion
        FROM Productos_Ubicacion pu
        JOIN Productos p ON pu.Id_Producto = p.Id_Producto
        JOIN Modelos_Productos mp ON p.Id_modelo_productos = mp.Id_Producto
        JOIN almacenes_ubicaciones a ON pu.Id_Ubicacion = a.Id_Ubicacion
        WHERE a.Id_Ubicacion = ?`,
      [id]
    );
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron asignaciones para esta ubicación' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva asignación de producto-ubicación
export const createProductoUbicacion = async (req, res) => {
  try {
    const { Unidades_Por_Ubicacion, Id_Producto, Id_Ubicacion } = req.body;
    if (!Unidades_Por_Ubicacion || !Id_Producto || !Id_Ubicacion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const [data] = await pool.query(
      `
      INSERT INTO Productos_Ubicacion (Unidades_Por_Ubicacion, Id_Producto, Id_Ubicacion)
      VALUES (?, ?, ?);
      `,
      [Unidades_Por_Ubicacion, Id_Producto, Id_Ubicacion]
    );
    const nuevaAsignacion = {
      Id_Asignacion: data.insertId,
      Unidades_Por_Ubicacion: Unidades_Por_Ubicacion,
      Id_Producto: Id_Producto,
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
export const updateProductoUbicacionById = async (req, res) => {
  try {
    const { Id_Producto, Id_Ubicacion } = req.params;
    const { Unidades_Por_Ubicacion } = req.body;
    if (!Id_Producto || !Id_Ubicacion || !Unidades_Por_Ubicacion) {
      return res.status(400).json({ error: 'ID y datos de actualización son requeridos' });
    }
    const [data] = await pool.query(
      `
      UPDATE Productos_Ubicacion
      SET Unidades_Por_Ubicacion = ?
      WHERE Id_Producto = ? AND Id_Ubicacion = ?;
      `,
      [Unidades_Por_Ubicacion, Id_Producto, Id_Ubicacion]
    );
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró la asignación con los IDs proporcionados' });
    }
    res.status(200).json({
      message: 'Asignación actualizada exitosamente',
      updatedData: {
        Id_Producto: Id_Producto,
        Id_Ubicacion: Id_Ubicacion,
        Unidades_Por_Ubicacion: Unidades_Por_Ubicacion,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una asignación existente
export const deleteProductoUbicacionById = async (req, res) => {
  try {
    const { Id_Producto, Id_Ubicacion } = req.params;
    if (!Id_Producto || !Id_Ubicacion) {
      return res.status(400).json({ error: 'ID del producto y ID de la ubicación son requeridos' });
    }
    const [data] = await pool.query(
      `
      DELETE FROM Productos_Ubicacion
      WHERE Id_Producto = ? AND Id_Ubicacion = ?;
      `,
      [Id_Producto, Id_Ubicacion]
    );
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró la asignación con los IDs proporcionados' });
    }
    res.status(200).json({
      message: 'Asignación eliminada exitosamente',
      deletedIds: {
        Id_Producto: Id_Producto,
        Id_Ubicacion: Id_Ubicacion,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};