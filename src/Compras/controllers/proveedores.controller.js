import { pool } from "../../db.js";
import { validations_proveedores } from "../validations/validacion_compras_proveedores.js";

export const getAllSuppliers = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * from proveedores`);
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getByIdSuppliers = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM proveedores WHERE proveedor_id = ?;`, [id]); 
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

export const insertSupplier = async (req, res) => {
    try {
        const newSupplier = req.body;
        await validations_proveedores(newSupplier,null)
        const [result] = await pool.query(`
            INSERT INTO proveedores (
            nombre,
            direccion,
            ref_direccion,
            email, 
            telefono, 
            rif, 
            estado
            ) VALUES (?, ?, ?, ?, ?, ?, ?);`,
            [  newSupplier.nombre, newSupplier.direccion, newSupplier.ref_direccion,
                newSupplier.email, newSupplier.telefono, newSupplier.rif, newSupplier.estado,
            ]
        );
        res.status(201).json({message: 'Proveedor registrado', result});
      } catch (error) {
        res.status(500).json({ error: error.message });
      };
}

export const updateSupplier = async (req, res) => {
    try {
      const newSupplier = req.body;
      const id = req.params.id;
      await validations_proveedores(newSupplier,id)
      const [result] = await pool.query(
          `UPDATE proveedores SET 
          nombre = ?,
          direccion = ?, 
          ref_direccion = ?, 
          email = ?, 
          telefono = ?, 
          rif = ?, 
          estado = ? 
          WHERE 
          proveedor_id = ?`,
          [  
              newSupplier.nombre,
              newSupplier.direccion,
              newSupplier.ref_direccion,
              newSupplier.email,
              newSupplier.telefono,
              newSupplier.rif,
              newSupplier.estado,
              id
          ]
      );
      res.status(201).json({message:"Proveedor actualizado", result});
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: error.message });
  }
}

export const deleteSupplier = async (req, res) => {
  try {
    const id = req.params.id;
    const [orders] = await pool.query('SELECT * FROM ordenes_compra');
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }
    if (orders.some(order => order.proveedor_id == id)) {
      return res.status(400).json({ message: "No se puede eliminar el proveedor porque está asociado a una orden de compra." });
    }
    
    const [consulta] = await pool.query('SELECT proveedor_id FROM proveedores');
    if (consulta.find(clave => clave.proveedor_id == id) == undefined) {
        throw new Error('Error. Proveedor inexistente')
    }

    await pool.query(`DELETE FROM proveedores WHERE proveedor_id = ?;`,[id]);
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
