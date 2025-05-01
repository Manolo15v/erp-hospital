import { pool } from "../../db.js";
import { loadOrders} from "../validations/loads.js";
import { totalizeProducts } from "../validations/validacion_compras_orders.js";

export const updateData = async (req, res) => {
    try {
        const id = parseInt(req.body.id);
        const date = new Date().toISOString().split('T')[0];
        const allProducts = await totalizeProducts();
        const allOrders = await loadOrders(allProducts);
    
        const order = allOrders.find(order => order.id == id);
    
        let estado;
        if (order.forma_pago == 'Prepagado') {
            estado = 'Completada';
        } else {
            estado = 'Recibida';
        }
        const [orden] = await pool.query('SELECT * FROM ordenes_compra WHERE orden_compra_id = ?', id);
        const tempProductosId = [];
        const tempProductosTipo = [];
        const tempProductosCantidad = [];

        for (let i = 1; i <= 5; i++) {
            const tipoRecurso = orden[`tipo_recurso${i}`];
            const cantidad = orden[`cantidad_${i}`];
            if (tipoRecurso !== "Recurso de Requisición") {
                const producto = allProducts.find(p => 
                    p.id === orden[`recurso_id_${i}`] && 
                    p.tipo === tipoRecurso
                );
                
                if (producto) {
                    tempProductosId.push(producto.id);
                    tempProductosTipo.push(producto.tipo);
                    if (cantidad) tempProductosCantidad.push(cantidad);
                }
            }
        }    
        
        for (let i=0;i<tempProductosId.length;i++){

            if (tempProductosTipo[i].includes('Producto')) {

                const consulta = 'update productos set unidades = Unidades + ? where Id_producto = ?'
                await pool.query(consulta,[tempProductosCantidad[i],tempProductosId[i]])

            } else if (tempProductosTipo[i].includes('Instrumento')) {

                const consulta = 'update instrumentos set unidades = COALESCE(Unidades, 0) + ? where Id_Instrumento = ?'
                await pool.query(consulta,[tempProductosCantidad[i],tempProductosId[i]])

            } else if (tempProductosTipo[i].includes('Equipo')) {
                const consulta = 'update modelos_equipos set unidades = COALESCE(Unidades, 0) + ? where Id_Modelo = ?'
                await pool.query(consulta,[tempProductosCantidad[i],tempProductosId[i]])
            
            } else if (tempProductosTipo[i].includes('Repuesto')) {
                
                const consulta = 'update repuestos set unidades = COALESCE(Unidades, 0) + ? where Id_Repuesto= ?'
                await pool.query(consulta,[tempProductosCantidad[i],tempProductosId[i]])

            }
        } 
        const [result] = await pool.query(
            `UPDATE ordenes_compra SET estado = ?,
            fecha_modificacion = ?, 
            fecha_entrega = ? 
            WHERE orden_compra_id = ?`,
            [  
                estado,
                date,
                date,
                id,
            ]
        );
        res.status(201).json(result);
        
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

