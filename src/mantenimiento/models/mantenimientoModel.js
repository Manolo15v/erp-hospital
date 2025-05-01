import { pool } from '../../db.js'

export const obtenerMantenimientos = () => {
  return new Promise((resolve, reject) => {
    const query = `
      select mantenimiento_equipos.mantenimiento_id, 
        mantenimiento_equipos.tipomantenimiento, 
        modelos_equipos.Nombre as nombre_equipo,
        mantenimiento_equipos.fecha_creacion,
        mantenimiento_equipos.Estado,
        mantenimiento_equipos.ubicacion,
        mantenimiento_equipos.descripcion,
        mantenimiento_equipos.observaciones,
        repuestos.Nombre as nombre_repuesto
      from mantenimiento_equipos 
        left join equipos on mantenimiento_equipos.Id_Equipo = equipos.Id_Equipo
        left join modelos_equipos on equipos.Id_Equipo = modelos_equipos.Id_Modelo
        left join repuestos on mantenimiento_equipos.Id_Repuesto = repuestos.Id_Repuesto
        `;
    
      pool.query(query, (error, results, fields) => {
      if (error) {
        return reject({
          message: 'Error al obtener mantenimientos',
          status: 500,
          sqlError: error.message
        });
      }
      resolve(results || []); 
    });
  });
};

export const obtenerEquipos = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT DISTINCT modelos_equipos.Id_Modelo, modelos_equipos.Nombre
      FROM equipos INNER JOIN modelos_equipos ON equipos.Id_Modelo = modelos_equipos.Id_Modelo
    `;
    connection.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

export const obtenerRepuestos = () => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT Id_Repuesto, nombre FROM repuestos';
    pool.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });
};

export const crearOrdenMantenimiento = (datos) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT Id_Equipo FROM equipos 
       WHERE Id_Modelo = ?
       LIMIT 1`,
      [datos.Id_Modelo],
      (error, equipos) => {
        if (error) return reject(error);
        const equipoId = equipos.length > 0 ? equipos[0].Id_Equipo : null;

        const query = `
          INSERT INTO mantenimiento_equipos 
            (descripcion,
            tipomantenimiento,
            fecha_creacion,
            estado,
            ubicacion,
            observaciones,
            Id_Equipo,
            Id_Repuesto
            )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const values = [
          datos.descripcion,
          datos.tipomantenimiento,
          datos.fecha_creacion,
          datos.estado || 'Pendiente',
          datos.ubicacion,
          datos.observaciones,
          equipoId,
          datos.Id_Repuesto || null 
        ];

        connection.query(query, values, (error, results) => {
          if (error) return reject(error);
          resolve(results.insertId);
        });
      }
    );
  });
};

export const eliminarOrdenMantenimiento = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'DELETE FROM mantenimiento_equipos WHERE mantenimiento_id = ?';
    pool.query(query, [id], (error, results) => {
      if (error) return reject(error);
      resolve(results.affectedRows > 0);
    });
  });
};

export const obtenerIdEdicion = (id) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT mantenimiento_equipos.*, equipos.Id_Modelo 
                    FROM mantenimiento_equipos
                    LEFT JOIN equipos ON mantenimiento_equipos.Id_Equipo = equipos.Id_Equipo
                    WHERE mantenimiento_equipos.mantenimiento_id = ?`;
      pool.query(query, [id], (error, results) => {
      if (error) return reject(error);
      if (results.length === 0) return reject(new Error('Mantenimiento no encontrado'));
      resolve(results[0]);
    });
  });
};

export const actualizarMantenimiento = (id, datos) => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT Id_Equipo FROM equipos 
       WHERE Id_Modelo = ? 
       LIMIT 1`,
      [datos.Id_Modelo],
      (error, equipos) => {
        if (error) return reject(error);
        const equipoId = equipos.length > 0 ? equipos[0].Id_Equipo : null;

        const query = `
          UPDATE mantenimiento_equipos
          SET 
            descripcion = ?,
            tipomantenimiento = ?,
            fecha_creacion = ?,
            estado = ?,
            ubicacion = ?,
            observaciones = ?,
            Id_Equipo = ?,
            Id_Repuesto = ?
          WHERE mantenimiento_id = ?`;

        const values = [
          datos.descripcion,
          datos.tipomantenimiento,
          datos.fecha_creacion,
          datos.estado,
          datos.ubicacion,
          datos.observaciones,
          equipoId,
          datos.Id_Repuesto || null,
          id
        ];

        pool.query(query, values, (error, results) => {
          if (error) return reject(error);
          if (results.affectedRows === 0) {
            return reject(new Error('Mantenimiento no encontrado o no actualizado'));
          }
          resolve({ success: true, updated: results });
        });
      }
    );
  });
};

export const cambiarEstadoSolicitud = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE mantenimiento_equipos SET estado = ? WHERE mantenimiento_id = ?';
    const nuevoEstado = 'En proceso';

    pool.query(query, [nuevoEstado, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.affectedRows > 0);
    });
  });
};

export const cambiarEstadoEliminado = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE mantenimiento_equipos SET estado = ? WHERE mantenimiento_id = ?';
    const nuevoEstado = 'Eliminado';
    pool.query(query, [nuevoEstado, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.affectedRows > 0);
    });
  });
};

export const cambiarEstadoCompletado = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE mantenimiento_equipos SET estado = ? WHERE mantenimiento_id = ?';
    const nuevoEstado = 'Completado';
    pool.query(query, [nuevoEstado, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.affectedRows > 0);
    });
  });
};