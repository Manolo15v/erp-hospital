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
    try {
        const { nombre, descripcion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                error: "El campo nombre es requerido"
            });
        }

        const [result] = await pool.query(
            `INSERT INTO departamentos 
            (nombre, descripcion) 
            VALUES (?, ?)`,
            [nombre, descripcion]
        );

        return res.status(201).json({
            success: true,
            id: result.insertId,
            message: "Departamento creado exitosamente"
        });

    } catch (error) {
        console.error('Error al crear departamento:', error);
        return res.status(500).json({
            success: false,
            error: "Error al crear departamento"
        });
    }
};


export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;

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
            `UPDATE departamentos SET 
                nombre = ?,
                descripcion = ?
            WHERE departamento_id = ?`,
            [nombre, descripcion, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "Departamento no encontrado"
            });
        }

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
        console.error('Error al actualizar departamento:', error);
        return res.status(500).json({
            success: false,
            error: "Error al actualizar departamento"
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
                error: "Se requiere un ID de departamento válido"
            });
        }

        const [result] = await pool.query(
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
        console.error('Error al obtener departamento:', error);
        return res.status(500).json({
            success: false,
            error: "Error al obtener departamento"
        });
    }
};

