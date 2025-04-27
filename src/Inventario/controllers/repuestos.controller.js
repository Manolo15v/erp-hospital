import { pool } from "../../db.js";

export const getAll = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM Repuestos`);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontraron repuestos' });
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un repuesto por ID
export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }
    const [data] = await pool.query(`SELECT * FROM Repuestos WHERE Id_Repuesto = ?`, [id]);
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'No se encontró el repuesto' });
    }
    res.status(200).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Crear un nuevo repuesto
export const create = async (req, res) => {
  try {
    const { Nombre, Descripcion, Numero_de_Pieza, Unidades, Unidades_Minimas, Unidades_Maximas, Id_Ubicacion } = req.body;

    // Validación de campos requeridos
    if (!Nombre || !Descripcion || !Numero_de_Pieza || !Unidades || !Unidades_Minimas || !Unidades_Maximas || !Id_Ubicacion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    // Insertar en la base de datos
    const [data] = await pool.query(
      `
      INSERT INTO Repuestos (
        Nombre,
        Descripcion,
        Numero_de_Pieza,
        Unidades,
        Unidades_Minimas,
        Unidades_Maximas,
        Id_Ubicacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?);
      `,
      [Nombre, Descripcion, Numero_de_Pieza, Unidades, Unidades_Minimas, Unidades_Maximas, Id_Ubicacion]
    );

    // Respuesta con el repuesto creado
    const nuevoRepuesto = {
      Id_Repuesto: data.insertId,
      Nombre: Nombre,
      Descripcion: Descripcion,
      Numero_de_Pieza: Numero_de_Pieza,
      Unidades: Unidades,
      Unidades_Minimas: Unidades_Minimas,
      Unidades_Maximas: Unidades_Maximas,
      Id_Ubicacion: Id_Ubicacion,
    };

    res.status(201).json({
      message: 'Repuesto creado exitosamente',
      repuesto: nuevoRepuesto,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const { Nombre, Unidades, Unidades_Maximas } = req.body;

    // Validar que al menos un campo de actualización esté presente
    if (!id || (!Nombre && Unidades === undefined && Unidades_Maximas === undefined)) {
      return res.status(400).json({ error: 'ID y al menos un campo de actualización son requeridos' });
    }

    let query = "UPDATE Repuestos SET ";
    const updates = [];
    const params = [];
    const updatedFields = {}; // Objeto para almacenar solo los campos actualizados

    if (Nombre) {
      updates.push("Nombre = ?");
      params.push(Nombre);
      updatedFields.Nombre = Nombre; // Agregar al objeto de campos actualizados
    }
    if (Unidades !== undefined) {
      updates.push("Unidades = ?");
      params.push(Unidades);
      updatedFields.Unidades = Unidades;
    }
    if (Unidades_Maximas !== undefined) {
      updates.push("Unidades_Maximas = ?");
      params.push(Unidades_Maximas);
      updatedFields.Unidades_Maximas = Unidades_Maximas;
    }

    // Verificar si hay algo que actualizar
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar' });
    }

    query += updates.join(", ");
    query += " WHERE Id_Repuesto = ?";
    params.push(id);

    const [data] = await pool.query(query, params);

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró el repuesto con el ID proporcionado' });
    }

    // Respuesta con los campos actualizados
    res.status(200).json({
      message: 'Repuesto actualizado exitosamente',
      updatedData: {
        Id_Repuesto: id,
        ...updatedFields, // Solo incluir los campos que se actualizaron
      },
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
    const [data] = await pool.query(`DELETE FROM Repuestos WHERE Id_Repuesto = ?`, [id]);
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró el repuesto con el ID proporcionado' });
    }
    res.status(200).json({
      message: 'Repuesto eliminado exitosamente',
      deletedId: id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};