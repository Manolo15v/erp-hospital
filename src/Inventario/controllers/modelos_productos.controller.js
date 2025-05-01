import { pool } from "../../db.js";

export const getAll = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * FROM Modelos_Productos`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'ID es requerido' });
        }
        const [data] = await pool.query(`SELECT * FROM Modelos_Productos WHERE Id_Modelo = ?`, [id]);
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createModelo = async (req, res) => {
    try {
        
        const {  Nombre, Descripcion, Codigo, Tipo_Producto, Tipo_Unidad, Unidades_Maximas, Unidades_Minimas } = req.body;
        if (!Nombre || !Descripcion || !Codigo || !Tipo_Producto || !Tipo_Unidad || !Unidades_Maximas || !Unidades_Minimas) {
            return res.status(400).json({ error: 'Nombre y Descripción son requeridos' });
        }
        const [data] = await pool.query(
            `
            INSERT INTO Modelos_Productos (Nombre, Descripcion, Codigo, Tipo_Producto, Tipo_Unidad, Unidades_Maximas, Unidades_Minimas)
            VALUES (?, ?, ?, ?, ?, ?, ?);
            `,
            [Nombre, Descripcion, Codigo, Tipo_Producto, Tipo_Unidad, Unidades_Maximas, Unidades_Minimas]
        );

        const modeloCreado = {
            Id_Modelo: data.insertId,
            Nombre: Nombre,
            Descripcion: Descripcion,
            Unidades_Maximas: Unidades_Maximas,
            Unidades_Minimas: Unidades_Minimas
        };

        res.status(201).json({
            message: 'Modelo creado exitosamente',
            modelo: modeloCreado,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateById = async (req, res) => {
    try {
        const id = req.params.id;
        const { Nombre, Descripcion,  UnidadesMaximas , UnidadesMinimas} = req.body;
        if (!id || !Nombre || !Descripcion || !UnidadesMaximas || !UnidadesMinimas) {
            return res.status(400).json({ error: 'ID y todos los campos de actualización son requeridos' });
        }
        const [data] = await pool.query(
            `
            UPDATE Modelos_Productos 
            SET 
                Nombre = ?,
                Descripcion = ?,
                Unidades_Maximas = ?,
                Unidades_Maximas = ?
            WHERE Id_Modelo = ?;
            `,
            [Nombre, Descripcion,  UnidadesMaximas , UnidadesMinimas, id]
        );

        if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ningún modelo con el ID proporcionado' });
        }

        res.status(200).json({
            message: 'Modelo actualizado exitosamente',
            updatedData: {
              Id_Modelo: id,
              Nombre: Nombre,
              UnidadesMaximas: UnidadesMaximas,
              UnidadesMinimas: UnidadesMinimas
            },
          });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteById = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({ error: 'ID es requerido' });
        }
        
        const [data] = await pool.query(
            `DELETE FROM Modelos_Productos WHERE Id_Modelo = ?`,
            [id]
        );

        // Verificar si se eliminó algún registro
        if (data.affectedRows === 0) {
            return res.status(404).json({ error: 'No se encontró ningún modelo con el ID proporcionado' });
        }

        // Respuesta con mensaje de éxito
        res.status(200).json({
            message: 'Modelo eliminado exitosamente',
            deletedId: id,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}