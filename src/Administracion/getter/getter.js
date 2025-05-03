import { pool } from '../../db.js';
// Arrays de almacenamiento de los datos
let income = []
let employees = [];
let payments = [];
let orders = [];
let suppliers = [];
let products = [];
let inv_products = [];
let inv_instruments = [];
let inv_equipment = [];
let inv_spares = [];

// Función para cargar los datos de la base de datos
async function loadData() {
    try {
        income = await getData('SELECT * FROM ingresos')
        payments = await getData('SELECT * FROM pagos_empleados');
        employees = await getData('SELECT * from empleados');
        orders = await getData('SELECT * FROM ordenes_compra');
        suppliers = await getData('SELECT * FROM proveedores');
        products = await getData('SELECT * FROM recursos');
        inv_products = await getData('SELECT * FROM modelos_productos');
        inv_instruments = await getData('SELECT * FROM instrumentos');
        inv_equipment = await getData('SELECT * FROM modelos_equipos');
        inv_spares = await getData('SELECT * FROM repuestos');
        console.log("Datos cargados desde la base de datos.");
    } catch (error) {
        console.error("Error al cargar los datos desde la base de datos:", error);
    }
}

// Función para obtener los datos de la base de datos
async function getData(query) {
    try {
        const [list] = await pool.query(query);
        return list;
    } catch (error) {
        console.error("Error en la consulta:", error);
        return []; // Retorna un array vacío en caso de error.
    }
}

// Función que ejecuta la carga de datos
async function run() {
    await loadData();
    console.log("Datos inicializados.");
}

// Ejecutar la carga de datos al importar el módulo
await run();

export { run, income, employees, payments, orders, suppliers, products, inv_products, inv_equipment, inv_instruments, inv_spares };