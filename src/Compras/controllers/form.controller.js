import { pool } from "../../db.js";
import { loadOrders, loadRequirements } from "../validations/loads.js";
import { totalizeProducts } from "../validations/validacion_compras_orders.js";

export const getSuppliersResults = async (req, res) => {
    try {
        const [suppliers] = await pool.query(`SELECT * from proveedores`);

        if (!suppliers || suppliers.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Error. El ID debe ser un número válido." });
        }

        const supplierResults = suppliers.filter(supplier => supplier.proveedor_id === id);
        
        if (supplierResults.length === 0) {
            return res.status(404).json({ error: "No se encontraron proveedores con el ID especificado." });
        }

        return res.status(200).json({results: supplierResults });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}  

export const getProductsResults = async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM recursos');

        if (!products || products.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Error. El ID debe ser un número válido." });
        }

        const productResults = products.filter(product => product.recurso_id === id);
        if (productResults.length === 0) {
            return res.status(404).json({ error: "No se encontraron productos con el ID especificado." });
        }
        return res.status(200).json({results: productResults });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}  

export const getOrdersResults = async (req, res) => {
    try {
        const allProducts = await totalizeProducts()
        const Orders = await loadOrders(allProducts)

        if (!Orders || Orders.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Error. El ID debe ser un número válido." });
        }

        const orderResults = Orders.filter(order => order.id === id);
        if (orderResults.length === 0) {
            return res.status(404).json({ error: "No se encontraron órdenes con el ID especificado." });
        }
        return res.status(200).json({results: orderResults });
    
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}  

export const getRequirementsResults = async (req, res) => {
    try {
        const allProducts = await totalizeProducts()
        const Requirements = await loadRequirements(allProducts)

        if (!Requirements || Requirements.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }

        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: "Error. El ID debe ser un número válido." });
        }
        const requirementResults = Requirements.filter(requirement => requirement.id === id);
        if (requirementResults.length === 0) {
            return res.status(404).json({ error: "No se encontraron requisitos con el ID especificado." });
        }
        return res.status(200).json({results: requirementResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}