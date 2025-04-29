import { pool } from "../../db.js";

export const agregar = async (req, res) => {
    let connection;
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

        connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [result] = await connection.query(
                `INSERT INTO pagos_empleados 
                (fecha_pago, empleado_id, concepto, monto) 
                VALUES (?, ?, ?, ?)`,
                [fecha_pago, empleado_id, concepto, monto]
            );

            await connection.commit();

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
            await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }

    } catch (error) {
        console.error('Error al registrar pago:', error);
        return res.status(500).json({
            success: false,
            error: "Error al registrar pago",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
export const actualizar = async (req, res) => {
    let connection;
    try {
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
                error: 'ID de pago no válido',
                campoInvalido: 'pago_id'
            });
        }

        // Validación de campos requeridos y tipos
        const errores = [];
        const camposRequeridos = {
            fecha_pago: { valor: fecha_pago, tipo: 'date' },
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

        connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            const [result] = await connection.query(
                `UPDATE pagos_empleados SET 
                    fecha_pago = ?,
                    empleado_id = ?,
                    concepto = ?,
                    monto = ?
                WHERE pago_id = ?`,
                [fecha_pago, empleado_id, concepto, monto, pago_id]
            );

            if (result.affectedRows === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    error: "No se encontró el pago especificado"
                });
            }

            // Obtener registro actualizado
            const [updatedPago] = await connection.query(
                `SELECT * FROM pagos_empleados WHERE pago_id = ?`,
                [pago_id]
            );

            await connection.commit();

            return res.status(200).json({
                success: true,
                message: "Pago actualizado correctamente",
                data: updatedPago[0],
                cambios: result.affectedRows
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            if (connection) connection.release();
        }

    } catch (error) {
        console.error('Error al actualizar pago:', error);
        return res.status(500).json({
            success: false,
            error: "Error al actualizar pago",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
export const eliminarYReorganizarEmpleado = async (req, res) => {
    try {
      const id = req.params.id;
  
      if (!id) {
        return res.status(400).json({ error: 'ID es requerido' });
      }
  
      const [data] = await pool.query(
        `DELETE FROM pagos_empleados WHERE empleado_id = ?`,[empleado_id]
      );
  
      if (data.affectedRows === 0) {
        return res.status(404).json({ error: 'No se encontró ninguna pago con el ID proporcionado' });
      }
  
      res.status(200).json({
        message: 'pago eliminada exitosamente',
        deletedId: id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
