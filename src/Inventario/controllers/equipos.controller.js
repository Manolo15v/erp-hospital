import { pool } from "../../db.js";


//Metodos para Equipos
export const getAllEquipos = async (req, res) => {
  try {
    const [data] = await pool.query(`
      SELECT
        e.*,
        me.Modelo,
        me.Nombre AS Nombre_Modelo,
        me.Marca,
        a.Area,
        a.Ubicacion
      FROM
        Equipos e
        JOIN Modelos_Equipos me ON e.Id_Modelo = me.Id_Modelo
        JOIN almacenes_ubicaciones a ON e.Id_Ubicacion = a.Id_Ubicacion;
      `);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getEquiposById = async (req, res) => {
  try {
    const id = req.params.id;
    const [data] = await pool.query(`
      SELECT
        e.*,
        me.Modelo,
        me.Nombre AS Nombre_Modelo,
        me.Marca,
        a.Area,
        a.Ubicacion
      FROM
        Equipos e
        JOIN Modelos_Equipos me ON e.Id_Modelo = me.Id_Modelo
        JOIN almacenes_ubicaciones a ON e.Id_Ubicacion = a.Id_Ubicacion
      WHERE e.Id_Equipo = ?;
      `, [id]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const getEquipoByModeloId = async (req, res) => {
  try {
    const id = req.params.id;
    const [data] = await pool.query(`
      SELECT
        e.*,
        me.Modelo,
        me.Nombre AS Nombre_Modelo,
        me.Marca,
        a.Area,
        a.Ubicacion
      FROM
        Equipos e
        JOIN Modelos_Equipos me ON e.Id_Modelo = me.Id_Modelo
        JOIN almacenes_ubicaciones a ON e.Id_Ubicacion = a.Id_Ubicacion
      WHERE me.Id_Modelo = ?;
      `, [id]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createEquipo = async (req, res) => {
  try {
    const { FechaInstalacion, Estado, FrecuenciaMantenimiento, NumeroDeSerie, idModelo, idUbicacion } = req.body;

    if (!FechaInstalacion || !Estado || !FrecuenciaMantenimiento || !NumeroDeSerie || !idModelo || !idUbicacion) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    const [data] = await pool.query(
      `
      INSERT INTO
        Equipos (
          Fecha_Instalacion,
          Estado,
          Frecuencia_mantenimiento,
          Numero_de_serie,
          Id_Modelo,
          Id_Ubicacion
        )
      VALUES
        (?, ?, ?, ?, ?, ?);
      `,
      [FechaInstalacion, Estado, FrecuenciaMantenimiento, NumeroDeSerie, idModelo, idUbicacion]
    );

    const equipoCreado = {
      Id_Equipo: data.insertId,
      Fecha_Instalacion: FechaInstalacion,
      Estado: Estado,
      Frecuencia_mantenimiento: FrecuenciaMantenimiento,
      Numero_de_serie: NumeroDeSerie,
      Id_Modelo: idModelo,
      Id_Ubicacion: idUbicacion,
    };

    res.status(201).json({
      message: 'Equipo creado exitosamente',
      equipo: equipoCreado,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEquipoById = async (req, res) => {
  try {
    const id = req.params.id;
    const { Estado, Frecuencia_mantenimiento } = req.body;

    if (!id || !Estado || !Frecuencia_mantenimiento) {
      return res.status(400).json({ error: 'ID, Estado y Frecuencia_mantenimiento son requeridos' });
    }

    const [data] = await pool.query(
      `
      UPDATE
        Equipos
      SET
        Estado = ?,
        Frecuencia_mantenimiento = ?
      WHERE
        Id_Equipo = ?;
      `,
      [Estado, Frecuencia_mantenimiento, id]
    );

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: 'No se encontró ningún equipo con el ID proporcionado' });
    }

    res.status(200).json({
      message: 'Equipo actualizado exitosamente',
      updatedData: {
        Id_Equipo: id,
        Estado: Estado,
        Frecuencia_mantenimiento: Frecuencia_mantenimiento,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEquipoById = async (req, res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }
    await pool.query(`DELETE FROM Equipos WHERE Id_Equipo = ?`,[id]);
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}