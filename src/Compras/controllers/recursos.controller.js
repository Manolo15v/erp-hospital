import { pool } from "../../db.js";
import { validations_productos } from "../validations/validacion_compras_productos.js";

export const getAllProducts = async (req, res) => {
    try {
        const [data] = await pool.query(`SELECT * from recursos`);
        if (!data || data.length == 0) {
            return res.status(404).json({ error: 'No encontrado' });
        }
        return res.status(200).json(data)
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getByIdProducts = async (req, res) => {
    try {
      const id = req.params.id;
      const [data] = await pool.query(`SELECT * FROM recursos WHERE recurso_id = ?;`, [id]); 
      if (!data || data.length == 0) {
        return res.status(404).json({ error: 'No encontrado' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}

export const insertProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    await validations_productos(newProduct)
    const [result] = await pool.query(`
      INSERT INTO recursos (
      nombre, 
      descripcion,
      codigo_recurso
      ) VALUES (?, ?, ?)`,
      [  
        newProduct.nombre, newProduct.descripcion, newProduct.codigo,
      ]

    );
    res.status(201).json({message: 'Producto registrado', result});
  } catch (error) {
    res.status(500).json({ error: error.message });
  };
}

export const updateProducts = async (req,res) => {
  try {
    const newProduct = req.body;
    const id = req.params.id;

    const [consulta] = await pool.query('SELECT recurso_id FROM recursos');
    if (consulta.find(clave => clave.recurso_id == id) == undefined) {
        throw new Error('Error. Recurso inexistente')
    }
    const [result] = await pool.query(
      'UPDATE recursos SET descripcion = ? where recurso_id = ?',
      [  
        newProduct.descripcion,
        id
      ]
    );
    res.status(201).json({message:"Producto actualizado",result});
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message});
    }
}

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const [orders] = await pool.query('SELECT * FROM ordenes_compra');
    const [requirements] = await pool.query('SELECT * FROM requisitorias');
    
    if (!id) {
      return res.status(400).json({ error: 'ID es requerido' });
    }

    const [consulta] = await pool.query('SELECT recurso_id FROM recursos');
    if (consulta.find(clave => clave.recurso_id == id) == undefined) {
        throw new Error('Error. Recurso inexistente')
    }

    if (orders.some(order => order.recurso_id_1 == id || order.recurso_id_2 == id || order.recurso_id_3 == id || order.recurso_id_4 == id || order.recurso_id_5 == id)) {
      return res.status(400).json({ message: "No se puede eliminar el producto porque está asociado a una orden de compra." });
    }

    if (requirements.some(requirement => requirement.recurso_id_1 == id || requirement.recurso_id_2 == id || requirement.recurso_id_3 == id || requirement.recurso_id_4 == id || requirement.recurso_id_5 == id)) {
      return res.status(400).json({ message: "No se puede eliminar el producto porque está asociado a una requisitoria." });
    }

    await pool.query(`DELETE FROM recursos WHERE recurso_id = ?;`,[id]);
    res.status(200).json({ message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const codeProduct = async (req,res) => {
  try {
    const consulta = 'SELECT codigo_recurso FROM recursos';
    const [temp] = await pool.query(consulta)
    const existingCodes = temp.map(row => row.codigo_recurso);
    let code = '';
    while (true) {
      const characters = '0123456789';
      code = ''
      for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
      }    
      if (!existingCodes.includes(code)) {
        break; 
      }
    } 
    res.status(200).json({'codigo': code});
  }  catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  } 
};