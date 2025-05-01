import { pool } from '../../db.js'

export const obtenerOrdenesTrabajo = (prioridad = '') => {
    return new Promise((resolve, reject) => {
      let query = `
        select ordenes_trabajo.orden_id, 
          mantenimiento_equipos.mantenimiento_id,
          modelos_equipos.Nombre as nombre_equipo,
          CONCAT(empleados.nombre, ' ', empleados.apellido) as personal,
          ordenes_trabajo.fecha_ejecucion,
          ordenes_trabajo.fecha_fin,
          ordenes_trabajo.prioridad from ordenes_trabajo
        left join mantenimiento_equipos ON ordenes_trabajo.mantenimiento_id = mantenimiento_equipos.mantenimiento_id
        left join empleados ON ordenes_trabajo.empleado_id = empleados.empleado_id
        left join equipos ON mantenimiento_equipos.Id_Equipo = equipos.Id_Equipo
        left join modelos_equipos ON equipos.Id_Equipo = modelos_equipos.Id_Modelo
      `;
  
    if (prioridad && ['Alta', 'Media', 'Baja'].includes(prioridad)) {
    query += ` WHERE ordenes_trabajo.prioridad = '${prioridad}'`;
    }

    query += ` ORDER BY ordenes_trabajo.fecha_ejecucion DESC`;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error en la consulta SQL:', error);
            return reject({
            message: 'Error al obtener órdenes de trabajo',
            status: 500,
            sqlError: error.message
            });
        }
        resolve(results || []);
        });
    });
};

export const crearOrdenTrabajo = (datos) => {
    return new Promise((resolve, reject) => {
        const query = `
        INSERT INTO ordenes_trabajo (mantenimiento_id, empleado_id, fecha_ejecucion, fecha_fin, prioridad)
        VALUES (?, ?, ?, ?, ?)
        `;

        const values = [
        datos.mantenimiento_id,
        datos.empleado_id,
        datos.fecha_ejecucion,
        datos.fecha_fin,
        datos.prioridad || 'En proceso',
        ];

        pool.query(query, values, (error, results) => {
        if (error) return reject(error);
        resolve(results.insertId);
        });
    });
};

export const obtenerEmpleado = () => {
  return new Promise((resolve, reject) => {
      const query = `SELECT empleado_id, concat(nombre, ' ', apellido) as personal FROM empleados WHERE area = 'Mantenimiento'`;
      pool.query(query, (error, results) => {
      if (error) return reject(error);
      resolve(results);
      });
  });
};

export const cambiarPrioridadEliminada = async (id) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE ordenes_trabajo SET prioridad = ? WHERE orden_id = ?';
    const nuevoEstado = 'Eliminada';

    pool.query(query, [nuevoEstado, id], (error, result) => {
      if (error) return reject(error);
      resolve(result.affectedRows > 0);
    });
  });
};

export const cambiarPrioridadCompletado = async (id) => {
    return new Promise((resolve, reject) => {
      const query = 'UPDATE ordenes_trabajo SET prioridad = ? WHERE orden_id = ?';
      const nuevoEstado = 'Completado';
  
      pool.query(query, [nuevoEstado, id], (error, result) => {
        if (error) return reject(error);
        resolve(result.affectedRows > 0);
      });
    });
};