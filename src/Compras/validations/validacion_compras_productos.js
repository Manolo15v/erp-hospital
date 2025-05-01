import { pool } from "../../db.js";

export async function validations_productos(newProduct) {
    
    if (newProduct.nombre == undefined) {
        throw new Error(`Nombre inválido. nombre faltante`)
    }

    const [consulta] = await pool.query('SELECT nombre FROM recursos');
    for (let i = 0; i < consulta.length; i++) {
        if (consulta[i].nombre == newProduct.nombre) {
            throw new Error(`El producto: ${newProduct.nombre} ya está disponible.`);
        } 
    }

    const regexSimbosProduct = /[!¡?¿@$€¥^&*#+=<>|~%'"`\\]/g;

    if (regexSimbosProduct.test(newProduct.nombre)) {
        throw new Error(`Nombre inválido. Caracteres prohibidos: ${newProduct.nombre.match(regexSimbosProduct).join(', ')}.`)
    }

    if (newProduct.nombre.length < 3 ) {
        throw new Error(`Nombre inválido. Debe contener más de 3 caracteres.`)
    }

    if (newProduct.codigo == '') {
        throw new Error(`Código del producto faltante.`)
    }
}