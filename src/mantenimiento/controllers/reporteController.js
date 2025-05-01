import { listado_ordenes } from "../models/reporteModel.js";

export const lista = async (req, res) => {
  try {
    const listadoOrdenes = await listado_ordenes();
    if (!Array.isArray(listadoOrdenes)) {
      throw new Error('La respuesta no es un array válido');
    }
    
    res.json(listadoOrdenes);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Error al obtener datos',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
