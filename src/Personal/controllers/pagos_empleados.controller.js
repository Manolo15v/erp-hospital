import { pool } from "../../db.js";

export const agregar = async (req, res) => {
    try {
        const { fecha_pago, empleado_id, concepto, monto } = req.body;

        // Validación de campos requeridos
        const camposRequeridos = {
            fecha_pago: 'Fecha de pago',
            empleado_id: 'ID de empleado',
            concepto: 'Concepto',
            monto: 'Monto'
        };

        const faltantes = Object.entries(camposRequeridos)
            .filter(([key]) => !req.body[key])
            .map(([_, name]) => name);

        if (faltantes.length > 0) {
            return res.status(400).json({
                success: false,
                error: `Campos requeridos faltantes: ${faltantes.join(', ')}`,
                camposFaltantes: faltantes
            });
        }

        // Validación de tipos de datos
        if (isNaN(empleado_id) ){
            return res.status(400).json({
                success: false,
                error: 'ID de empleado no válido'
            });
        }

        if (isNaN(monto) ){
            return res.status(400).json({
                success: false,
                error: 'Monto debe ser un valor numérico'
            });
        }


            const [result] = await pool.query(
                `INSERT INTO pagos_empleados 
                (fecha_pago, empleado_id, concepto, monto) 
                VALUES (?, ?, ?, ?)`,
                [fecha_pago, empleado_id, concepto, monto]
            );


            return res.status(201).json({
                success: true,
                message: "Pago registrado correctamente",
                id: result.insertId,
                data: {
                    fecha_pago,
                    empleado_id,
                    concepto,
                    monto
                }
            });

    } catch (error) {
        console.error('Error al registrar pago:', error);
        return res.status(500).json({
            success: false,
            error: "Error al registrar pago",
        });
    }
};
export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            fecha_pago,
            empleado_id,
            concepto,
            monto
        } = req.body;

        // Validación del ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: 'ID de pago no válido',
                campoInvalido: 'pago_id'
            });
        }

        // Validación de campos requeridos y tipos
        const errores = [];
        const camposRequeridos = {
            empleado_id: { valor: empleado_id, tipo: 'number' },
            concepto: { valor: concepto, tipo: 'string' },
            monto: { valor: monto, tipo: 'number' }
        };

        Object.entries(camposRequeridos).forEach(([key, { valor, tipo }]) => {
            if (valor === undefined || valor === null || valor === '') {
                errores.push(`Campo requerido faltante: ${key}`);
            }
            if (typeof valor !== tipo && valor !== '') {
                errores.push(`Tipo inválido para ${key} (esperado ${tipo})`);
            }
        });

        if (errores.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Errores de validación',
                detalles: errores
            });
        }


            const [result] = await pool.query(
                `UPDATE pagos_empleados SET 
                    fecha_pago = ?,
                    empleado_id = ?,
                    concepto = ?,
                    monto = ?
                WHERE pago_id = ?`,
                [fecha_pago, empleado_id, concepto, monto, id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    error: "No se encontró el pago especificado"
                });
            }

            // Obtener registro actualizado
            const [updatedPago] = await pool.query(
                `SELECT * FROM pagos_empleados WHERE pago_id = ?`,
                [id]
            );


            return res.status(200).json({
                success: true,
                message: "Pago actualizado correctamente",
                data: updatedPago[0],
                cambios: result.affectedRows
            });


    } catch (error) {
        console.error('Error al actualizar pago:', error);
        return res.status(500).json({
            success: false,
            error: "Error al actualizar pago"
        });
    }
};
export const eliminarYReorganizarEmpleado = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
        }

        const [data] = await pool.query(
        `DELETE FROM pagos_empleados WHERE pago_id = ?`,[id]
        );

        if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna pago con el ID proporcionado' });
        }

        res.status(200).json({
        message: 'pago eliminada exitosamente',
        deletedId: id,
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: error.message });
    }
};

export const cargar = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * FROM pagos_empleados;`);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const obtener = async (req, res) => {
    try {
        const { id } = req.params;

        // Validación del ID
        if (!id || isNaN(id)) {
            return res.status(400).json({
                success: false,
                error: "Se requiere un ID del pago válido"
            });
        }

            const [result] = await pool.query(
                `SELECT * FROM pagos_empleados roles WHERE pago_id = ?`,[id]
            );

            if (result.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: "pago no encontrado"
                });
            }

            return res.status(200).json({
                success: true,
                data: result[0]
            });


    } catch (error) {
        console.error('Error al obtener pago:', error);
        return res.status(500).json({
            success: false,
            error: "Error al obtener pago"
        });
    }
};
