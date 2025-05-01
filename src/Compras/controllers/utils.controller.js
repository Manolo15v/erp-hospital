import { pool } from "../../db.js";
import ExcelJS from 'exceljs';
import { totalizeProducts } from "../validations/validacion_compras_orders.js";
import { loadOrders, loadRequirements } from "../validations/loads.js";
import PDFDocument from 'pdfkit';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export const excelSuppliers = async (req, res) => {
    const [suppliers] = await pool.query(`SELECT * from proveedores`);
    const data = suppliers.map(({ nombre, direccion, ref_direccion, email, telefono, rif, estado }) => ({
        'Nombre del Proveedor': nombre,
        'Dirección': direccion,
        'Ref. Dirección': ref_direccion,
        'Correo Electrónico': email,
        'Teléfono': telefono,
        'RIF': rif,
        'Estado del Proveedor': estado,
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Proveedores');

    worksheet.columns = [
        { header: 'Nombre del Proveedor', key: 'Nombre del Proveedor' },
        { header: 'Dirección', key: 'Dirección' },
        { header: 'Ref. Dirección', key: 'Ref. Dirección' },
        { header: 'Correo Electrónico', key: 'Correo Electrónico' },
        { header: 'Teléfono', key: 'Teléfono' },
        { header: 'RIF', key: 'RIF' },
        { header: 'Estado del Proveedor', key: 'Estado del Proveedor' },
    ];

    data.forEach(row => worksheet.addRow(row));

    applyExcelFormatting(worksheet, data);

    const filePath = 'Proveedores.xlsx';
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}

export const excelProducts = async (req,res) => {
    const allProducts = await totalizeProducts();

    const data = allProducts.map(({ codigo, nombre, descripcion, tipo }) => ({
        'Código': codigo,
        'Nombre': nombre,
        'Descripción': descripcion,
        'Tipo': tipo,
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    worksheet.columns = [
        { header: 'Código', key: 'Código' },
        { header: 'Nombre', key: 'Nombre' },
        { header: 'Descripción', key: 'Descripción' },
        { header: 'Tipo', key: 'Tipo' },
    ];

    data.forEach(row => worksheet.addRow(row));

    applyExcelFormatting(worksheet, data);

    const filePath = 'Productos.xlsx';
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}

export const excelOrders = async (req, res) => {
    const allProducts = await totalizeProducts();
    const allOrders = await loadOrders(allProducts);

    const data = allOrders.map(({ numero_orden, proveedor, fecha_orden, fecha_modificacion, fecha_esperada, fecha_entrega, forma_pago, fecha_pago, recurso_1, precio_unitario_1, cantidad_1, unidad_medida_1, recurso_2, precio_unitario_2, cantidad_2, unidad_medida_2, recurso_3, precio_unitario_3, cantidad_3, unidad_medida_3, recurso_4, precio_unitario_4, cantidad_4, unidad_medida_4, recurso_5, precio_unitario_5, cantidad_5, unidad_medida_5, monto_total, estado, observaciones, tipo_orden }) => ({
        'Número de Orden': numero_orden,
        'Tipo de Orden': tipo_orden,
        'Proveedor': proveedor,
        'Fecha de Orden': fecha_orden,
        'Fecha de Modificación': fecha_modificacion,
        'Fecha Esperada': fecha_esperada,
        'Fecha de Entrega': fecha_entrega || 'N/A',
        'Forma de Pago': forma_pago,
        'Fecha de Pago': fecha_pago || 'N/A',
        'Moneda': "Bs",
        'Producto 1': recurso_1,
        'Precio Unitario 1': precio_unitario_1,
        'Cantidad 1': cantidad_1,
        'U/M 1': unidad_medida_1,
        'Producto 2': recurso_2,
        'Precio Unitario 2': precio_unitario_2,
        'Cantidad 2': cantidad_2,
        'U/M 2': unidad_medida_2,
        'Producto 3': recurso_3,
        'Precio Unitario 3': precio_unitario_3,
        'Cantidad 3': cantidad_3,
        'U/M 3': unidad_medida_3,
        'Producto 4': recurso_4,
        'Precio Unitario 4': precio_unitario_4,
        'Cantidad 4': cantidad_4,
        'U/M 4': unidad_medida_4,
        'Producto 5': recurso_5,
        'Precio Unitario 5': precio_unitario_5,
        'Cantidad 5': cantidad_5,
        'U/M 5': unidad_medida_5,
        'Monto Total': monto_total,
        'Estado': estado,
        'Observaciones': observaciones,
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Órdenes de Compra');

    worksheet.columns = [
        { header: 'Número de Orden', key: 'Número de Orden' },
        { header: 'Tipo de Orden', key: 'Tipo de Orden' },
        { header: 'Proveedor', key: 'Proveedor' },
        { header: 'Fecha de Orden', key: 'Fecha de Orden' },
        { header: 'Fecha de Modificación', key: 'Fecha de Modificación' },
        { header: 'Fecha Esperada', key: 'Fecha Esperada' },
        { header: 'Fecha de Entrega', key: 'Fecha de Entrega' },
        { header: 'Moneda', key: 'Moneda' },
        { header: 'Producto 1', key: 'Producto 1' },
        { header: 'Precio Unitario 1', key: 'Precio Unitario 1' },
        { header: 'Cantidad 1', key: 'Cantidad 1' },
        { header: 'U/M 1', key: 'U/M 1' },
        { header: 'Producto 2', key: 'Producto 2' },
        { header: 'Precio Unitario 2', key: 'Precio Unitario 2' },
        { header: 'Cantidad 2', key: 'Cantidad 2' },
        { header: 'U/M 2', key: 'U/M 2' },
        { header: 'Producto 3', key: 'Producto 3' },
        { header: 'Precio Unitario 3', key: 'Precio Unitario 3' },
        { header: 'Cantidad 3', key: 'Cantidad 3' },
        { header: 'U/M 3', key: 'U/M 3' },
        { header: 'Producto 4', key: 'Producto 4' },
        { header: 'Precio Unitario 4', key: 'Precio Unitario 4' },
        { header: 'Cantidad 4', key: 'Cantidad 4' },
        { header: 'U/M 4', key: 'U/M 4' },
        { header: 'Producto 5', key: 'Producto 5' },
        { header: 'Precio Unitario 5', key: 'Precio Unitario 5' },
        { header: 'Cantidad 5', key: 'Cantidad 5' },
        { header: 'U/M 5', key: 'U/M 5' },
        { header: 'Monto Total', key: 'Monto Total' },
        { header: 'Estado', key: 'Estado' },
        { header: 'Observaciones', key: 'Observaciones' },
    ]

    data.forEach(row => worksheet.addRow(row));

    applyExcelFormatting(worksheet, data);

    const filePath = 'Órdenes de Compra.xlsx';
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}

export const excelRequirements = async (req, res) => {
    const allProducts = await totalizeProducts();
    const allRequirements = await loadRequirements(allProducts);

    const data = allRequirements.map(({ solicitante, area, fecha_emision, fecha_modificacion, fecha_cierre, recurso_1, cantidad_1, unidad_medida_1, recurso_2, cantidad_2, unidad_medida_2, recurso_3, cantidad_3, unidad_medida_3, recurso_4, cantidad_4, unidad_medida_4, recurso_5, cantidad_5, unidad_medida_5, motivo, descripcion, estado, observaciones }) => ({
        'Solicitante': solicitante,
        'Departamento': area,
        'Fecha de Emisión': fecha_emision,
        'Fecha de Modificación': fecha_modificacion,
        'Fecha de Cierre': fecha_cierre || 'N/A',
        'Producto 1': recurso_1,
        'Cantidad 1': cantidad_1,
        'U/M 1': unidad_medida_1,
        'Producto 2': recurso_2,
        'Cantidad 2': cantidad_2,
        'U/M 2': unidad_medida_2,
        'Producto 3': recurso_3,
        'Cantidad 3': cantidad_3,
        'U/M 3': unidad_medida_3,
        'Producto 4': recurso_4,
        'Cantidad 4': cantidad_4,
        'U/M 4': unidad_medida_4,
        'Producto 5': recurso_5,
        'Cantidad 5': cantidad_5,
        'U/M 5': unidad_medida_5,
        'Motivo': motivo,
        'Descripción': descripcion,
        'Estado': estado,
        'Observaciones': observaciones,
    }));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Requisitorias');

    worksheet.columns = [
        { header: 'Solicitante', key: 'Solicitante' },
        { header: 'Departamento', key: 'Departamento' },
        { header: 'Fecha de Emisión', key: 'Fecha de Emisión' },
        { header: 'Fecha de Modificación', key: 'Fecha de Modificación' },
        { header: 'Fecha de Cierre', key: 'Fecha de Cierre' },
        { header: 'Producto 1', key: 'Producto 1' },
        { header: 'Cantidad 1', key: 'Cantidad 1' },
        { header: 'U/M 1', key: 'U/M 1' },
        { header: 'Producto 2', key: 'Producto 2' },
        { header: 'Cantidad 2', key: 'Cantidad 2' },
        { header: 'U/M 2', key: 'U/M 2' },
        { header: 'Producto 3', key: 'Producto 3' },
        { header: 'Cantidad 3', key: 'Cantidad 3' },
        { header: 'U/M 3', key: 'U/M 3' },
        { header: 'Producto 4', key: 'Producto 4' },
        { header: 'Cantidad 4', key: 'Cantidad 4' },
        { header: 'U/M 4', key: 'U/M 4' },
        { header: 'Producto 5', key: 'Producto 5' },
        { header: 'Cantidad 5', key: 'Cantidad 5' },
        { header: 'U/M 5', key: 'U/M 5' },
        { header: 'Motivo', key: 'Motivo' },
        { header: 'Descripción', key: 'Descripción' },
        { header: 'Estado', key: 'Estado' },
        { header: 'Observaciones', key: 'Observaciones' },
    ]

    data.forEach(row => worksheet.addRow(row));

    applyExcelFormatting(worksheet, data);

    const filePath = 'Requisitorias.xlsx';
    await workbook.xlsx.writeFile(filePath);

    res.download(filePath, (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
}

export const downloadPDF = async(req, res) => {
    const id = req.body.id
    console.log(id)
    
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const directorio = path.join(__dirname, '../utils/PDFs',`orden_compra_${id}.pdf`);
    try {
        res.download(directorio, (err) => {
            if (err) {
                res.status(500).send(err);
            }
        });
    } catch  (error) {
        console.error(error.message)
        res.status(500).json({error: error.message})
    }
}

export const createPDF = async (req, res) => {
    const { order, code, fecha } = req.body;
    try {
        console.log(order)
        await generatePDF(res, order, code, fecha);
    } catch (error) {
        console.error('Error al crear el PDF:', error.message);
        if (!res.headersSent) {
            res.status(500).json({ error: error.message });
        }
    }
}

const applyExcelFormatting = (sheet, data) => {
    for (let i = 1; i <= data.length + 1; i++) {
        const row = sheet.getRow(i);
        if (row) {
            row.eachCell((cell) => {
                cell.font = {
                    name: 'Arial',
                    size: 11,
                };
                cell.alignment = {
                    wrapText: true,
                };
            });
        }
    }

    const headerRow = sheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF008000' },
        };
        cell.font = {
            name: 'Arial',
            size: 11,
            bold: true,
            color: { argb: 'FFFFFFFF' },
        };
    });

    sheet.columns.forEach((col) => {
        const headSize = col.header ? col.header.length : 10;
        let max = headSize;
    
        col.eachCell({ includeEmpty: true }, (cell) => {
            const cellSize = cell.text ? cell.text.length : 0;
            if (cellSize > max) {
                max = cellSize;
            }
        });
    
        col.width = Math.min(Math.max(max + 6, 10), 25);
    });
};

async function generatePDF(res, newOrder, numero_orden, fecha_orden) {
    const doc =  new PDFDocument({ size: 'A4', margin: 30 });
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const ruta = path.join(__dirname, '../utils/PDFs', `orden_compra_${numero_orden}.pdf`);
    doc.pipe(fs.createWriteStream(ruta)) 
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=orden_de_compra.pdf');

    doc.pipe(res);

    doc.moveDown(4);

    doc.fontSize(20)
    .font('Helvetica-Bold')
    .fillColor('black')
    .text('ORDEN DE COMPRA', { align: 'center' });

    doc.moveDown(1.5);

    doc.fontSize(12)
    .font('Helvetica')
    .text('Emisor: Grey Sloan Memorial Hospital', {align: 'left'})
    .moveDown(2)
    .text(`Proveedor: ${newOrder.proveedor}`, {align:'left'})
    .text(`Número de orden: ${numero_orden}`, {align:'left'})
    .moveDown(1)
    if (fecha_orden == '') {
        doc.text(`Fecha de orden: ${newOrder.fecha_orden}`, {align: 'left'}) 
    } else  {
        doc.text(`Fecha de orden: ${fecha_orden}`, {align: 'left'})
    }
    doc.text(`Fecha tentativa de entrega: ${newOrder.fecha_esperada ? `${newOrder.fecha_esperada}` : 'N/A'}`, {align: 'left'})
    .moveDown(1)
    .text(`Forma de pago: ${newOrder.forma_pago}`, {align: 'left'})
    .text(`${newOrder.fecha_pago ? `Fecha de pago: ${newOrder.fecha_pago}` : '' }`, {align: 'left'})
    .moveDown(2)

    const recursosList = [
        newOrder.recurso_1, newOrder.recurso_2, newOrder.recurso_3, 
        newOrder.recurso_4, newOrder.recurso_5
    ].filter(elemento => elemento != '');

    const listPrecio = [
        newOrder.precio_unitario_1, newOrder.precio_unitario_2, 
        newOrder.precio_unitario_3, newOrder.precio_unitario_4, 
        newOrder.precio_unitario_5
    ].filter(valor => valor != null);

    const listCantidad = [
        newOrder.cantidad_1, newOrder.cantidad_2, 
        newOrder.cantidad_3, newOrder.cantidad_4, 
        newOrder.cantidad_5
    ].filter(valor => valor != null);

    const listUnidad = [
        newOrder.unidad_medida_1, newOrder.unidad_medida_2, 
        newOrder.unidad_medida_3, newOrder.unidad_medida_4, 
        newOrder.unidad_medida_5
    ].filter(valor => valor != '');

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const colWidth = pageWidth / 4;
    const startY = doc.y;
    const rowHeight = 25;

    doc.font('Helvetica-Bold')
    .fillColor('black')
    .text('PRODUCTO', 50, startY, { width: colWidth, align: 'left' })
    .text('PRECIO UNITARIO', 50 + colWidth, startY, { width: colWidth, align: 'center' })
    .text('CANTIDAD', 50 + colWidth * 2, startY, { width: colWidth, align: 'center' })
    .text('UNIDAD', 50 + colWidth * 3, startY, { width: colWidth - 20, align: 'center' });

    doc.moveTo(50, startY + 20)
    .lineTo(50 + pageWidth - 20, startY + 20)
    .stroke();

    recursosList.forEach((producto, i) => {
        const rowY = startY + 25 + (rowHeight * i);
        
        doc.font('Helvetica')
        .fillColor('black')
        .text(producto, 50, rowY, { width: colWidth, align: 'left' })
        .text(`${listPrecio[i].toString()} Bs`, 50 + colWidth, rowY, { width: colWidth, align: 'center' })
        .text(listCantidad[i].toString(), 50 + colWidth * 2, rowY, { width: colWidth, align: 'center' })
        .text(listUnidad[i], 50 + colWidth * 3, rowY, { width: colWidth - 20, align: 'center' });
        
        if (i < recursosList.length - 1) {
            doc.moveTo(50, rowY + 20)
            .lineTo(50 + pageWidth - 20, rowY + 20)
            .strokeColor('#cccccc')
            .stroke();
        }
    });

    doc.moveDown(3); 

    doc.fontSize(12)
    .font('Helvetica')
    .text(`Subtotal: ${((newOrder.monto_total * 100)/116).toFixed(2)} Bs`, {align: 'right'})
    .moveDown(1)
    .text(`IVA: ${((newOrder.monto_total * 16)/116).toFixed(2)} Bs`, {align: 'right'})
    .moveDown(1)
    .text(`Monto total: ${newOrder.monto_total} Bs`, {align: 'right'})
    .moveDown(2);

    doc.end();
}