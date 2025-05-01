import { pool } from "../../db.js";
import { loadOrders } from "../validations/loads.js";
import { totalizeProducts } from "../validations/validacion_compras_orders.js";

async function Inventory() {
    try {
        const [data] = await pool.query(`
            SELECT 'Modelo Producto' AS tipo, mp.Id_Producto AS id, mp.Nombre AS nombre, mp.Codigo AS codigo, mp.Tipo_Unidad AS tipo_unidad,
            SUM(p.Unidades) AS unidades_totales, mp.Unidades_Minimas AS unidades_minimas, mp.Unidades_Maximas AS unidades_maximas
            FROM modelos_productos mp 
            LEFT JOIN productos p ON mp.Id_Producto = p.Id_modelo_productos
            GROUP BY mp.Id_Producto
            HAVING unidades_totales <= mp.Unidades_Minimas OR unidades_totales IS NULL

            UNION

            SELECT 'Instrumento' AS tipo, i.Id_Instrumento AS ID, i.Nombre AS nombre, Codigo AS codigo, '' AS tipo_unidad,
                i.Unidades AS unidades_totales, i.Unidades_Minimas AS unidades_minimas, i.Unidades_Maximas AS unidades_maximas
            FROM instrumentos i
            WHERE i.Unidades <= i.Unidades_Minimas

            UNION

            SELECT 'Repuesto' AS tipo, r.Id_Repuesto AS id, r.Nombre AS nombre, r.Numero_de_Pieza AS codigo, '' AS tipo_unidad,
                r.Unidades AS unidades_totales, r.Unidades_Minimas AS unidades_minimas, r.Unidades_Maximas AS unidades_maximas
            FROM repuestos r
            WHERE r.Unidades <= r.Unidades_Minimas;
        `);
        return data
    } catch (error) {
        throw new Error("Error. en conseguir el inventario")
    }
}

export const getAllInventory = async (req, res) => {
    
    try {
        const allProducts = await totalizeProducts()
        const allOrders = await loadOrders(allProducts)
    
        const results = {
            items: await Inventory(),
            orders: allOrders
        }
    
        res.status(200).json({ results: results });
    } catch (error) {
        console.error(error.message)
        res.status(500).json({error:error.message})
    }
}

