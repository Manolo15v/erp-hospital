import { pool } from '../../db.js';

async function getInsumosConsultorio(req, res) {
    try {
        const [ubicacion] = await pool.query(
            "SELECT Id_Ubicacion FROM almacenes_ubicaciones WHERE Area = 'Consultorio' LIMIT 1"
        );
        
        if (!ubicacion || ubicacion.length === 0) {
            return res.status(404).json({ error: "Ubicación 'Consultorio' no encontrada" });
        }

        const idConsultorio = ubicacion[0].Id_Ubicacion;

        const [productos] = await pool.query(`
            SELECT 
                p.Id_Producto, 
                mp.Nombre, 
                pu.Unidades_Por_Ubicacion,
                'producto' AS tipo
            FROM productos p
            JOIN modelos_productos mp ON p.Id_modelo_productos = mp.Id_Producto
            JOIN productos_ubicacion pu ON p.Id_Producto = pu.Id_Producto
            WHERE pu.Id_Ubicacion = ? AND pu.Unidades_Por_Ubicacion > 0
        `, [idConsultorio]);

        const [instrumentos] = await pool.query(`
            SELECT 
                i.Id_Instrumento, 
                i.Nombre, 
                iu.Unidades_Por_Ubicacion,
                'instrumento' AS tipo
            FROM instrumentos i
            JOIN instrumentos_ubicacion iu ON i.Id_Instrumento = iu.Id_Instrumento
            WHERE iu.Id_Ubicacion = ? AND iu.Unidades_Por_Ubicacion > 0
        `, [idConsultorio]);
        
        res.json({ productos, instrumentos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function updateInventarioConsultorio(req, res) {
    try {
        const { insumos } = req.body;
        
        if (!insumos || insumos.length === 0) {
            return res.status(400).json({ error: "No hay insumos para actualizar" });
        }

        const [ubicacion] = await pool.query(
            "SELECT Id_Ubicacion FROM almacenes_ubicaciones WHERE Area = 'Consultorio' LIMIT 1"
        );
        
        if (!ubicacion || ubicacion.length === 0) {
            return res.status(404).json({ error: "Ubicación 'Consultorio' no encontrada" });
        }

        const idConsultorio = ubicacion[0].Id_Ubicacion;

        for (const insumo of insumos) {
            if (insumo.tipo === 'producto') {
                await pool.query(
                    `UPDATE productos_ubicacion 
                    SET Unidades_Por_Ubicacion = Unidades_Por_Ubicacion - ? 
                    WHERE Id_Producto = ? AND Id_Ubicacion = ?`,
                    [insumo.cantidad, insumo.id, idConsultorio]
                );
            } else if (insumo.tipo === 'instrumento') {
                await pool.query(
                    `UPDATE instrumentos_ubicacion 
                    SET Unidades_Por_Ubicacion = Unidades_Por_Ubicacion - ? 
                    WHERE Id_Instrumento = ? AND Id_Ubicacion = ?`,
                    [insumo.cantidad, insumo.id, idConsultorio]
                );
            }
        }

        res.json({ message: "Inventario actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export {
    updateInventarioConsultorio,
    getInsumosConsultorio
};