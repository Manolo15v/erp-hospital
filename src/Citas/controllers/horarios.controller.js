import {pool} from '../../db.js';

export const getAll= async(req, res)=>{//controlador para obtener todo de horarios
    try{
        const[data]= await pool.query(`SELECT * FROM horarios`);
        if(!data|| data.length==0){
            return res.status(404).json({error: "No se encontraron turnos para horario."});
        }
        res.status(200).json(data);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

export const obtenerTurno= async(req,res)=>{ //controlador para obtener turnos Diurnos y Nocturnos
    try{
        const{turno}= req.params;
        const[data]= await pool.query(
            `SELECT * FROM horarios WHERE turno LIKE ?`,
            [`%${turno}%`] //esto esta burde raro lo se, pero es pa buscar por nombre de turno
        );

        if(!data || data.length==0){
            return res.status(404).json({error: "No hay turnos para horarios"});
        }

        res.status(200).json(data);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};

export const verificarPorHorario= async(req,res)=>{ //controlador para validar la disponibilidad de horario, facilitando el front
    try{
        const {horario_id}= req.params;
        const[data]= await pool.query(
            `SELECT * FROM horarios WHERE horario_id= ?`,
            [horario_id]
        );

        if(!data || data.length==0){
            return res.status(404).json({message: "el Horario no esta disponible", horario: data[0]});
        }
    }catch(error){
        res.status(500).json({error: error.message});

    }
                
};