import { pool } from "../../db.js";
import { createHash } from 'crypto';
export const cargar = async (req, res) => {
    try {
      const [data] = await pool.query(`SELECT 
        u.*, 
        e.nombre,
        e.apellido,
        e.cedula,
        e.telefono,
        e.estado
    FROM 
        sistema_gestion_hospitalaria.usuarios u
    LEFT JOIN 
        sistema_gestion_hospitalaria.empleados e 
        ON u.empleado_id = e.empleado_id;`);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  export const agregar = async (req, res) => {
    try {
        const { usuario, clave,empleado_id,modulos } = req.body;

        if (!clave) {
            return res.status(400).json({
                success: false,
                error: "El campo clave es requerido"
            });
        }
        const clavesha=encriptar(clave)
        const [result] = await pool.query(
            `INSERT INTO usuarios 
            (usuario, clave, empleado_id, modulos) 
            VALUES (?, ?, ?, ?)`,
            [usuario, clavesha,empleado_id,modulos]
        );

        return res.status(201).json({
            success: true,
            id: result.insertId,
            message: "usuario creado exitosamente"
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({
            success: false,
            error: "Error al crear usuario"
        });
    }
};


export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, modulos } = req.body;
        
        const camposFaltantes = [];
        if (!id || isNaN(id)) camposFaltantes.push('ID válido');


        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`,
                camposFaltantes
            });
        }

        const [result] = await pool.query(
            `UPDATE usuarios SET 
             modulos = ?
            WHERE usuario_id = ?`,
            [modulos,id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "usuario actualizado correctamente",
            data: {
                usuario_id: id,
                usuario
            }
        });

    } catch (error) {
        console.error('Error al actualizar modulos:', error);
        return res.status(500).json({
            success: false,
            error: "Error al actualizar modulos"
        });
    }
};

export const actualizarClave = async (req, res) => {
    try {
        const { id } = req.params;
        const { clave } = req.body;
        
        const camposFaltantes = [];
        if (!id || isNaN(id)) camposFaltantes.push('ID válido');

        const clavesha=encriptar(clave)

        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`,
                camposFaltantes
            });
        }

        const [result] = await pool.query(
            `UPDATE usuarios SET 
                clave   = ?
            WHERE usuario_id = ?`,
            [clavesha,id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            message: "clave actualizado correctamente",
            data: {
                usuario_id: id,
            }
        });

    } catch (error) {
        console.error('Error al actualizar clave:', error);
        return res.status(500).json({
            success: false,
            error: "Error al actualizar clave"
        });
    }
};
export const obtener = async (req, res) => {
    try {
        const { id } = req.params;

        // Validación del ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "Se requiere un ID de usuario válido"
            });
        }

        const [result] = await pool.query(
            `SELECT 
                u.*, 
                e.nombre,
                e.apellido,
                e.cedula,
                e.email,
                e.estado
            FROM 
                sistema_gestion_hospitalaria.usuarios u
            LEFT JOIN 
                sistema_gestion_hospitalaria.empleados e 
                ON u.empleado_id = e.empleado_id

            WHERE usuario_id = ?;`,
            [id]
        );

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                error: "usuario no encontrado"
            });
        }

        return res.status(200).json({
            success: true,
            data: result[0]
        });

    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return res.status(500).json({
            success: false,
            error: "Error al obtener usuario"
        });
    }
};
function encriptar(clavePlana) {
    const hash = createHash('sha256')
      .update(clavePlana)
      .digest('hex');
    return hash;
  }
