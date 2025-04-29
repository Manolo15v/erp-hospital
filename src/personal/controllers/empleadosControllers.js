const db = require('../database/conexin.js')

class empleados{
    constructor(){

    };
    eliminar(req, res) {
        const { id } = req.params;
    
        // Validación básica del ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ 
                success: false,
                error: 'ID no válido'
            });
        }
    
        db.beginTransaction(async (beginErr) => {
            if (beginErr) {
                return res.status(500).json({ 
                    success: false,
                    error: 'Error al iniciar transacción'
                });
            }
    
            try {
                // Verificar si el empleado existe
                const [empleadoExistente] = await db.promise().query(
                    'SELECT * FROM empleados WHERE empleado_id = ?', 
                    [id]
                );
    
                if (empleadoExistente.length === 0) {
                    await db.promise().rollback();
                    return res.status(404).json({ 
                        success: false,
                        error: 'Empleado no encontrado'
                    });
                }
    
                const [deleteResult] = await db.promise().query(
                    'UPDATE empleados SET estado = ? WHERE empleado_id = ?', 
                    ['Inactivo', id]
                );
    
                if (deleteResult.affectedRows === 0) {
                    await db.promise().rollback();
                    return res.status(500).json({ 
                        success: false,
                        error: 'Error al eliminar empleado'
                    });
                }
    
                await db.promise().commit();
    
                return res.json({ 
                    success: true, 
                    message: 'Empleado marcado como inactivo'
                });
    
            } catch (error) {
                await db.promise().rollback();
                
                return res.status(500).json({ 
                    success: false,
                    error: 'Error al eliminar empleado'
                });
            }
        });
    }

    actualizar(req, res) {
        try {
            const { 
                id, 
                nombre, 
                apellido, 
                cedula, 
                fecha_nacimiento, 
                fecha_contratacion, 
                direccion, 
                email, 
                telefono, 
                rol_id, 
                cargo, 
                departamento_id, 
                sueldo,
                salario_neto, 
                cuenta,
                turno,
                dia,
                area,
                descripcion_empleado    
            } = req.body;
    
            // Validación de campos requeridos
            const camposRequeridos = {
                id: 'ID del empleado',
                nombre: 'Nombre',
                cedula: 'Cédula',
                sueldo: 'Sueldo',
                cuenta: 'Número de cuenta',
                turno: 'Turno',
                dia: 'Día'
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
    
            db.beginTransaction(async (beginErr) => {
                if (beginErr) {
                    return res.status(500).json({
                        success: false,
                        error: "Error al iniciar transacción",
                        details: beginErr.message
                    });
                }
    
                try {
                    // Actualización de empleado
                    const [empResults] = await db.promise().query(
                        `UPDATE empleados SET 
                            nombre = ?,
                            apellido = ?,
                            cedula = ?,
                            fecha_nacimiento = ?,
                            fecha_contratacion = ?,
                            direccion = ?,
                            email = ?,
                            telefono = ?,
                            rol_id = ?,
                            cargo = ?,
                            departamento_id = ?,
                            sueldo = ?, 
                            area = ?,
                            descripcion_empleado = ?
                        WHERE empleado_id = ?`,
                        [nombre, apellido, cedula, fecha_nacimiento, fecha_contratacion, 
                         direccion, email, telefono, rol_id, cargo, departamento_id, sueldo, area, descripcion_empleado, id]
                    );
    
                    if (empResults.affectedRows === 0) {
                        await db.promise().rollback();
                        return res.status(404).json({
                            success: false,
                            error: "Empleado no encontrado"
                        });
                    }
    
                    const [nomResults] = await db.promise().query(
                        `UPDATE nominas SET 
                            salario_base = ?,
                            salario_neto = ?,
                            numero_cuenta = ?
                        WHERE empleado_id = ?`,
                        [sueldo, salario_neto, cuenta, id]
                    );
    
                    const [existingHorario] = await db.promise().query(
                        `SELECT * FROM horarios WHERE empleado_id = ?`,
                        [id]
                    );
    
                    let horarioResults;
                    if (existingHorario.length > 0) {
                        [horarioResults] = await db.promise().query(
                            `UPDATE horarios SET 
                                turno = ?,
                                dia = ?
                            WHERE empleado_id = ?`,
                            [turno, dia, id]
                        );
                    } else {
                        [horarioResults] = await db.promise().query(
                            `INSERT INTO horarios 
                            (turno, dia, empleado_id) 
                            VALUES (?, ?, ?)`,
                            [turno, dia, id]
                        );
                    }
    
                    await db.promise().commit();
    
                    res.status(200).json({
                        success: true,
                        message: "Actualización completada",
                        detalles: {
                            empleado: empResults.affectedRows,
                            nomina: nomResults.affectedRows,
                            horario: horarioResults.affectedRows || (existingHorario.length > 0 ? 0 : 1)
                        }
                    });
    
                } catch (error) {
                    await db.promise().rollback();
                    console.error('Error en transacción:', error);
                    res.status(500).json({ 
                        success: false,
                        error: "Error al procesar la actualización",
                        details: process.env.NODE_ENV === 'development' ? error.message : undefined
                    });
                }
            });
    
        } catch (error) {
            console.error('Error en actualización:', error);
            res.status(500).json({ 
                success: false,
                error: "Error interno del servidor",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }

    consular(req,res){
        try{
            db.query(`SELECT 
                e.*, 
                r.nombre AS nombre_rol, 
                d.nombre AS nombre_departamento
            FROM 
                empleados e
            LEFT JOIN 
                roles r ON e.rol_id = r.rol_id
            LEFT JOIN 
                departamentos d ON e.departamento_id = d.departamento_id`,(err,rows)=>{
                if(err){
                    res.status(400).send(err)
                }
                res.status(200).json({rows})
            });

        }catch(err){
            res.status(500).send(err.mesagge);
        }
    }

    agregar(req, res) {
        const { 
            nombre, 
            apellido, 
            cedula, 
            fecha_nacimiento, 
            fecha_contratacion, 
            direccion, 
            email, 
            telefono, 
            rol_id, 
            cargo, 
            departamento_id, 
            sueldo,
            salario_neto, 
            numero_cuenta, 
            turno, 
            dia,
            area,
            descripcion_empleado     
        } = req.body;

        const camposRequeridos = {
            nombre: 'Nombre',
            cedula: 'Cédula',
            sueldo: 'Sueldo',
            numero_cuenta: 'Número de cuenta', 
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
    
        db.beginTransaction((beginErr) => {
            if (beginErr) {
                return res.status(500).json({
                    success: false,
                    error: "Error al iniciar transacción",
                    details: beginErr.message
                });
            }
    
            db.query(
                `INSERT INTO empleados 
                (nombre, apellido, cedula, fecha_nacimiento, fecha_contratacion, 
                 direccion, email, telefono, rol_id, cargo, departamento_id, sueldo, estado, area, descripcion_empleado) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nombre, apellido, cedula, fecha_nacimiento, fecha_contratacion, 
                 direccion, email, telefono, rol_id, cargo, departamento_id, sueldo, 'Activo', area, descripcion_empleado],
                (err, result) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                success: false,
                                error: "Error al insertar empleado",
                                details: err.message
                            });
                        });
                    }
    
                    const empleadoId = result.insertId;
    
                    db.query(
                        `INSERT INTO nominas 
                        (salario_base, salario_neto, empleado_id, numero_cuenta) 
                        VALUES (?, ?, ?, ?)`,
                        [sueldo, salario_neto, empleadoId, numero_cuenta],
                        (nominaErr, nominaResult) => {
                            if (nominaErr) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        success: false,
                                        error: "Error al crear registro de nómina",
                                        details: nominaErr.message
                                    });
                                });
                            }
    
                            db.query(
                                `INSERT INTO horarios 
                                (turno, dia, empleado_id) 
                                VALUES (?, ?, ?)`,
                                [turno, dia, empleadoId],
                                (horarioErr, horarioResult) => {
                                    if (horarioErr) {
                                        return db.rollback(() => {
                                            res.status(500).json({
                                                success: false,
                                                error: "Error al crear registro de horario",
                                                details: horarioErr.message
                                            });
                                        });
                                    }
                                    
                                    db.commit((commitErr) => {
                                        if (commitErr) {
                                            return db.rollback(() => {
                                                res.status(500).json({
                                                    success: false,
                                                    error: "Error al confirmar transacción",
                                                    details: commitErr.message
                                                });
                                            });
                                        }
            
                                        res.status(201).json({
                                            success: true,
                                            id: empleadoId,
                                            message: "Empleado, nómina y horario registrados exitosamente"
                                        });
                                    });
                                }
                            );
                        }
                    );
                }
            );
        });
    }

    consultar_uno(req, res) {
        const { id } = req.params;
        
        if (!id || isNaN(id)) {
            console.error('ID inválido recibido:', id);
            return res.status(400).json({
                success: false,
                message: "ID de empleado inválido",
                error: "El ID debe ser un número válido"
            });
        }
    
        try {
            db.query(`
                SELECT 
                    e.*, 
                    r.nombre AS nombre_rol, 
                    d.nombre AS nombre_departamento,
                    n.salario_neto AS salario_neto,
                    n.numero_cuenta AS numero_cuenta,
                    h.turno,
                    h.dia
                FROM 
                    empleados e
                LEFT JOIN 
                    roles r ON e.rol_id = r.rol_id
                LEFT JOIN 
                    departamentos d ON e.departamento_id = d.departamento_id
                LEFT JOIN 
                    nominas n ON e.empleado_id = n.empleado_id
                LEFT JOIN
                    horarios h ON e.empleado_id = h.empleado_id
                WHERE 
                    e.empleado_id = ?`, [id], (err, results) => {
                    
                if (err) {
                    console.error('Error en consulta SQL:', err);
                    return res.status(500).json({
                        success: false,
                        message: "Error en la base de datos",
                        error: err.message
                    });
                }
                
                if (!results || results.length === 0) {
                    return res.status(404).json({
                        success: false,
                        message: "Empleado no encontrado",
                        details: `No existe empleado con ID ${id}`
                    });
                }
    
                try {
                    const empleado = {
                        ...results[0],
                        horario: {
                            turno: results[0].turno || null,
                            dia: results[0].dia || null
                        }
                    };

                    delete empleado.turno;
                    delete empleado.dia;
                    
                    res.status(200).json({
                        success: true,
                        data: empleado
                    });
    
                } catch (formatError) {
                    console.error('Error al formatear respuesta:', formatError);
                    res.status(500).json({
                        success: false,
                        message: "Error al procesar datos",
                        error: formatError.message
                    });
                }
            });
        } catch (err) {
            console.error('Error general en consultar_uno:', err);
            res.status(500).json({
                success: false,
                message: "Error interno del servidor",
                error: err.message
            });
        }
    }

    reactivar(req, res) {
        try {
            const { 
                id, 
                nombre, 
                apellido, 
                cedula, 
                fecha_nacimiento, 
                fecha_contratacion, 
                direccion, 
                email, 
                telefono, 
                rol_id, 
                cargo, 
                departamento_id, 
                sueldo,
                salario_neto, 
                cuenta,
                turno,
                dia,
                area,
                estado,
                descripcion_empleado    
            } = req.body;
        
            const camposRequeridos = {
                id: 'ID del empleado',
                nombre: 'Nombre',
                cedula: 'Cédula',
                sueldo: 'Sueldo',
                cuenta: 'Número de cuenta',
                turno: 'Turno',
                dia: 'Día'
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
        
            db.beginTransaction(async (beginErr) => {
                if (beginErr) {
                    return res.status(500).json({
                        success: false,
                        error: "Error al iniciar transacción",
                        details: beginErr.message
                    });
                }
        
                try {
                    const [empResults] = await db.promise().query(
                        `UPDATE empleados SET 
                            nombre = ?,
                            apellido = ?,
                            cedula = ?,
                            fecha_nacimiento = ?,
                            fecha_contratacion = ?,
                            direccion = ?,
                            email = ?,
                            telefono = ?,
                            rol_id = ?,
                            cargo = ?,
                            departamento_id = ?,
                            sueldo = ?, 
                            area = ?,
                            estado = ?,
                            descripcion_empleado = ?
                        WHERE empleado_id = ?`,
                        [nombre, apellido, cedula, fecha_nacimiento, fecha_contratacion, 
                         direccion, email, telefono, rol_id, cargo, departamento_id, sueldo, area, estado, descripcion_empleado, id]
                    );
        
                    if (empResults.affectedRows === 0) {
                        await db.promise().rollback();
                        return res.status(404).json({
                            success: false,
                            error: "Empleado no encontrado"
                        });
                    }
        
                    const [nomResults] = await db.promise().query(
                        `UPDATE nominas SET 
                            salario_base = ?,
                            salario_neto = ?,
                            numero_cuenta = ?
                        WHERE empleado_id = ?`,
                        [sueldo, salario_neto, cuenta, id]
                    );
    
                    const [existingHorario] = await db.promise().query(
                        `SELECT * FROM horarios WHERE empleado_id = ?`,
                        [id]
                    );
        
                    let horarioResults;
                    if (existingHorario.length > 0) {
                        [horarioResults] = await db.promise().query(
                            `UPDATE horarios SET 
                                turno = ?,
                                dia = ?
                            WHERE empleado_id = ?`,
                            [turno, dia, id]
                        );
                    } else {
                        [horarioResults] = await db.promise().query(
                            `INSERT INTO horarios 
                            (turno, dia, empleado_id) 
                            VALUES (?, ?, ?)`,
                            [turno, dia, id]
                        );
                    }
        
                    await db.promise().commit();
        
                    res.status(200).json({
                        success: true,
                        message: "Actualización completada",
                        detalles: {
                            empleado: empResults.affectedRows,
                            nomina: nomResults.affectedRows,
                            horario: horarioResults.affectedRows || (existingHorario.length > 0 ? 0 : 1)
                        }
                    });
        
                } catch (error) {
                    await db.promise().rollback();
                    console.error('Error en transacción:', error);
                    res.status(500).json({ 
                        success: false,
                        error: error.message || "Error interno del servidor",
                        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
                    });
                }
            });
        
        } catch (error) {
            console.error('Error en actualización:', error);
            res.status(500).json({ 
                success: false,
                error: error.message || "Error interno del servidor",
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
}

module.exports = new empleados();