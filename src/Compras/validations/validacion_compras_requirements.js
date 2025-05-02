import { pool } from "../../db.js";

export async function searchProducts(nameProduct) {
    const [products] = await pool.query(`SELECT * FROM recursos`);
    const id = products.find(product => product.nombre == nameProduct)?.recurso_id;
    return id;
}

export async function validations_empleado(empleadoNombre) {
    const [employees] = await pool.query('SELECT * from empleados')
    var empleado = employees.find(employee => `${employee.nombre} ${employee.apellido}` == empleadoNombre);
    
    if (empleado == undefined) {
        throw new Error("Empleado inválido. No existe.")
    } else {
        return empleado
    }
}

export async function validations_departamento(empleado) {
    const [departaments] = await pool.query('SELECT * FROM departamentos')
    var departmento = departaments.find(department => department.departamento_id == empleado.departamento_id);
    
    if (departmento == undefined) {
        throw new Error("Departamento inválido. No existe.")
    } else {
        return departmento.nombre
    }
}

export async function validations_requirements(newRequirement,recursosList) {
    const [tempProductos] = await pool.query('SELECT nombre FROM recursos')
    const elementos = recursosList.filter(elemento => elemento != '')

    if (elementos.length == 0) {
        throw new Error(`Productos inválidos. No existen productos.`)
    }

    const tempElement = new Set(elementos) 
    if (tempElement.size != elementos.length) {
        throw new Error(`Productos inválidos. Hay productos duplicados.`)
    }

    for (let i = 0;i<elementos.length;i++) {
        let band = false
        for (let j = 0;j<tempProductos.length;j++) {
            if (elementos[i] === tempProductos[j].nombre) {
                band = true
                break
            }
        }
        if (!band) {
            throw new Error(`Productos inválidos. El producto: ${i+1} no existe.`)
        }
    }

    let recursos_cantidad = [];
    let recursos_unidad = [];

    for (let i=0;i<5;i++) {
        recursos_cantidad.push(newRequirement[`cantidad_${i}`]);
        recursos_unidad.push(newRequirement[`unidad_medida_${i}`]);
    }

    recursos_cantidad = recursos_cantidad.filter(valor => valor != null)
    recursos_unidad = recursos_unidad.filter(valor => valor != '')

    for (let i=0;i<recursos_cantidad.length;i++) {
        if (recursos_cantidad[i] <= 0) {
            throw new Error(`Productos inválidos. Cantidad menor o igual a 0 en el producto: ${i+1}.`)
        }
    }

    for (let i=0;i<recursos_unidad.length;i++) {
        if ((!(/^[a-zA-Z][a-zA-Z0-9]*$/.test(recursos_unidad[i])))) {
            throw new Error(`Productos inválidos. Unidad inválida en el producto: ${i+1}.`)
        }
    }
}

export async function validations_requirements_request(newRequirement, recursosList) {
    const [tempProductos] = await pool.query('SELECT nombre FROM recursos')
    const [tempProductos2] = await pool.query('SELECT nombre from modelos_equipos')

    const elementos = recursosList.filter(elemento => elemento != '')

    if (elementos.length == 0) {
        throw new Error(`Productos inválidos. No existen productos.`)
    }
    const tempElement = new Set(elementos) 
    if (tempElement.size != elementos.length) {
        throw new Error(`Productos inválidos. Hay productos duplicados.`)
    }

    for (let i = 0;i<elementos.length;i++) {
        let band = false
        let band2 = false
        for (let j = 0;j<tempProductos.length;j++) {
            if (elementos[i] === tempProductos[j].nombre) {
                band = true
                break
            }
        }
        if (!band) {
            for (let j=0;j<tempProductos2.length;j++) {
                if (elementos[i] === tempProductos2[j].nombre) {
                    band2 = true
                    break
                }
            }
        } 

        if (!band && !band2) {
            throw new Error("Producto invalido. El producto no existe")
        }
    }

    let recursos_cantidad = [];
    let recursos_unidad = [];

    for (let i=0;i<5;i++) {
        recursos_cantidad.push(newRequirement[`cantidad_${i}`]);
        recursos_unidad.push(newRequirement[`unidad_medida_${i}`]);
    }

    recursos_cantidad = recursos_cantidad.filter(valor => valor != null)
    recursos_unidad = recursos_unidad.filter(valor => valor != '')

    for (let i=0;i<recursos_cantidad.length;i++) {
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

    if (newRequirement.fecha_requerida) {
        const dateSelected = new Date(newRequirement.fecha_requerida)

        if (formattedDate > dateSelected) {
            throw new Error("Fecha inválida. La fecha seleccionada es anterior a hoy.")
        }
    }
}
  
export async function ProductsRequeriments() {
    const reqProducts = []
    
    const [
        [inv_equipment],
        [products]
    ] = await Promise.all([
        pool.query(`SELECT * FROM modelos_equipos`),
        pool.query(`SELECT * FROM recursos`)
    ]);

    products.forEach(product => {
        reqProducts.push({
            id: product.recurso_id,
            codigo: product.codigo_recurso,
            nombre: product.nombre,
            descripcion: product.descripcion,
            tipo: 'Recurso de Requisición',
        });
    });
    
    inv_equipment.forEach(equipment => {
        reqProducts.push({
            id: equipment.Id_Modelo,
            codigo: equipment.Codigo,
            nombre: equipment.Nombre,
            descripcion: equipment.Descripcion,
            tipo: 'Equipo de Inventario',
        });
    });

    return reqProducts

}