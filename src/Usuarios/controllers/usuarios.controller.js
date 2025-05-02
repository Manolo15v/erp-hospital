import { pool } from "../../db.js";

export const getAll = async (req, res) => {
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
            ON u.empleado_id = e.empleado_id;`
        );

      res.status(200).json(data);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

export const getById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validación del ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
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
            WHERE u.usuario_id = ?;`,
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
}

export const signIn = async (req, res) => {
    try {
        const { usuario, clave, empleado_id, modulos } = req.body;

        if (!usuario || !clave || !empleado_id || !modulos) {
            return res.status(400).json({ error: "Todos los campos son requerido"});
        }

        // const claveHash = encriptarContraseña(clave);

        const [result] = await pool.query(
            `INSERT INTO usuarios 
            (usuario, clave, empleado_id, modulos) 
            VALUES (?, ?, ?, ?)`,
            [usuario, clave, empleado_id, modulos]
        );

        return res.status(201).json({
            id: result.insertId,
            message: "Usuario creado exitosamente"
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({
            error: "Error al crear usuario"
        });
    }
}

export const logIn = async (req, res) => {
    try {
        const {  usuario, clave } = req.body;

        if (!usuario || !clave) {  
            return res.status(400).json({ error: "Todos los campos son requeridos"});
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
            WHERE u.usuario = ?`,
            [usuario]
        );

        if (result.length === 0) {
            return res.status(404).json({
                error: "usuario no encontrado"
            });
        }

        if (clave  !== result[0].clave) {
            return res.status(401).json({ error: "Contraseña incorrecta"});
        }

        return res.status(200).json({
            data: result[0]
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: `Error al obtener usuario, ${error.message}`
        });
    }
}

export const updateById = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario, modulos } = req.body;
        
        const camposFaltantes = [];
        if (!id || isNaN(id)) camposFaltantes.push('ID Inválido');


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
            [modulos, id]
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
}

export const deletedId = async (req, res) => {
    try {
        const { id } = req.params;

        // Validación del ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                error: "Se requiere un ID válido"
            });
        }

        const [result] = await pool.query(
            `DELETE FROM usuarios WHERE usuario_id = ?;`,
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontró ningún instrumento con el ID proporcionado' });
        }

        res.status(200).json({
            message: 'Instrumento eliminado exitosamente',
            deletedId: id,
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}