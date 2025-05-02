import {pool} from '../../db.js';

export const getAll= async(req,res)=>{//obtiene todas las citas de la tabla citas
    try{
        const[data]= await pool.query(
            `SELECT * FROM citas_medicas`
        );
        if(!data|| data.length==0){
            return res.status(404).json({error: "No se encontraron citas disponibles."});     
        }
        res.status(200).json(data);

    }catch(error){
        return res.status(500).json({error: error.message});
    }
};

export const getById= async(req,res)=>{//obtiene las citas por id si hace falta
    try{
        const {id}= req.params;
        const[data]= await pool.query(
            `SELECT * FROM citas_medicas WHERE cita_id= ?`,
            [id]
        );
        if(!data||data.length==0){
            return res.status(404).json({error: "No se encontro la cita asignada."});
        }
        res.status(200).json(data[0]);

    }catch(error){
        return res.status(500).json({error: error.message});
    }
};


export const updateCita= async(req,res)=>{//permite actualizar la cita, SOLAMENTE el estado y las observaciones
    try{
        const {id}= req.params;
        const {estado, observaciones}= req.body;

        const[result]= await pool.query(
            `UPDATE citas_medicas SET estado= ?, observaciones= ? WHERE cita_id= ?`,
            [estado, observaciones, id]
        );

        if(result.affectedRows===0){
            return res.status(404).json({error: "No se eencontro la cita asignada"});
        }
        res.status(200).json({message: "Cita actualizada"});

    }catch(error){
        return res.status(500),json({error: error.message});
    }
};


export const deleteCita = async (req, res) => {//permite eliminar citas por id, pero no es necesario en tu modulo
    try {
        const { id } = req.params;

        const [result] = await pool.query(`DELETE FROM citas WHERE cita_id = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Cita no encontrada." });
        }

        res.status(200).json({ message: "Cita eliminada." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export const createCita = async (req, res) => {//crear citas en consultas, para cuando llegue un transeunte
    try {
        const { paciente_id, nombre, apellido, fecha_cita, estado, tipo_cita_id, observaciones } = req.body;

        if (!paciente_id || !nombre || !apellido || !fecha_cita || !estado || !tipo_cita_id) {
            return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados." });
        }

        const [result] = await pool.query(
            `INSERT INTO citas (paciente_id, nombre, apellido, fecha_cita, estado, tipo_cita_id, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [paciente_id, nombre, apellido, fecha_cita, estado, tipo_cita_id, observaciones]
        );

        res.status(201).json({ message: "Cita creada exitosamente.", cita_id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};