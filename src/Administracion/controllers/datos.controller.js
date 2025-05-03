import { pool } from '../../db.js';
import { run, income, employees, payments, orders, suppliers, products, inv_products, inv_instruments, inv_equipment, inv_spares } from '../getter/getter.js';

export const getOrders = async (req, res) => {
    try {
        await run();
        const allProducts = totalizeProducts(products, inv_products, inv_instruments, inv_equipment, inv_spares);
        const allOrders = loadOrders(orders, suppliers, allProducts);
        console.log(allOrders)

        res.status(200).json({ query: "orders", results: allOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getPayments = async (req, res) => {
    try {
        await run();
        const allProducts = totalizeProducts(products, inv_products, inv_instruments, inv_equipment, inv_spares);
        const allPayments = loadPayments(payments, employees);

        res.status(200).json({ query: "payments", results: allPayments });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getIncome = async (req, res) => {
    try {
        await run();
        res.status(200).json({ query: "income", results: income });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getGraph = async (req, res) => {
    try {
        await run();
        const allProducts = totalizeProducts(products, inv_products, inv_instruments, inv_equipment, inv_spares);
        const allOrders = loadOrders(orders, suppliers, allProducts);
        const allPayments = loadPayments(payments, employees);
        let results = {
            orders: allOrders,
            payments: allPayments,
            income: income
        };
        res.status(200).json({ query: 'graph', results: results })
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAll = async (req, res) => {
    try {
        await run();
        const allProducts = totalizeProducts(products, inv_products, inv_instruments, inv_equipment, inv_spares);
        const allOrders = loadOrders(orders, suppliers, allProducts);
        const allPayments = loadPayments(payments, employees);
        // 
        let currentMonth = new Date().getMonth();
        let currentYear = new Date().getFullYear();

        let completedOrdersThisMonth = allOrders.filter(order => {
            const orderDate = new Date(order.fecha_pago);
            return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear && order.estado === 'Pagada';
        });

        let paymentsThisMonth = allPayments.filter(payment => {
            const paymentDate = new Date(payment.fecha);
            return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
        });

        let incomeThisMonth = income.filter(income => {
            const incomeDate = new Date(income.fecha);
            return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
        });

        async function getExchangeRate() {
            try {
                const response = await fetch('https://pydolarve.org/api/v1/dollar?page=bcv&format_date=default&rounded_price=true', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            
                if (!response.ok) {
                    throw new Error('La solicitud no fue exitosa');
                }
                    
                const data = await response.json();
            
                return data.monitors.usd.price;
            } catch (error) {
                console.error('Hubo un error al obtener la tasa de cambio:', error);
                return 79.78;
            }
        }

        const exchangeRate = await getExchangeRate();

        let totalSpentThisMonthOrders = completedOrdersThisMonth.reduce((total, order) => {
            const orderDate = new Date(order.fecha_pago);
            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear && order.estado === 'Pagada') {
                if (order.moneda === '$') {
                    return total + order.monto_total;
                } else if (order.moneda === 'Bs') {
                    return total + (order.monto_total / exchangeRate);
                }
            }
            return total;
        }, 0);

        let totalSpentThisMonthPayments = paymentsThisMonth.reduce((total, payment) => {
            if (payment.moneda === '$') {
                return total + payment.monto;
            } else if (payment.moneda === ' Bs') {
                return total + (payment.monto / exchangeRate);
            }
            return total;
        }, 0);

        let totalIncomeThisMonth = incomeThisMonth.reduce((total, income) => {
            if (income.moneda === '$') {
                return total + income.cantidad;
            } else if (income.moneda === 'Bs') {
                return total + (income.cantidad / exchangeRate);
            }
            return total;
        }, 0);

        const totalSpentThisMonth = (totalSpentThisMonthOrders + totalSpentThisMonthPayments)

        let data = {
            stat_1: totalIncomeThisMonth,
            stat_2: totalSpentThisMonth,
        };

        res.status(200).json({ query: "all", results: data })
        // 
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
// Función para totalizar productos de requisición e inventario.
function totalizeProducts(products, inv_products, inv_instruments, inv_equipment, inv_spares) {
    const allProducts = [];
    
    inv_products.forEach(product => {
        allProducts.push({
            id: product.Id_Producto,
            codigo: product.Codigo,
            nombre: product.Nombre, 
            descripcion: product.Descripcion,            
            tipo: 'Producto de Inventario',
        });
    });

    inv_instruments.forEach(instrument => {
        allProducts.push({
            id: instrument.Id_Instrumento,
            codigo: instrument.Codigo,
            nombre: instrument.Nombre,
            descripcion: instrument.Descripcion,
            tipo: 'Instrumento de Inventario',
        });
    });

    inv_equipment.forEach(equipment => {
        allProducts.push({
            id: equipment.Id_Modelo,
            codigo: equipment.Codigo,
            nombre: equipment.Nombre,
            descripcion: equipment.Descripcion,
            tipo: 'Equipo de Inventario',
        });
    });

    inv_spares.forEach(spare => {
        allProducts.push({
            id: spare.Id_Repuesto,
            codigo: spare.Numero_de_Pieza,
            nombre: spare.Nombre,
            descripcion: spare.Descripcion,
            tipo: 'Repuesto de Inventario',
        });
    });
    
    products.forEach(product => {
        allProducts.push({
            id: product.recurso_id,
            codigo: product.codigo_recurso,
            nombre: product.nombre,
            descripcion: product.descripcion,
            tipo: 'Recurso de Requisición',
        });
    });

    return allProducts;
}

// Función para cargar el proveedor y el producto de una orden de compra.
function loadOrders(orders, suppliers, products) {
    const allOrders = [];

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
            moneda: order.moneda,
            monto_total: order.monto_total,
            estado: order.estado,
            observaciones: order.observaciones,
            forma_pago: order.forma_pago,
            fecha_pago: order.fecha_pago,
        });
    });

    return allOrders;
}

// Función para cargar el empleado y el sueldo al pago de nómina.
function loadPayments(payments, employees) {
    const allPayments = [];

    payments.forEach(payment => {
        const employee = employees.find(employee => employee.empleado_id == payment.empleado_id);
        
        allPayments.push({
            id: payment.pago_id,
            fecha: payment.fecha_pago,
            empleado: `${employee.nombre} ${employee.apellido}`,
            concepto: payment.concepto,
            monto: payment.monto,
            moneda: payment.moneda,
        })
    });

    return allPayments;
}
