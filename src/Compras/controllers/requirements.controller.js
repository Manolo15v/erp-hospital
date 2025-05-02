import { pool } from "../../db.js";
import { ProductsRequeriments, searchProducts, validations_departamento, validations_empleado, validations_requirements, validations_requirements_request } from "../validations/validacion_compras_requirements.js";

export const getAllRequirements = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * from requisitorias`);
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getByIdRequirements = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM requisitorias WHERE requisitoria_id = ?;`, [id]); 
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

export const insertRequirements = async (req, res) => {
    try {
        const newRequirement = req.body;
        const recursos_ids = [];
        const recursos_list = []
        for (let i = 1; i <= 5; i++) {
            const codigoRecurso = newRequirement[`recurso_${i}`];
            recursos_ids.push(await searchProducts(codigoRecurso));
            recursos_list.push(codigoRecurso)
        }
        const empleado = await validations_empleado(newRequirement.solicitante)
        const empleado_id = empleado.empleado_id
        const departamento = await validations_departamento(empleado)
        await validations_requirements(newRequirement,recursos_list)
        const [result] = await pool.query(
            `INSERT INTO requisitorias (
            empleado_id, 
            motivo, 
            departamento, 
            descripcion, 
            fecha_emision, 
            observaciones,
            estado, 
            fecha_modificacion, 
            recurso_id_1, 
            cantidad_1, 
            unidad_medida_1, 
            recurso_id_2, 
            cantidad_2, 
            unidad_medida_2, 
            recurso_id_3, 
            cantidad_3, 
            unidad_medida_3, 
            recurso_id_4, 
            cantidad_4, 
            unidad_medida_4, 
            recurso_id_5, 
            cantidad_5, 
            unidad_medida_5) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [  
                empleado_id,
                newRequirement.motivo,
                departamento,
                newRequirement.descripcion,
                newRequirement.fecha_emision,
                newRequirement.observaciones,
                newRequirement.estado,
                newRequirement.fecha_modificacion,
                recursos_ids[0],
                newRequirement.cantidad_1,
                newRequirement.unidad_medida_1,
                recursos_ids[1],
                newRequirement.cantidad_2,
                newRequirement.unidad_medida_2,
                recursos_ids[2],
                newRequirement.cantidad_3,
                newRequirement.unidad_medida_3,
                recursos_ids[3],
                newRequirement.cantidad_4,
                newRequirement.unidad_medida_4,
                recursos_ids[4],
                newRequirement.cantidad_5,
                newRequirement.unidad_medida_5,
            ]
        );
        res.status(201).json({message:"Registro exitoso",result});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const insertRequirementsRequest = async (req, res) => {
    try {
        const newRequirement = req.body;
        const reqProducts = await ProductsRequeriments()
        const recursoIds = [];
        const recursoCodes = [];
        const recursos_list = []

        for (let i = 1; i <= 5; i++) {
            recursos_list.push(newRequirement[`recurso_${i}`])
            const recurso = reqProducts.find(product => product.nombre === newRequirement[`recurso_${i}`]);
            recursoIds.push(recurso?.id || null);
            recursoCodes.push(recurso?.codigo || null); 
        }

        await validations_requirements_request(newRequirement, recursos_list)
        const [result] = await pool.query(
            `INSERT INTO requisitorias (
            empleado_id,
            motivo, 
            departamento, 
            descripcion, 
            fecha_emision, 
            estado, 
            fecha_modificacion, 
            recurso_id_1, 
            cantidad_1, 
            unidad_medida_1, 
            recurso_id_2, 
            cantidad_2, 
            unidad_medida_2, 
            recurso_id_3, 
            cantidad_3, 
            unidad_medida_3, 
            recurso_id_4, 
            cantidad_4, 
            unidad_medida_4, 
            recurso_id_5, 
            cantidad_5, 
            unidad_medida_5, 
            fecha_requerida, 
            recurso_codigo_1, 
            recurso_codigo_2, 
            recurso_codigo_3, 
            recurso_codigo_4, 
            recurso_codigo_5) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [  
                newRequirement.empleado_id,
                newRequirement.motivo,
                newRequirement.departamento,
                newRequirement.descripcion,
                newRequirement.fecha_emision,
                newRequirement.estado,
                newRequirement.fecha_modificacion,
                recursoIds[0],
                newRequirement.cantidad_1,
                newRequirement.unidad_medida_1,
                recursoIds[1],
                newRequirement.cantidad_2,
                newRequirement.unidad_medida_2,
                recursoIds[2],
                newRequirement.cantidad_3,
                newRequirement.unidad_medida_3,
                recursoIds[3],
                newRequirement.cantidad_4,
                newRequirement.unidad_medida_4,
                recursoIds[4],
                newRequirement.cantidad_5,
                newRequirement.unidad_medida_5,
                newRequirement.fecha_requerida,
                recursoCodes[0],
                recursoCodes[1],
                recursoCodes[2],
                recursoCodes[3],
                recursoCodes[4],
            ]
        );
        res.status(201).json({message:"Registro exitoso",result});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }

}

export const updateRequirements = async (req,res) => {
    try {
        const id = req.params.id;

        const [consulta] = await pool.query('SELECT requisitoria_id FROM requisitorias');
        if (consulta.find(clave => clave.requisitoria_id == id) == undefined) {
            throw new Error('Error. Requisitoria inexistente')
        }

        const newRequirement = req.body;
        const reqProducts = await ProductsRequeriments()
        const recursoIds = [];
        const recursoCodes = [];
        const recursos_list = [];
    
        for (let i = 1; i <= 5; i++) {
            recursos_list.push(newRequirement[`recurso_${i}`])
            const recurso = reqProducts.find(product => product.nombre === newRequirement[`recurso_${i}`]);
            recursoIds.push(recurso?.id || null);
            recursoCodes.push(recurso?.codigo || null); 
        }
        await validations_requirements_request(newRequirement, recursos_list)

        const [result] = await pool.query(
            `UPDATE requisitorias SET fecha_requerida = ?,
            motivo = ?, 
            descripcion = ?, 
            observaciones = ?, 
            fecha_modificacion = ?, 
            recurso_id_1 = ?, 
            cantidad_1 = ?, 
            unidad_medida_1 = ?, 
            recurso_id_2 = ?, 
            cantidad_2 = ?, 
            unidad_medida_2 = ?, 
            recurso_id_3 = ?, 
            cantidad_3 = ?, 
            unidad_medida_3 = ?, 
            recurso_id_4 = ?, 
            cantidad_4 = ?, 
            unidad_medida_4 = ?, 
            recurso_id_5 = ?, 
            cantidad_5 = ?, 
            unidad_medida_5 = ?, 
            recurso_codigo_1 = ?, 
            recurso_codigo_2 = ?, 
            recurso_codigo_3 = ?,
            recurso_codigo_4 = ?, 
            recurso_codigo_5 = ? WHERE requisitoria_id = ?`,
            [  
                newRequirement.fecha_requerida,
                newRequirement.motivo,
                newRequirement.descripcion,
                newRequirement.observaciones,
                newRequirement.fecha_modificacion,
                recursoIds[0],
                newRequirement.cantidad_1,
                newRequirement.unidad_medida_1,
                recursoIds[1],
                newRequirement.cantidad_2,
                newRequirement.unidad_medida_2,
                recursoIds[2],
                newRequirement.cantidad_3,
                newRequirement.unidad_medida_3,
                recursoIds[3],
                newRequirement.cantidad_4,
                newRequirement.unidad_medida_4,
                recursoIds[4],
                newRequirement.cantidad_5,
                newRequirement.unidad_medida_5,
                recursoCodes[0],
                recursoCodes[1],
                recursoCodes[2],
                recursoCodes[3],
                recursoCodes[4],
                id,
            ]
        );
        res.status(201).json({message:"Actualizacion exitosa",result});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    } 
}

export const updateRequirementsRequest = async (req,res) => {
    const id = parseInt(req.params.id);
    const status = req.params.status;
    const date = new Date().toISOString().split('T')[0];

    const [consulta] = await pool.query('SELECT requisitoria_id FROM requisitorias');
    console.log(consulta)
    if (consulta.find(clave => clave.requisitoria_id == id) == undefined) {
        throw new Error('Error. Requisitoria inexistente')
    }
    
    try {
        const [result] = await pool.query(
            'UPDATE requisitorias SET estado = ?, fecha_modificacion = ?, fecha_cierre = ? WHERE requisitoria_id = ?',
            [  
                status,
                date,
                date,
                id,
            ]
        );
        res.status(201).json({message:"Actualizacion exitosa",result});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const updateRequirementsStatus = async (req,res) => {
    const newRequirement = req.body;

    const date = new Date().toISOString().split('T')[0];
    const id = parseInt(req.params.id);
    const [consulta] = await pool.query('SELECT requisitoria_id FROM requisitorias');
    if (consulta.find(clave => clave.requisitoria_id == id) == undefined) {
        throw new Error('Error. Requisitoria inexistente')
    }
    
    try {
        const [result] = await pool.query(
            'UPDATE requisitorias SET estado = ?, fecha_modificacion = ?, fecha_cierre = ? WHERE requisitoria_id = ?',
            [  
               'Completada',
                date,
                date,
                newRequirement.id,
            ]
        );
        res.status(201).json({message:"Actualizacion exitosa",result});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
}

export const deleteRequirements = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id) {
          return res.status(400).json({ error: 'ID es requerido' });
        }

        await pool.query('DELETE FROM requisitorias WHERE requisitoria_id = ?',[id]);
        res.status(200).json({ message: 'Eliminado correctamente' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}