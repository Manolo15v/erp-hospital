import { pool } from "../../db.js";

export const cargar = async (req, res) => {
    try {
      const [data] = await pool.query(`SELECT rol_id,nombre FROM roles;`);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export const agregar = async (req, res) => {
    let connection;
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                error: "El campo nombre es requerido"
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [result] = await connection.query(
                `INSERT INTO roles 
            (nombre, descripcion) 
            VALUES (?, ?)`,
            [nombre, descripcion]
            );

            await connection.commit();

            return res.status(201).json({
                success: true,
                id: result.insertId,
                message: "rol creado exitosamente"
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }

    } catch (error) {
        console.error('Error al crear rol:', error);
        return res.status(500).json({
            success: false,
            error: "Error al crear rol",
        });
    }
};


export const actualizar = async (req, res) => {
    let connection;
    try {
        const { id, nombre, descripcion } = req.body;

        const camposFaltantes = [];
        if (!id || isNaN(id)) camposFaltantes.push('ID válido');
        if (!nombre) camposFaltantes.push('nombre');
        if (!descripcion) camposFaltantes.push('descripción');

        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`,
                camposFaltantes
            });
        }

        connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [result] = await connection.query(
                `UPDATE roles SET 
                    nombre = ?,
                    descripcion = ?
                WHERE rol_id = ?`,
                [nombre, descripcion, id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    error: "rol no encontrado"
                });
            }

            await connection.commit();

            return res.status(200).json({
                success: true,
                message: "rol actualizado correctamente",
                data: {
                    rol_id: id,
                    nombre,
                    descripcion
                }
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }

    } catch (error) {
        console.error('Error al actualizar rol:', error);
        return res.status(500).json({
            success: false,
            error: "Error al actualizar rol",
        });
    }
};
export const obtener = async (req, res) => {
    let connection;
    try {
        const { id } = req.params;

        // Validación del ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "Se requiere un ID de rol válido"
            });
        }

        connection = await pool.getConnection();

        try {
            const [result] = await connection.query(
                `SELECT rol_id, nombre, descripcion FROM roles WHERE rol_id = ?`,[id]
            );

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "rol no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: result[0]
            });

        } catch (error) {
            throw error;
        } finally {
            if (connection) connection.release();
        }

    } catch (error) {
        console.error('Error al obtener rol:', error);
        return res.status(500).json({
            success: false,
            error: "Error al obtener rol",
        });
    }
};