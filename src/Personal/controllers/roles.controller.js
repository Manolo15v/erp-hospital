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
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                error: "El campo nombre es requerido"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO roles 
        (nombre, descripcion) 
        VALUES (?, ?)`,
        [nombre, descripcion]
        );

        return res.status(201).json({
            success: true,
            id: result.insertId,
            message: "rol creado exitosamente"
        });

    } catch (error) {
        console.error('Error al crear rol:', error);
        return res.status(500).json({
            success: false,
            error: "Error al crear rol"
        });
    }
};


export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const {  nombre, descripcion } = req.body;

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


        const [result] = await pool.query(
            `UPDATE roles SET 
                nombre = ?,
                descripcion = ?
            WHERE rol_id = ?`,
        [nombre, descripcion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "rol no encontrado"
            });
        }


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
        console.error('Error al actualizar rol:', error);
        return res.status(500).json({
            success: false,
            error: "Error al actualizar rol"
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
                error: "Se requiere un ID de rol válido"
            });
        }

            const [result] = await pool.query(
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
        console.error('Error al obtener rol:', error);
        return res.status(500).json({
            success: false,
            error: "Error al obtener rol"
        });
    }
};