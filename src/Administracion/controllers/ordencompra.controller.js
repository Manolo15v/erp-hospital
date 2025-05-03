import {pool} from "../../db.js"

export const updateOrder= async(req,res)=>{//unico controlador para actualizar ordenes 
    try{
        const {id, fecha_orden, forma_pago}= req.body;

        if(!id||!fecha_orden||!forma_pago){
            return res.status(400).json({error: "Los campos son obligatorios."});
        }

        let estado;
        if(forma_pago!=="Prepagado"){
            estado="Completada";
        }else{
            estado="Pagada";
        }


        const[data]= await pool.query(
            `
            UPDATE ordenescompra
            SET estado = ?, fecha_orden = ?
            WHERE id_orden_compra = ?
            `,
            [estado,fecha_orden,id]
        );


        if(data.affectedRows===0){
            return res.status(404).json({error: "No hay ingresos."});
        }

        res.status(200).json({
            message: "Orden actualizada",
            updateOrder: {id, estado, fecha_orden},
        });
    }catch(error){
        return res.status(500).json({error: error.message});
    }
};

export const updateOrderApproval = async (req, res) => {
    try {
      const { id, estado, fecha_orden } = req.body;
  
      if (!id || !estado || !fecha_orden) {
        return res.status(400).json({ error: "Los campos id, estado y fecha_orden son obligatorios." });
      }
  
      const [result] = await pool.query(
        `
        UPDATE ordenescompra
        SET estado = ?, fecha_orden = ?
        WHERE id_orden_compra = ?
        `,
        [estado, fecha_orden, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "No se encontró la orden con el ID proporcionado." });
      }
  
      res.status(200).json({
        message: "Orden aprobada y actualizada",
        updatedOrder: { id, estado, fecha_orden },
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: error.message });
    }
  };