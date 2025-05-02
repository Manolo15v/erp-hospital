import {pool} from '../../db.js';

export const getById = async(req,res)=>{//controlador para obtenr departamentos(especialdides) por id
    try{
        const {id}= req.params;
        const[data]= await pool.query(
            `SELECT * FROM departamentos WHERE departamento_id = ?`,
            [id]
        );
        if(!data ||data.length==0){
            return res.status(404).json({error: "No hay especialidades."});
        }
        res.status(200).json(data[0]);

    }catch(error){
        return res.status(500).json({error: error.message});
    }
};



export const getByNombre = async(req,res)=>{//controlador para hacer exactamente lo mismo pero por nombre
    try{
        const {nombre}= req.params;
        const[data]= await pool.query(
            `SELECT * FROM departamentos WHERE nombre = ?`,
            [nombre]
        );
        if(!data || data.length==0){
            return res.status(404).json({error: "No hay especialidades"});
        }
        res.status(200).json(data[0]);

    }catch(error){
        res.status(500).json({error: error.message});
    }
};