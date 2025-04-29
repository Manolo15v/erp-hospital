import { pool } from "../../db.js";

export const cargar = async (req, res) => {
    try {
      const [data] = await pool.query(`SELECT departamento_id,nombre FROM departamentos;`);
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
                `INSERT INTO departamentos 
                (nombre, descripcion) 
                VALUES (?, ?)`,
                [nombre, descripcion]
            );

            await connection.commit();

            return res.status(201).json({
                success: true,
                id: result.insertId,
                message: "Departamento creado exitosamente"
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }

    } catch (error) {
        console.error('Error al crear departamento:', error);
        return res.status(500).json({
            success: false,
            error: "Error al crear departamento",
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
                `UPDATE departamentos SET 
                    nombre = ?,
                    descripcion = ?
                WHERE departamento_id = ?`,
                [nombre, descripcion, id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    error: "Departamento no encontrado"
                });
            }

            await connection.commit();

            return res.status(200).json({
                success: true,
                message: "Departamento actualizado correctamente",
                data: {
                    departamento_id: id,
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
        console.error('Error al actualizar departamento:', error);
        return res.status(500).json({
            success: false,
            error: "Error al actualizar departamento",
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
                error: "Se requiere un ID de departamento válido"
            });
        }

        connection = await pool.getConnection();

        try {
            const [result] = await connection.query(
                `SELECT departamento_id, nombre, descripcion 
                FROM departamentos 
                WHERE departamento_id = ?`,
                [id]
            );

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "Departamento no encontrado"
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
        console.error('Error al obtener departamento:', error);
        return res.status(500).json({
            success: false,
            error: "Error al obtener departamento",
        });
    }
};

