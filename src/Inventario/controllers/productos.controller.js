import { pool } from "../../db.js";

// Obtener todos los productos
export const getAllProductos = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT p.*, mp.Nombre, mp.Codigo, mp.Tipo_Producto
      FROM Productos p
      JOIN Modelos_Productos mp ON p.Id_modelo_productos = mp.Id_Producto;`
    );

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos' });
    }

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un producto por ID
export const getProductoById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }
    const [data] = await pool.query(`SELECT p.*, mp.Nombre, mp.Codigo, mp.Tipo_Producto
      FROM Productos p
      JOIN Modelos_Productos mp ON p.Id_modelo_productos = mp.Id_Producto
      WHERE p.Id_Producto = ?`, 
    [id]);

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener productos por ID de modelo
export const getProductosByModeloId = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID del modelo es requerido' });
    }
    const [data] = await pool.query(`SELECT p.*, mp.Nombre, mp.Codigo, mp.Tipo_Producto
    FROM Productos p
    JOIN Modelos_Productos mp ON p.Id_modelo_productos = mp.Id_Producto Productos WHERE mp.Id_modelo_productos = ?`, [id]);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron productos para este modelo' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo producto
export const createProducto = async (req, res) => {
  try {
    const { Id_modelo_productos, Unidades, Fecha_Vencimiento } = req.body;
    if (!Id_modelo_productos || !Unidades || !Fecha_Vencimiento) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    const [data] = await pool.query(
      `
      INSERT INTO Productos (Id_modelo_productos, Unidades, Fecha_Vencimiento)
      VALUES (?, ?, ?);
      `,
      [Id_modelo_productos, Unidades, Fecha_Vencimiento]
    );
    const nuevoProducto = {
      Id_Producto: data.insertId,
      Id_modelo_productos: Id_modelo_productos,
      Unidades: Unidades,
      Fecha_Vencimiento: Fecha_Vencimiento,
    };
    res.status(201).json({
      message: 'Producto creado exitosamente',
      producto: nuevoProducto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un producto por ID
export const updateProductoById = async (req, res) => {
  try {
    const id = req.params.id;
    const { Unidades, Fecha_Vencimiento } = req.body;
    if (!id || (!Unidades && !Fecha_Vencimiento)) {
      return res.status(400).json({ error: 'ID y al menos un campo de actualización son requeridos' });
    }

    let query = "UPDATE Productos SET ";
    const updates = [];
    const params = [];

    if (Unidades) {
      updates.push("Unidades = ?");
      params.push(Unidades);
    }
    if (Fecha_Vencimiento) {
      updates.push("Fecha_Vencimiento = ?");
      params.push(Fecha_Vencimiento);
    }

    query += updates.join(", ");
    query += " WHERE Id_Producto = ?";
    params.push(id);

    const [data] = await pool.query(query, params);

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró el producto con el ID proporcionado' });
    }

    res.status(200).json({
      message: 'Producto actualizado exitosamente',
      updatedData: {
        Id_Producto: id,
        Unidades: Unidades || null,
        Fecha_Vencimiento: Fecha_Vencimiento || null,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un producto por ID
export const deleteProductoById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }
    const [data] = await pool.query(`DELETE FROM Productos WHERE Id_Producto = ?`, [id]);
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró el producto con el ID proporcionado' });
    }
    res.status(200).json({
      message: 'Producto eliminado exitosamente',
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};