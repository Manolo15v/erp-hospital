import {pool} from "../../db.js";

export const getAll= async(req,res)=>{//controlador para obtener todos los ingresos de la tabla
    try{
        const [data]= await pool.query(`SELECT * FROM ingresos`);
        if(!data||data.length==0){
            return res.status(404).json({error: "No hay ingresos en la tabla."});

        }
        res.status(200).json(data);
    }catch(error){
        return res.status(500).json({error: error.message});
    }
};

export const getById= async(req,res)=>{//controlador para obtener ingresos por id
    try{
        const id= req.params.id;
        const[data]= await pool.query(
            `SELECT * FROM ingresos WHERE id_ingreso = ?`,
            [id]
        );
        if(!data||data.length==0){
            return res.status(404).json({error: "No se encontro el id asignado al ingreso."});
        }
        res.status(200).json(data);
    }catch(error){
        return res.status(500).json({error: error.message});
    }
};


export const createIncome = async (req, res) => {
  try {
      const {
        monto,
        descripcion,
          tipo_ingreso,
          emisor,
          fecha,
          moneda,
          tipo_emisor,
          emisor_id
      } = req.body;
      console.log(req.body)

      // Insertar en la base de datos
      const [data] = await pool.query(
          `
          INSERT INTO ingresos (
              cantidad,
              concepto,
              tipo_ingreso,
              contribuyente,
              fecha,
              moneda,
              tipo_contribuyente,
              identificacion_contribuyente
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `,
          [
            monto,
            descripcion,
              tipo_ingreso,
              emisor,
              fecha,
              moneda,
              tipo_emisor || null, 
              emisor_id || null  
          ]
      );


      res.status(201).json({
          message: "Ingreso creado exitosamente.",
          ingreso: {
              ingresos_id: data.insertId,
              monto,
              descripcion,
                tipo_ingreso,
                emisor,
                fecha,
                moneda,
                tipo_emisor ,
                emisor_id
          }
      });

  } catch (error) {
      console.error("Error al crear ingreso:", error);
      res.status(500).json({ error: "Error interno del servidor." });
  }
};



export const updateIncome = async (req, res) => {
  try {
      const {
        monto,
        descripcion,
          tipo_ingreso,
          emisor,
          fecha,
          moneda,
          tipo_emisor,
          emisor_id,
          id
      } = req.body;


     
      const [existingIncome] = await pool.query(
          'SELECT * FROM ingresos WHERE ingresos_id = ?', 
          [id]
      );

      if (existingIncome.length === 0) {
          return res.status(404).json({ error: "Ingreso no encontrado." });
      }


      await pool.query(
          `
          UPDATE ingresos SET
              cantidad = ?,
              concepto = ?,
              tipo_ingreso = ?,
              contribuyente = ?,
              fecha = ?,
              moneda = ?,
              tipo_contribuyente = ?,
              identificacion_contribuyente = ?
          WHERE ingresos_id = ?
          `,
          [
            monto,
            descripcion,
              tipo_ingreso,
              emisor,
              fecha,
              moneda,
              tipo_emisor || null,
              emisor_id || null  ,
              id
          ]
      );

      // Respuesta exitosa
      res.status(200).json({
          message: "Ingreso actualizado exitosamente.",
          ingreso: {
              ingresos_id: id,
              monto,
              descripcion,
                tipo_ingreso,
                emisor,
                fecha,
                moneda,
                tipo_emisor ,
                emisor_id
          }
      });

  } catch (error) {
      console.error("Error al actualizar ingreso:", error);
      res.status(500).json({ error: "Error interno del servidor." });
  }
};

export const deleteIncome = async (req, res) => {//elimina ingreso por id
  const id = parseInt(req.params.id);
  try {
    const [result] = await pool.query(
      `DELETE FROM ingresos WHERE ingresos_id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Registro no encontrado." });
    }

    res.status(200).json({ message: "Registro eliminado correctamente." });
  } catch (error) {
    console.error("Error al ejecutar la consulta:", error);
    res.status(500).json({ message: "Error al eliminar el registro." });
  }
};


