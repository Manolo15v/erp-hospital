import { cambiarPrioridadCompletado, cambiarPrioridadEliminada, crearOrdenTrabajo, obtenerEmpleado, obtenerOrdenesTrabajo } 
    from "../models/ordenTrabajoModel.js";

export const crearOrdenTrabajoController = async (req, res) => {
    try {
        const datos = req.body;
        console.log('Datos recibidos para crear orden:', datos);
        const ordenId = await crearOrdenTrabajo(datos);
        res.json({ success: true, ordenId });
        
    } catch (error) {
        console.error('Error al crear la orden de trabajo:', error);
        res.status(500).json({ success: false, error: 'Error del servidor' });
    }
};

export const ordenesTrabajoController = async (req, res) => {
    try {
      const prioridad = req.params.prioridad || '';
      const ordenes = await obtenerOrdenesTrabajo(prioridad);
      res.status(200).json({
        success: true,
        data: ordenes
      });
    } catch (error) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || 'Error al obtener las órdenes de trabajo',
        error: error.sqlError || null
      });
    }
};

export const cambiarPrioridadEliminadaController = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await cambiarPrioridadEliminada(id);

    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
};

export const cambiarPrioridadController = async (req, res) => {
    try {
      const { id } = req.params;
      const actualizado = await cambiarPrioridadCompletado(id);
  
      if (!actualizado) {
        return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
      }
  
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
    }
};

export const obtenerEmpleadoController = async (req, res) => {
  try {
    const empleado = await obtenerEmpleado();
    res.json(empleado);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener nombre del empleado'
    });
  }
};