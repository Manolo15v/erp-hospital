import {pool} from '../../db.js';


export const getCitasById= async(req,res)=>{ //controlador para obtener las citas hechas por cada id(o sea cedula)
    try{
        const {paciente_id}= req.params;
        const [data]= await pool.query(
            `SELECT * FROM citas WHERE paciente_id= ?`,
            [paciente_id]

        );

        if(!data || data.length==0){
            return res.status(404).json({error: "No hay citas para este paciente"});
        }
        res.status(200).json(data);
    }catch(error){
        res.status(500).json({error: error.messagge});
    }
};


export const ReprogramarCita= async(req, res)=>{ //controlador que reprograma las citas, la variable nueva_fecha no estaba hecha cuanado hice esto
    try{                                         //pero le dije a Leon que la añadiera, de lo contrario esto no funciona
        const {id}= req.params;
        const{nueva_fecha, estado, observaciones}= req.body;


        const[cita]= await pool.query(
            `SELECT * FROM citas WHERE cita_id= ?`, 
            [id]
        );


        if(!cita || cita.length==0){
            return res.status(404).json({error:  "Cita no encontrada."});
        }

        await pool.query(
            `UPDATE citas SET nueva_cita= ?, estado= ?, observaciones= ? WHERE cita_id= ?`,
            [nueva_fecha_cita, estado, observaciones, id]
        );

        res.status(200).json({message: "Cita reprogramada."});
    }catch(error){
        
        console.error("Error reprogramando cita", error);
        res.status(500).json({error: error.message});
    }
};