import { pool } from "../../db.js";

export async function validations_proveedores(newSupplier,id) {
    let [consulta] = []

    if (id == null) {
        [consulta] = await pool.query('SELECT nombre, email, telefono, rif FROM proveedores');
    } else {
        [consulta] = await pool.query('SELECT proveedor_id FROM proveedores');
        if (consulta.find(clave => clave.proveedor_id == id) != undefined) {
            [consulta] = await pool.query('SELECT nombre, email, telefono, rif FROM proveedores WHERE proveedor_id != ?',id);
        } else {
            throw new Error('Error. Proveedor inexistente')
        }
    }

    if (newSupplier == undefined)  {
        throw new Error('Error. Formulario vacio')
    }

    if (newSupplier.nombre == undefined)  {
        throw new Error('Razón social invalida. nombre faltante')
    }

    if (newSupplier.email == undefined)  {
        throw new Error('Correo invalido. correo faltante')
    }

    if (newSupplier.telefono == undefined)  {
        throw new Error('Telefono invalido. telefono faltante')
    }

    if (newSupplier.rif == undefined)  {
        throw new Error('Rif invalido. rif faltante')
    }

    if (newSupplier.direccion == undefined)  {
        throw new Error('Dirección invalida. Dirreción faltante')
    }

    if (newSupplier.ref_direccion == undefined)  {
        throw new Error('Dirección invalida. Dirreción de referencia faltante')
    }

    if (newSupplier.estado == undefined)  {
        throw new Error('Estado invalido. Estado faltante')
    }

    for (let i = 0; i<consulta.length; i++) {
        if (consulta[i].nombre === newSupplier.nombre) {
            throw new Error(`La razón social "${newSupplier.nombre}" ya ha sido registrada.`);
        }
        if (consulta[i].email === newSupplier.email) {
            throw new Error(`El correo electrónico "${newSupplier.email}" ya ha sido registrado.`);
        }
        if (consulta[i].telefono === newSupplier.telefono) {
            throw new Error(`El teléfono "${newSupplier.telefono}" ya ha sido registrado.`);
        }
        if (consulta[i].rif === newSupplier.rif) {
            throw new Error(`El RIF "${newSupplier.rif}" ya ha sido registrado.`);
        }

    }

    const regexName = /^(?!\d)[A-ZÁÉÍÓÚÑ][a-záéíóúñ0-9]+(?:[ .°´¸-][A-ZÁÉÍÓÚÑa-záéíóúñ0-9]+)*(?:\s?(?:C\.A|S\.A|R\.L|S\.C\.S|S\.R\.L|S\.A\.S)\.?)?$/i;
    const regexSimbolsName = /[@#$%^&*_=+[\]{}|;:"'<>?¡!¿]/;

    if (newSupplier.nombre.length < 3 || newSupplier.nombre.length > 120) {
        throw new Error("Razón social inválida. El registro debe tener entre 3 y 120 caracteres.");
    }

    if (!regexName.test(newSupplier.nombre) || regexSimbolsName.test(newSupplier.nombre)) {
        throw new Error("Razón social inválida. No use caracteres especiales o números como primer caracter.");
    }

    const direccion = newSupplier.direccion.split(",")

    if (/[01234567890@#$%^&*_=+[\]{}|;:"'<>?¡!¿]/.test(direccion[0])) {
        throw new Error("Dirección inválida. Caracteres inválidos en la primera posición.");
    }

    if (direccion.length < 2) {
        throw new Error("Direccion inválida. Use el formato: Estado, Municipio, ...");
    }

    for (let i=0;i<direccion.length;i++) {
        if (direccion[i].trim().length < 3) {
            throw new Error("Dirección inválida. Información insuficiente en la dirección."); 
        }
    }

    const regexRif = /^(?:[VEPGJC])?-?(\d{8})\d$/;
    if (!regexRif.test(newSupplier.rif.replace(/\s+/g, ''))) {
        throw new Error("RIF inválido. Implemente el formato: V-123456789."); 
    } 

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regexEmail.test(newSupplier.email)) {
        throw new Error("Correo electrónico inválido. Implemente el formato: nombre@dominio.com."); 
    }

    const tlf = newSupplier.telefono.split("-")
    if (tlf[1].trim().length != 7) {
        throw new Error("Teléfono inválido. Implemente el formato: 0414-1234567.")
    }

}