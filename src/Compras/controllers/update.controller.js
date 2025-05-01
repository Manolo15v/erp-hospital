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
        const consulta = 'select * from ordenes_compra where orden_compra_id = ?'
        const [consulta_id] = await pool.query(consulta,id)

        const product_1 = allProducts.find(product => product.id == consulta_id[0].recurso_id_1 && product.tipo == consulta_id[0].tipo_recurso1 && consulta_id[0].tipo_recurso1 != "Recurso de Requisición");
        const product_2 = allProducts.find(product => product.id == consulta_id[0].recurso_id_2 && product.tipo == consulta_id[0].tipo_recurso2 && consulta_id[0].tipo_recurso2 != "Recurso de Requisición");
        const product_3 = allProducts.find(product => product.id == consulta_id[0].recurso_id_3 && product.tipo ==consulta_id[0].tipo_recurso3 &&  consulta_id[0].tipo_recurso3 != "Recurso de Requisición");
        const product_4 = allProducts.find(product => product.id == consulta_id[0].recurso_id_4 && product.tipo == consulta_id[0].tipo_recurso4 &&consulta_id[0].tipo_recurso4 != "Recurso de Requisición");
        const product_5 = allProducts.find(product => product.id == consulta_id[0].recurso_id_5 && product.tipo == consulta_id[0].tipo_recurso5 && consulta_id[0].tipo_recurso5 != "Recurso de Requisición");

        const tempProductosId = [product_1?.id,product_2?.id,product_3?.id,product_4?.id,product_5?.id].filter(elemento => elemento != null)
        const tempProductosTipo = [product_1?.tipo,product_2?.tipo,product_3?.tipo,product_4?.tipo,product_5?.tipo].filter(elemento => elemento != null)
        const tempProductosCantidad = [consulta_id[0]?.cantidad_1,consulta_id[0]?.cantidad_2,consulta_id[0]?.cantidad_3,consulta_id[0]?.cantidad_4,consulta_id[0]?.cantidad_5].filter(elemento => elemento != null)
        
        for (let i=0;i<tempProductosId.length;i++){

            if (tempProductosTipo[i].includes('Producto')) {

                const consulta = 'update productos set unidades = COALESCE(Unidades, 0) + ? where Id_producto = ?'
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

