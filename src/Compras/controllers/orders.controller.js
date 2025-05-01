import { pool } from "../../db.js";
import { loadOrders } from "../validations/loads.js";
import { searchProductsId, searchProductsType, searchSuppliers, totalizeProducts, validations_orders, validations_orders_modificate } from "../validations/validacion_compras_orders.js";

export const getAllOrders = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * from ordenes_compra`);
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getByIdOrders = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM ordenes_compra WHERE orden_compra_id = ?;`, [id]); 
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      const products = await totalizeProducts()
      const datas = await loadOrders(products)
      res.status(200).json(datas);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

export const insertOrder = async (req, res) => {
    try {
        const newOrder = req.body;
        const proveedor_id =  await searchSuppliers(newOrder.proveedor)
        const recursos_ids = [];
        const recursos_tipos = [];

        for (let i = 1; i <= 5; i++) {
            const codigoRecurso = newOrder[`recurso_${i}`];
            recursos_ids.push(await searchProductsId(codigoRecurso));
            recursos_tipos.push(await searchProductsType(codigoRecurso));
        }
        const numero_orden = await generateOrderCode();
        await validations_orders(newOrder)

        const [result] = await pool.query(
            `INSERT INTO ordenes_compra (
            tipo_orden, 
            proveedor_id, 
            fecha_orden, 
            fecha_esperada, 
            estado, 
            monto_total, 
            observaciones, 
            numero_orden, 
            fecha_modificacion, 
            recurso_id_1, 
            precio_unitario_1, 
            cantidad_1, 
            unidad_medida_1, 
            recurso_id_2, 
            precio_unitario_2, 
            cantidad_2, 
            unidad_medida_2, 
            recurso_id_3, 
            precio_unitario_3, 
            cantidad_3, 
            unidad_medida_3, 
            recurso_id_4, 
            precio_unitario_4, 
            cantidad_4, 
            unidad_medida_4, 
            recurso_id_5, 
            precio_unitario_5, 
            cantidad_5, 
            unidad_medida_5, 
            forma_pago, 
            fecha_pago, 
            tipo_recurso1, 
            tipo_recurso2, 
            tipo_recurso3, 
            tipo_recurso4, 
            tipo_recurso5,
            moneda) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [  
                newOrder.tipo,
                proveedor_id,
                newOrder.fecha_orden,
                newOrder.fecha_esperada,
                newOrder.estado,
                newOrder.monto_total,
                newOrder.observaciones,
                numero_orden,
                newOrder.fecha_modificacion,
                recursos_ids[0],
                newOrder.precio_unitario_1,
                newOrder.cantidad_1,
                newOrder.unidad_medida_1,
                recursos_ids[1],
                newOrder.precio_unitario_2,
                newOrder.cantidad_2,
                newOrder.unidad_medida_2,
                recursos_ids[2],
                newOrder.precio_unitario_3,
                newOrder.cantidad_3,
                newOrder.unidad_medida_3,
                recursos_ids[3],
                newOrder.precio_unitario_4,
                newOrder.cantidad_4,
                newOrder.unidad_medida_4,
                recursos_ids[4],
                newOrder.precio_unitario_5,
                newOrder.cantidad_5,
                newOrder.unidad_medida_5,
                newOrder.forma_pago,
                newOrder.fecha_pago,
                recursos_tipos[0],
                recursos_tipos[1],
                recursos_tipos[2],
                recursos_tipos[3],
                recursos_tipos[4],
                'Bs'
            ]
        );
        res.status(201).json({message:"Orden registrada", result, code: numero_orden });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateOrder = async (req,res) => {
    try {
        const id = req.params.id;

        const [consulta] = await pool.query('SELECT orden_compra_id FROM ordenes_compra');
        if (consulta.find(clave => clave.orden_compra_id == id) == undefined) {
            throw new Error('Orden inexistente')
        }

        const newOrder = req.body;
        const recursos_ids = [];
        const recursos_tipos = [];

        for (let i = 1; i <= 5; i++) {
            const codigoRecurso = newOrder[`recurso_${i}`];
            recursos_ids.push(await searchProductsId(codigoRecurso));
            recursos_tipos.push(await searchProductsType(codigoRecurso));
        }
        await validations_orders_modificate(newOrder)

        const [result] = await pool.query(
            `UPDATE ordenes_compra SET 
            estado = ?, 
            fecha_esperada = ?, 
            monto_total = ?, 
            observaciones = ?, 
            fecha_modificacion = ?, 
            recurso_id_1 = ?, 
            precio_unitario_1 = ?, 
            cantidad_1 = ?, 
            unidad_medida_1 = ?, 
            recurso_id_2 = ?, 
            precio_unitario_2 = ?, 
            cantidad_2 = ?, 
            unidad_medida_2 = ?, 
            recurso_id_3 = ?, 
            precio_unitario_3 = ?, 
            cantidad_3 = ?, 
            unidad_medida_3 = ?, 
            recurso_id_4 = ?, 
            precio_unitario_4 = ?, 
            cantidad_4 = ?, 
            unidad_medida_4 = ?, 
            recurso_id_5 = ?, 
            precio_unitario_5 = ?, 
            cantidad_5 = ?, 
            unidad_medida_5 = ?, 
            forma_pago = ?, 
            fecha_pago = ?, 
            tipo_recurso1 = ?, 
            tipo_recurso2 = ?, 
            tipo_recurso3 = ?, 
            tipo_recurso4 = ?, 
            tipo_recurso5 = ? 
            WHERE orden_compra_id = ?`,
            [  
                'Emitida',
                newOrder.fecha_esperada,
                newOrder.monto_total,
                newOrder.observaciones,
                newOrder.fecha_modificacion,
                recursos_ids[0],
                newOrder.precio_unitario_1,
                newOrder.cantidad_1,
                newOrder.unidad_medida_1,
                recursos_ids[1],
                newOrder.precio_unitario_2,
                newOrder.cantidad_2,
                newOrder.unidad_medida_2,
                recursos_ids[2],
                newOrder.precio_unitario_3,
                newOrder.cantidad_3,
                newOrder.unidad_medida_3,
                recursos_ids[3],
                newOrder.precio_unitario_4,
                newOrder.cantidad_4,
                newOrder.unidad_medida_4,
                recursos_ids[4],
                newOrder.precio_unitario_5,
                newOrder.cantidad_5,
                newOrder.unidad_medida_5,
                newOrder.forma_pago,
                newOrder.fecha_pago,
                recursos_tipos[0],
                recursos_tipos[1],
                recursos_tipos[2],
                recursos_tipos[3],
                recursos_tipos[4],
                id,
            ]
        );
        const consulta2 ='SELECT numero_orden, fecha_orden FROM ordenes_compra where orden_compra_id =?'
        const [codes] = await pool.query(consulta2,[id])
        const code = codes[0].numero_orden
        const fecha = new Date(codes[0].fecha_orden);
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0'); 
        const dia = String(fecha.getDate()).padStart(2, '0');

        res.status(201).json({ "result": result, "code": code, "fecha": `${año}-${mes}-${dia}` });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const deleteOrder = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
          return res.status(400).json({ error: 'ID es requerido' });
        }

        await pool.query('DELETE FROM ordenes_compra WHERE orden_compra_id = ?',[id]);
        res.status(200).json({ message: 'Eliminado correctamente' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

async function generateOrderCode() {
    const consulta = 'SELECT numero_orden FROM ordenes_compra';
    const [temp] = await pool.query(consulta)
    const existingCodes = temp.map(row => row.numero_orden);
    let code = '';
    while (true) {
        const characters = '0123456789';
        code = '';

        for (let i = 0; i < 8; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }    
        if (!existingCodes.includes(code)) {
            break; 
        }
    }

    return parseInt(code);
}