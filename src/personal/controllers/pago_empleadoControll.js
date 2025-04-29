const { raw } = require('mysql2')
const db = require('../database/conexin.js')
class pago_empleado {
    constructor() {};

    agregar(req, res) {
        const { fecha_pago, empleado_id, concepto, monto } = req.body;

        db.query(
            `INSERT INTO pagos_empleados 
            (fecha_pago, empleado_id, concepto, monto) 
            VALUES (?,?,?,?)`,
            [fecha_pago, empleado_id, concepto, monto],
            (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err);
                    return res.status(500).json({
                        success: false,
                        error: "Error al insertar en la base de datos",
                        details: err.message
                    });
                }
                return res.status(201).json({
                    success: true,
                    message: "Pago registrado correctamente",
                    id: result.insertId
                });
            }
        );
    }

    actualizar(req, res) {
        const { 
            pago_id,
            fecha_pago,
            empleado_id,
            concepto,
            monto
        } = req.body;
    
        // Validación del ID
        if (!pago_id || isNaN(pago_id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de pago no válido'
            });
        }
    
        // Validación de campos requeridos
        const camposRequeridos = {
            fecha_pago: 'Fecha de pago',
            empleado_id: 'ID de empleado',
            concepto: 'Concepto de pago',
            monto: 'Monto del pago'
        };
    
        const faltantes = Object.entries(camposRequeridos)
            .filter(([key]) => req.body[key] === undefined || req.body[key] === null || req.body[key] === '')
            .map(([_, value]) => value);
    
        if (faltantes.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Campos requeridos faltantes: ${faltantes.join(', ')}`
            });
        }
    
        db.query(
            `UPDATE pagos_empleados SET 
                fecha_pago = ?,
                empleado_id = ?,
                concepto = ?,
                monto = ?
            WHERE pago_id = ?`,
            [fecha_pago, empleado_id, concepto, monto, pago_id],
            (err, result) => {
                if (err) {
                    console.error('Error al actualizar pago:', err);
                    return res.status(500).json({
                        success: false,
                        error: "Error al actualizar el pago",
                        details: process.env.NODE_ENV === 'development' ? err.message : undefined
                    });
                }
    
                if (result.affectedRows === 0) {
                    return res.status(404).json({
                        success: false,
                        error: "No se encontró el pago especificado"
                    });
                }
    
                return res.status(200).json({
                    success: true,
                    message: "Pago actualizado correctamente",
                    affectedRows: result.affectedRows
                });
            }
        );
    }

    eliminarYReorganizarEmpleado(req, res) {
        const { empleado_id } = req.body;

        if (!empleado_id || isNaN(empleado_id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de empleado no válido'
            });
        }
    
        db.query(
            `DELETE FROM pagos_empleados WHERE empleado_id = ?`,
            [empleado_id],
            (errDelete, resultDelete) => {
                if (errDelete) {
                    console.error('Error al eliminar registros:', errDelete);
                    return res.status(500).json({
                        success: false,
                        error: "Error al eliminar registros del empleado",
                        details: process.env.NODE_ENV === 'development' ? errDelete.message : undefined
                    });
                }
    
                return res.status(200).json({
                    success: true,
                    message: `Se eliminaron ${resultDelete.affectedRows} registros del empleado ${empleado_id}`,
                    deleted: resultDelete.affectedRows
                });
            }
        );
    }
}
module.exports = new pago_empleado();