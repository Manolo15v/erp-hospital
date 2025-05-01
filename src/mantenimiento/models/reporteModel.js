import { pool } from '../../db.js'

export const listado_ordenes = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT mantenimiento_equipos.*, modelos_equipos.Nombre as equipos_nombre,
        ordenes_trabajo.fecha_ejecucion, ordenes_trabajo.fecha_fin, empleados.cedula, empleados.nombre, empleados.apellido,
        empleados.cargo, ordenes_trabajo.prioridad
      FROM mantenimiento_equipos
      left join equipos ON mantenimiento_equipos.Id_Equipo = equipos.Id_Equipo
      left join modelos_equipos ON equipos.Id_Equipo = modelos_equipos.Id_Modelo
      left join ordenes_trabajo on mantenimiento_equipos.mantenimiento_id = ordenes_trabajo.mantenimiento_id
      left join empleados on empleados.empleado_id = ordenes_trabajo.empleado_id
    `;
    
    pool.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error en la consulta SQL:', error);
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
