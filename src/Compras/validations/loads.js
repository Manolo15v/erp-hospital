import { pool } from "../../db.js";

export async function loadOrders(products) {
   try {
    const allOrders = [];

    const [orders] = await pool.query('SELECT * FROM ordenes_compra')
    const [suppliers] = await pool.query('SELECT * FROM proveedores')
    
    orders.forEach(order => {
        const supplier = suppliers.find(supplier => supplier.proveedor_id == order.proveedor_id);
        const product_1 = products.find(product => product.id == order.recurso_id_1 && product.tipo == order.tipo_recurso1);
        const product_2 = products.find(product => product.id == order.recurso_id_2 && product.tipo == order.tipo_recurso2);
        const product_3 = products.find(product => product.id == order.recurso_id_3 && product.tipo == order.tipo_recurso3);
        const product_4 = products.find(product => product.id == order.recurso_id_4 && product.tipo == order.tipo_recurso4);
        const product_5 = products.find(product => product.id == order.recurso_id_5 && product.tipo == order.tipo_recurso5);

        allOrders.push({
            id: order.orden_compra_id,            
            tipo_orden: order.tipo_orden,
            numero_orden: order.numero_orden,
            proveedor: supplier.nombre,
            fecha_orden: order.fecha_orden,
            fecha_esperada: order.fecha_esperada,
            fecha_entrega: order.fecha_entrega,
            fecha_modificacion: order.fecha_modificacion,
            recurso_1: product_1.nombre,
            precio_unitario_1: order.precio_unitario_1,
            cantidad_1: order.cantidad_1,
            unidad_medida_1: order.unidad_medida_1,
            recurso_2: product_2 ? product_2.nombre : '',
            precio_unitario_2: order.precio_unitario_2 || '',
            cantidad_2: order.cantidad_2 || '',
            unidad_medida_2: order.unidad_medida_2 || '',
            recurso_3: product_3 ? product_3.nombre : '',
            precio_unitario_3: order.precio_unitario_3 || '',
            cantidad_3: order.cantidad_3 || '',
            unidad_medida_3: order.unidad_medida_3 || '',
            recurso_4: product_4 ? product_4.nombre : '',
            precio_unitario_4: order.precio_unitario_4 || '',
            cantidad_4: order.cantidad_4 || '',
            unidad_medida_4: order.unidad_medida_4 || '',
            recurso_5: product_5 ? product_5.nombre : '',
            precio_unitario_5: order.precio_unitario_5 || '',
            cantidad_5: order.cantidad_5 || '',
            unidad_medida_5: order.unidad_medida_5 || '',
            monto_total: order.monto_total,
            estado: order.estado,
            observaciones: order.observaciones,
            forma_pago: order.forma_pago,
            fecha_pago: order.fecha_pago,
        });
    });

    return allOrders;
    } catch (error) {
        console.error(error.message)
    }
}
    

export async function loadRequirements(products) {
    try {
        const allRequirements = [];

        const [requirements] = await pool.query('SELECT * FROM requisitorias')
        const [employees] = await pool.query('SELECT * from empleados')
        const [departments] = await pool.query('SELECT * FROM departamentos')
        const [users] = await pool.query('SELECT * FROM usuarios')
    
        requirements.forEach(requirement => {
            let petitioner, user, department;
            if (requirement.empleado_id) {
                petitioner = employees.find(employee => employee.empleado_id == requirement.empleado_id);
                user = users.find(user => user.empleado_id == requirement.empleado_id);
                department = departments.find(department => department.departamento_id == petitioner.departamento_id);
            }
    
            const product_1 = products.find(product => product.id == requirement.recurso_id_1 && product.codigo == requirement.recurso_codigo_1);
            const product_2 = products.find(product => product.id == requirement.recurso_id_2 && product.codigo == requirement.recurso_codigo_2);
            const product_3 = products.find(product => product.id == requirement.recurso_id_3 && product.codigo == requirement.recurso_codigo_3);
            const product_4 = products.find(product => product.id == requirement.recurso_id_4 && product.codigo == requirement.recurso_codigo_4);
            const product_5 = products.find(product => product.id == requirement.recurso_id_5 && product.codigo == requirement.recurso_codigo_5);
    
            allRequirements.push({
                id: requirement.requisitoria_id,
                usuario: user ? user.usuario : 'administrador',
                solicitante: petitioner ? `${petitioner.nombre} ${petitioner.apellido}` : 'Administrador',
                departamento: department ? department.nombre : 'Administración del Sistema',
                area: petitioner ? petitioner.area : null,
                motivo: requirement.motivo,
                descripcion: requirement.descripcion,
                fecha_emision: requirement.fecha_emision,
                fecha_cierre: requirement.fecha_cierre,
                fecha_modificacion: requirement.fecha_modificacion,
                fecha_requerida: requirement.fecha_requerida,
                observaciones: requirement.observaciones,
                estado: requirement.estado,
                recurso_1: product_1.nombre,
                cantidad_1: requirement.cantidad_1,
                unidad_medida_1: requirement.unidad_medida_1,
                recurso_2: product_2 ? product_2.nombre : '',
                cantidad_2: requirement.cantidad_2 || '',
                unidad_medida_2: requirement.unidad_medida_2 || '',
                recurso_3: product_3 ? product_3.nombre : '',
                cantidad_3: requirement.cantidad_3 || '',
                unidad_medida_3: requirement.unidad_medida_3 || '',
                recurso_4: product_4 ? product_4.nombre : '',
                cantidad_4: requirement.cantidad_4 || '',
                unidad_medida_4: requirement.unidad_medida_4 || '',
                recurso_5: product_5 ? product_5.nombre : '',
                cantidad_5: requirement.cantidad_5 || '',
                unidad_medida_5: requirement.unidad_medida_5 || '',
            });
        });
    
        return allRequirements;
    } catch (error) {
        console.error(error.message)
    }
    
}