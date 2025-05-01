import { pool } from "../../db.js";

let allProductsCache = null;

export async function searchSuppliers(nameSupplier) {
    const [suppliers] = await pool.query(`SELECT * from proveedores`);
    const proveedor_id = suppliers.find(supplier => supplier.nombre == nameSupplier)?.proveedor_id;
    if (proveedor_id != null && proveedor_id !== undefined) {
        return proveedor_id;
    }
    throw new Error(`El proveedor no existe.`);
}

export async function searchProductsId(nameProduct) {
    allProductsCache = await totalizeProducts();
    const recurso_id = allProductsCache.find(product => product.nombre == nameProduct)?.id;

    return recurso_id;
}

export async function searchProductsType(nameProduct) {
    allProductsCache = await totalizeProducts();
    const tipo_recurso = allProductsCache.find(product => product.nombre == nameProduct)?.tipo;

    return tipo_recurso;
}

export async function validations_orders(newOrder) {
    allProductsCache = await totalizeProducts();
    const recursos_nombres = [];
    let recursos_precios = [];
    let recursos_cantidad = [];
    let recursos_unidad = [];
    for (let i=1;i<6;i++) {
        recursos_nombres.push(newOrder[`recurso_${i}`])
        recursos_precios.push(newOrder[`precio_unitario_${i}`])
        recursos_cantidad.push(newOrder[`cantidad_${i}`]);
        recursos_unidad.push(newOrder[`unidad_medida_${i}`]);
    }

    const elementos = recursos_nombres.filter(elemento => elemento != '' && elemento != undefined )
    recursos_precios = recursos_precios.filter(valor => valor != null)
    recursos_cantidad = recursos_cantidad.filter(valor => valor != null)
    recursos_unidad = recursos_unidad.filter(valor => valor != '')

    if (elementos.length == 0) {
        throw new Error(`Productos inválidos. No existen productos.`)
    }

    const tempElement = new Set(elementos) 
    if (tempElement.size != elementos.length) {
        throw new Error(`Productos inválidos. Hay productos duplicados.`)
    }

    for (let i = 0;i<elementos.length;i++) {
        let band = false
        for (let j = 0;j<allProductsCache.length;j++) {
            if (elementos[i] == allProductsCache[j].nombre) {
                band = true
                break
            }
        }
        if (!band) {
            throw new Error(`Productos inválidos. El producto: ${i+1} no existe.`)
        }
    }

    for (let i=0;i<recursos_precios.length;i++) {
        if (recursos_precios[i] <= 0) {
            throw new Error(`Productos inválidos. Precio menor o igual a 0 en el producto: ${i+1}.`)
        }
    }

    for (let i=0;i<recursos_cantidad.length;i++) {
        if (recursos_cantidad[i] <= 0) {
            throw new Error(`Productos inválidos. Cantidad menor o igual a 0 en el producto: ${i+1}.`)
        }
    }

    for (let i=0;i<recursos_unidad.length;i++) {
        if ((!(/^[a-zA-Z][a-zA-Z0-9]*$/.test(recursos_unidad[i])))) {
            throw new Error(`Productos inválidos. Unidad inválida en el producto: ${i+1}`)
        }
    }

    const date = new Date();
    const formattedDate = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    
    if (newOrder.fecha_esperada) {
        const dateSelected = new Date(newOrder.fecha_esperada)
        if (formattedDate > dateSelected) {
            throw new Error("Fecha inválida. La fecha seleccionada es anterior a hoy.")
        } 
        
    } else {
        throw new Error("Fecha inválida. Fecha inexistente")
    }
    
    if (newOrder.fecha_pago != null) {
        const dateSelected = new Date(newOrder.fecha_pago)
        if (formattedDate > dateSelected) {
            throw new Error("Fecha inválida. La fecha seleccionada es anterior a hoy.")
        }
    }

    if (newOrder.monto_total == '') {
        throw new Error("Monto total invalido. El precio es inexistente.")
    }

}

export async function validations_orders_modificate(newOrder) {

    allProductsCache = await totalizeProducts();

    const recursos_nombres = [];
    let recursos_precios = [];
    let recursos_cantidad = [];
    let recursos_unidad = [];
    for (let i=1;i<6;i++) {
        recursos_nombres.push(newOrder[`recurso_${i}`])
        recursos_precios.push(newOrder[`precio_unitario_${i}`])
        recursos_cantidad.push(newOrder[`cantidad_${i}`]);
        recursos_unidad.push(newOrder[`unidad_medida_${i}`]);
    }

    const elementos = recursos_nombres.filter(elemento => elemento != '' && elemento != undefined )
    recursos_precios = recursos_precios.filter(valor => valor != null)
    recursos_cantidad = recursos_cantidad.filter(valor => valor != null)
    recursos_unidad = recursos_unidad.filter(valor => valor != '')

    if (elementos.length == 0) {
        throw new Error(`Productos inválidos. No existen productos.`)
    }
    const tempElement = new Set(elementos) 
    if (tempElement.size != elementos.length) {
        throw new Error(`Productos inválidos. Hay productos duplicados.`)
    }
    
    for (let i = 0;i<elementos.length;i++) {
        let band = false
        for (let j = 0;j< allProductsCache.length;j++) {
            if (elementos[i] == allProductsCache[j].nombre) {
                band = true
                break
            }
        }
        if (!band) {
            throw new Error(`Productos inválidos. El producto: ${i+1} no existe.`)
        }
    }

    for (let i=0;i<recursos_precios.length;i++) {
        if (recursos_precios[i] <= 0) {
            throw new Error(`Productos inválidos. Precio menor o igual a 0 en el producto: ${i+1}.`)
        }
    }

    for (let i=0;i<recursos_cantidad;i++) {
        if (recursos_cantidad[i] <= 0) {
            throw new Error(`Productos inválidos. Cantidad menor o igual a 0 en el producto: ${i+1}.`)
        }
    }

    for (let i=0;i<recursos_unidad.length;i++) {
        if ((!(/^[a-zA-Z][a-zA-Z0-9]*$/.test(recursos_unidad[i])))) {
            throw new Error(`Productos inválidos. Unidad inválida en el producto: ${i+1}.`)
        }
    }
    
    const date = new Date();
    const formattedDate = new Date(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);

    if (newOrder.fecha_esperada) {
        const dateSelected = new Date(newOrder.fecha_esperada)

        if (formattedDate > dateSelected) {
            throw new Error("Fecha inválida. La fecha seleccionada es anterior a hoy.")
        }
    }
    
    if (newOrder.fecha_pago != null) {
        const dateSelected = new Date(newOrder.fecha_pago)
        
        if (formattedDate > dateSelected) {
            throw new Error("Fecha inválida. La fecha seleccionada es anterior a hoy.")
        }
    }
}

export async function totalizeProducts() {
    const allProducts = [];
    
    const [
        [inv_products],
        [inv_instruments],
        [inv_equipment],
        [inv_spares],
        [products]
    ] = await Promise.all([
        pool.query(`SELECT * FROM modelos_productos`),
        pool.query(`SELECT * FROM instrumentos`),
        pool.query(`SELECT * FROM modelos_equipos`),
        pool.query(`SELECT * FROM repuestos`),
        pool.query(`SELECT * FROM recursos`)
    ]);

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