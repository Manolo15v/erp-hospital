import { pool } from "../../db.js";

export const consultar = async (req, res) => {
    try {
      const [data] = await pool.query(`
        SELECT 
                e.*, 
                r.nombre AS nombre_rol, 
                d.nombre AS nombre_departamento
            FROM 
                empleados e
            LEFT JOIN 
                roles r ON e.rol_id = r.rol_id
            LEFT JOIN 
                departamentos d ON e.departamento_id = d.departamento_id`);

      res.status(200).json(data);
      
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export const consultar_uno = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`
        
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
                    e.empleado_id = ?;
        `, [id]);
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

export const eliminar = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id)) {
            return res.status(400).json({ 
                success: false,
                error: 'ID no válido'
            });
        }

        const [empleadoExistente] = await pool.query(
            'SELECT * FROM empleados WHERE empleado_id = ?', 
            [id]
        );

        if (empleadoExistente.length === 0) {
            return res.status(404).json({ 
                success: false,
                error: 'Empleado no encontrado'
            });
        }


        const [result] = await pool.query(
            'UPDATE empleados SET estado = ? WHERE empleado_id = ?', 
            ['Inactivo', id]
        );

        if (result.affectedRows === 0) {
            return res.status(500).json({ 
                success: false,
                error: 'Error al marcar empleado como inactivo'
            });
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Empleado marcado como inactivo correctamente'
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false,
            error: error.message
        });
    }
};

export const actualizar = async (req, res) => {
    try {
        const { id } = req.params;
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
            cuenta,
            turno,
            dia,
            area,
            descripcion_empleado    
        } = req.body;

        const camposRequeridos = {
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


        const [empResults] = await pool.query(
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
            return res.status(404).json({
                success: false,
                error: "Empleado no encontrado"
            });
        }

        const [nomResults] = await pool.query(
            `UPDATE nominas SET 
                salario_base = ?,
                salario_neto = ?,
                numero_cuenta = ?
            WHERE empleado_id = ?`,
            [sueldo, salario_neto, cuenta, id]
        );


        const [existingHorario] = await pool.query(
            `SELECT * FROM horarios WHERE empleado_id = ?`,
            [id]
        );

        let horarioResults;
        if (existingHorario.length > 0) {
            [horarioResults] = await pool.query(
                `UPDATE horarios SET 
                    turno = ?,
                    dia = ?
                WHERE empleado_id = ?`,
                [turno, dia, id]
            );
        } else {
            [horarioResults] = await pool.query(
                `INSERT INTO horarios 
                (turno, dia, empleado_id) 
                VALUES (?, ?, ?)`,
                [turno, dia, id]
            );
        }

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
        console.error('Error en actualización:', error);
        res.status(500).json({ 
            success: false,
            error: "Error al procesar la actualización",
        });
    }
};

export const agregar = async (req, res) => {
    try {
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

        const [empResult] = await pool.query(
            `INSERT INTO empleados 
            (nombre, apellido, cedula, fecha_nacimiento, fecha_contratacion, 
             direccion, email, telefono, rol_id, cargo, departamento_id, sueldo, estado, area, descripcion_empleado) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nombre, apellido, cedula, fecha_nacimiento, fecha_contratacion, 
             direccion, email, telefono, rol_id, cargo, departamento_id, sueldo, 'Activo', area, descripcion_empleado]
        );

        const empleadoId = empResult.insertId;

        await pool.query(
            `INSERT INTO nominas 
            (salario_base, salario_neto, empleado_id, numero_cuenta) 
            VALUES (?, ?, ?, ?)`,
            [sueldo, salario_neto, empleadoId, numero_cuenta]
        );

        await pool.query(
            `INSERT INTO horarios 
            (turno, dia, empleado_id) 
            VALUES (?, ?, ?)`,
            [turno, dia, empleadoId]
        );

        return res.status(201).json({
            success: true,
            id: empleadoId,
            message: "Empleado, nómina y horario registrados exitosamente"
        });

    } catch (error) {
        console.error('Error en agregar empleado:', error);
        return res.status(500).json({
            success: false,
            error: "Error al registrar empleado",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export const reactivar = async (req, res) => {
    try {
        const { id } = req.params;
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
            cuenta,
            turno,
            dia,
            area,
            estado,
            descripcion_empleado     
        } = req.body;

        const camposRequeridos = {
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


        const [empResults] = await pool.query(
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
             direccion, email, telefono, rol_id, cargo, departamento_id, sueldo, area,estado, descripcion_empleado, id]
        );

        if (empResults.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: "Empleado no encontrado"
            });
        }

        const [nomResults] = await pool.query(
            `UPDATE nominas SET 
                salario_base = ?,
                salario_neto = ?,
                numero_cuenta = ?
            WHERE empleado_id = ?`,
            [sueldo, salario_neto, cuenta, id]
        );


        const [existingHorario] = await pool.query(
            `SELECT * FROM horarios WHERE empleado_id = ?`,
            [id]
        );

        let horarioResults;
        if (existingHorario.length > 0) {
            [horarioResults] = await pool.query(
                `UPDATE horarios SET 
                    turno = ?,
                    dia = ?
                WHERE empleado_id = ?`,
                [turno, dia, id]
            );
        } else {
            [horarioResults] = await pool.query(
                `INSERT INTO horarios 
                (turno, dia, empleado_id) 
                VALUES (?, ?, ?)`,
                [turno, dia, id]
            );
        }

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
        console.error('Error en actualización:', error);
        
        res.status(500).json({ 
            success: false,
            error: "Error al procesar la actualización",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};
