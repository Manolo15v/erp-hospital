const db = require('../database/conexin.js')

class especialida{
    constructor(){

    };
    cargar(req,res){
        db.query("SELECT departamento_id,nombre FROM departamentos;",(error,rows)=>{
            if (error){
                res.status(400).send(error)
            }
                res.status(200).json(rows)
        });
    }
    agregar(req, res) {
        const {nombre, descripcion} = req.body;
        db.query(
            `INSERT INTO departamentos 
            (nombre, descripcion) 
            VALUES (?, ?)`,
            [nombre, descripcion],
            (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err);
                    return res.status(500).json({
                        success: false,
                        error: "Error al insertar en la base de datos",
                        details: err.message
                    });
                }
            })
    }
    async actualizar(req, res) {
        try {
            const { 
                id, 
                nombre, 
                descripcion 
            } = req.body;
    
            // Validación del ID
            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    error: 'ID de departamento no válido'
                });
            }
    
            if (!nombre || !descripcion) {
                return res.status(400).json({
                    success: false,
                    error: 'Nombre y descripción son campos obligatorios'
                });
            }
    
            const [result] = await db.promise().query(
                `UPDATE departamentos SET 
                    nombre = ?,
                    descripcion = ?
                WHERE departamento_id = ?`,
                [nombre, descripcion, id]
            );
    
            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    error: "Departamento no encontrado"
                });
            }
    
            return res.status(200).json({
                success: true,
                message: "Departamento actualizado correctamente",
                data: {
                    departamento_id: id,
                    nombre,
                    descripcion
                }
            });
    
        } catch (err) {
            console.error('Error al actualizar departamento:', err);
            return res.status(500).json({
                success: false,
                error: "Error interno del servidor",
                details: process.env.NODE_ENV === 'development' ? err.message : undefined
            });
        }
    }
    
    obtener(req, res) {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({
                success: false,
                error: "Se requiere el ID del departamento"
            });
        }
    
        db.query(
            `SELECT departamento_id, nombre, descripcion FROM departamentos WHERE departamento_id = ?`,
            [id],
            (err, result) => {
                if (err) {
                    console.error('Error en la consulta SQL:', err);
                    return res.status(500).json({
                        success: false,
                        error: "Error al consultar la base de datos",
                        details: err.message
                    });
                }
    
                if (result.length === 0) {
                    return res.status(404).json({
                        success: false,
                        error: "Departamento no encontrado"
                    });
                }
    
                return res.json({
                    success: true,
                    data: result[0]
                });
            }
        );
    }
}
module.exports = new especialida();