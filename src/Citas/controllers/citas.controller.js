import { pool }  from "../../db.js";

export const getAll= async(req, res) =>{ //este es el const para sacar todas las citas(aun no se si es necesario)
    try{
        const [data] = await pool.query(`SELECT * FROM citas`);
        if(!data || data.length==0){
            return res.status(404).json({error: "No se encontro una cita."});
        }
        res.status(200).json(data);
    }catch(error){
        res.status(500).json({error: error.message});
    }
};


export const createCita= async(req, res)=>{ //creacion de citas para el modulo
    try{
        const{paciente_id, nombre, apellido, fecha_cita, estado, tipo_cita_id, observaciones}= req.body;
        if(!paciente_id || !nombre || !apellido || !fecha_cita || !estado || !tipo_cita_id){
            return res.status(400).json({error: "Todos los campos son necesarios."});
        }

        const[result]= await pool.query(
            `INSERT INTO citas(paciente_id, nombre, apellido, fecha_cita. estado, tipo_cita_id, observaciones)`,
            [paciente_id, nombre, apellido, fecha_cita, estado, tipo_cita_id, observaciones]
        );


        res.status(201).json({
            message: "Cita creada.",
            citas:{
                cita_id: result.insertId,
                paciente_id,
                nombre,
                apellido,
                fecha_cita,
                estado: estado|| "Pendiente",
                tipo_cita_id,
                observaciones: observaciones || null,
            },
        });
    } catch(error){  
           res.status(500).json({error: error.message});
    }

};


export const deleteCita= async(req, res) =>{ //const para eliminar citas, usado en Historial de CITAS
    try{
        const {id}= req.params;

        const[cita]=await pool.query(`SELECT * FROM citas WHERE cita_id= ?`, [id]);
        if(!cita || cita.length==0){
            return res.status(404).json({error: "No se encontro la cita."});
        }

        await pool.query(`DELETE FROM citas WHERE cita_id= ?`, [id]);

        res.status(200).json({message: "Cita eliminada"});
    }catch(error){
        res.status(500).json({error: error.message});
    }
};




export const updateCita= async(req, res)=>{
    try{
        const{id}= req.params;
        const{fecha_cita, estado, observaciones}= req.body;


        const[cita]= await pool.query(`SELECT * FROM citas WHERE cita_id= ?`, [id]);
        if(!cita || cita.length==0){
            return res.status(404).json({error:  "Cita no encontrada."});
        }

        await pool.query(
            "UPDATE citas SET fecha_cita = ?, estado = ?, observaciones = ? WHERE cita_id = ?",
            [fecha_cita, estado || cita[0].estado, observaciones || cita[0].observaciones, id]    
           
        );


        res.status(200).json({message: "cita reprogramada"});    
    }   catch(error){
        console.error("eror reprogramando cita", error);
        res.status(500).json({error: error.message});
    }
};

