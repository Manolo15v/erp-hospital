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


export const createIncome= async(req,res)=>{//controlador para crear ingresos, igual que en app.js
    try{
        const {fecha_ingreso, tipo_ingreso, monto, descripcion, fuente}= req.body;

        if(!fecha_ingreso||!tipo_ingreso||!monto||!descripcion||!fuente){
            return res.status(400).json({error: "faltan campos obligatorios."});
        }

        const [data]= await pool.query(
            `
            INSERT INTO ingresos (fecha_ingreso, tipo_ingreso, monto, descripcion, fuente)
            VALUES (?, ?, ?, ?, ?)
            `, [fecha_ingreso,tipo_ingreso,monto,descripcion,fuente]
        );

        res.status(200).json({
            message: "Ingreso creado exitosamente.",
            id: data.insertId,
            ingreso: {fecha_ingreso,tipo_ingreso,monto,descripcion,fuente},
        });

    }catch(error){
        return res.status(500).json({error: error.message});
    }
};



export const updateIncome = async (req, res) => {//actualiza ingreso, me imagino que para el estado

  const { id, fecha_ingreso, tipo_ingreso, monto, descripcion, fuente } = req.body;

  if (!id || !fecha_ingreso || !tipo_ingreso || !monto || !descripcion || !fuente) {
    return res.status(400).json({ error: "Todos los campos son requeridos." });
  }
  try {
    const [result] = await pool.query(
      `
      UPDATE ingresos 
      SET fecha_ingreso = ?, 
          tipo_ingreso = ?, 
          monto = ?, 
          descripcion = ?, 
          fuente = ?
      WHERE id_ingreso = ?
      `,
      [
        fecha_ingreso,
        tipo_ingreso,
        monto,
        descripcion,
        fuente,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "No se encontró el ingreso con el ID especificado." });
    }

    res.status(200).json({
      message: "Ingreso actualizado exitosamente.",
      result
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

export const deleteIncome = async (req, res) => {//elimina ingreso por id
  const id = parseInt(req.params.id);

  try {
    const [result] = await pool.query(
      `DELETE FROM ingresos WHERE id_ingreso = ?`,
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


