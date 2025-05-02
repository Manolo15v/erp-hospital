import { pool } from '../../db.js';


export const getAll = async (req, res) => {//obtiene todos los productos, que se supone que no hay
    try {
        const [data] = await pool.query(`
            SELECT p.*, m.Nombre AS Modelo
            FROM productos p
            JOIN modelos_productos m ON p.Id_modelo_productos = m.Id_Producto
        `);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No se encontraron productos en la base de datos.' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {//mismo obtener por id
    const { id } = req.params;
    try {
        const [data] = await pool.query(`
            SELECT p.*, m.Nombre AS Modelo
            FROM productos p
            JOIN modelos_productos m ON p.Id_modelo_productos = m.Id_Producto
            WHERE p.Id_Producto = ?
        `, [id]);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No se encontró el producto con el ID proporcionado.' });
        }
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const createProducto = async (req, res) => {//crea un producto ,lo unico que manda administracion
    const { Id_modelo_productos, Unidades, Fecha_Vencimiento } = req.body;
    try {
        const [modelo] = await pool.query('SELECT * FROM modelos_productos WHERE Id_Producto = ?', [Id_modelo_productos]);
        if (!modelo || modelo.length === 0) {
            return res.status(400).json({ error: 'El modelo de producto no existe.' });
        }

        const query = `
            INSERT INTO productos (Id_modelo_productos, Unidades, Fecha_Vencimiento)
            VALUES (?, ?, ?)
        `;
        const [result] = await pool.query(query, [Id_modelo_productos, Unidades, Fecha_Vencimiento]);
        res.status(201).json({ id: result.insertId, Id_modelo_productos, Unidades, Fecha_Vencimiento });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};