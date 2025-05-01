import {pool} from '../../db.js';

export const getAll= async(req, res)=>{ //unico controller para obtener las especialidades, no creo que necesite mas
    try{
        const[data]= await pool.query(`SELECT * FROM departamentos`);
        if(!data|| data.length==0){
            return res.status(404).json({error: "No se encontraron especialidades."});

        }
        res.status(200).json(data);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};


