import { pool } from '../../db.js';

export const getAll = async (req, res) => {//controlador que obtiene todas las ordenes de compra
    try {
        const [data] = await pool.query(`SELECT * FROM ordenescompra`);
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No se encontraron órdenes de compra.' });
        }
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getById = async (req, res) => {//controlador que obtiene ordenes por id, util paraid de recursos
    try {
        const id = req.params.id;
        const [data] = await pool.query(
            `SELECT * FROM ordenescompra WHERE id_orden_compra = ?;`,
            [id]
        );
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Orden de compra no encontrada.' });
        }
        res.status(200).json(data[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const createOrdenCompra = async (req, res) => {//controlador para crear orden, no creo que sea necesario en este modulo
    const { fecha_orden, proveedor, monto_total, estado } = req.body;

    try {
        const query = `
            INSERT INTO ordenescompra (fecha_orden, proveedor, monto_total, estado)
            VALUES (?, ?, ?, ?)
        `;
        const [result] = await pool.query(query, [fecha_orden, proveedor, monto_total, estado]);
        res.status(201).json({ message: 'Orden de compra creada exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la orden de compra', details: error.message });
    }
};

export const updateOrdenCompra = async (req, res) => {//actualizar orden
    const { id } = req.params;
    const { fecha_orden, proveedor, monto_total, estado } = req.body;

    try {
        const query = `
            UPDATE ordenescompra
            SET fecha_orden = ?, proveedor = ?, monto_total = ?, estado = ?
            WHERE id_orden_compra = ?
        `;
        const [result] = await pool.query(query, [fecha_orden, proveedor, monto_total, estado, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Orden de compra no encontrada.' });
        }

        res.status(200).json({ message: 'Orden de compra actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la orden de compra', details: error.message });
    }
};

export const deleteOrdenCompra = async (req, res) => {//borra orden de compraAA
    const { id } = req.params;

    try {
        const [result] = await pool.query('DELETE FROM ordenescompra WHERE id_orden_compra = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Orden de compra no encontrada.' });
        }

        res.status(200).json({ message: 'Orden de compra eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la orden de compra', details: error.message });
    }
};
