import { pool } from "../../db.js";
import { loadOrders, loadRequirements } from "../validations/loads.js";
import { totalizeProducts } from "../validations/validacion_compras_orders.js";


let dataCache = null
export const suppliers = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * from proveedores`);
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}  

export const products = async (req, res) => {
    try {
        dataCache = await totalizeProducts();
        if (!dataCache || dataCache.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(dataCache)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const orders = async (req, res) => {
    try {
        dataCache = await totalizeProducts();
        const data =  await loadOrders(dataCache)
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const requirements = async (req, res) => {
    try {
        dataCache = await totalizeProducts();
        const data =  await loadRequirements(dataCache)
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const empleoyees = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * from empleados`);
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const allData = async (req, res) => {
    try {
        dataCache = await totalizeProducts();
        const allOrders = await loadOrders(dataCache)
        const allRequirements = await loadRequirements(dataCache)
        let currentMonth = new Date().getMonth();
            let currentYear = new Date().getFullYear();

            let completedOrdersThisMonth = allOrders.filter(order => {
                const orderDate = new Date(order.fecha_pago);
                return order.estado === 'Completada' && 
                    orderDate.getMonth() === currentMonth && 
                    orderDate.getFullYear() === currentYear;
            });
        
        let totalSpentThisMonth = completedOrdersThisMonth.reduce((total, order) => {
            const orderDate = new Date(order.fecha_pago);
            if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
                    return total + order.monto_total;
            }
            return total;
        }, 0);

        let data = {
            stat_1: completedOrdersThisMonth.length,
            stat_2: totalSpentThisMonth,
            stat_3: allOrders.filter(order => order.estado === 'Pendiente').length,
            stat_4: allRequirements.filter(requirement => requirement.estado === 'Pendiente').length,
        };

        res.status(200).json({results: data });   
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}