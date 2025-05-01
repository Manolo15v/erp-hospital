import { obtenerMantenimientos, 
         obtenerEquipos, 
         obtenerRepuestos, 
         crearOrdenMantenimiento, 
         eliminarOrdenMantenimiento, 
         obtenerIdEdicion,
         actualizarMantenimiento,
         cambiarEstadoSolicitud,
         cambiarEstadoEliminado,
         cambiarEstadoCompletado} 
         from "../models/mantenimientoModel.js";

export const listarMantenimientos = async (req, res) => {
  try {
    const mantenimientos = await obtenerMantenimientos();
    res.json(mantenimientos);
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      error: error.message || 'Error al obtener datos',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};

export const obtenerEquiposRepuestos = async (req, res) => {
  try {
    const [equipos, repuestos] = await Promise.all([
      obtenerEquipos(),
      obtenerRepuestos()
    ]);
    res.json({
      equipos,
      repuestos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al obtener datos para formulario'
    });
  }
};

export const registrarMantenimiento = async (req, res) => {
  try {
    const { body } = req;
    let fechaFormateada;
    
    try {
      fechaFormateada = body.fecha_creacion 
        ? new Date(body.fecha_creacion).toISOString().slice(0, 19).replace('T', ' ')
        : new Date().toISOString().slice(0, 19).replace('T', ' ');
    } catch (e) {
      fechaFormateada = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    const datosMantenimiento = {
      descripcion: body.descripcion,
      tipomantenimiento: body.tipomantenimiento,
      fecha_creacion: fechaFormateada,
      estado: body.estado || 'Pendiente',
      ubicacion: body.ubicacion || null,
      observaciones: body.observaciones || null,
      Id_Modelo: body.Id_Modelo,  
      Id_Repuesto: body.Id_Repuesto ? parseInt(body.Id_Repuesto) : null
    };
    const mantenimientoId = await crearOrdenMantenimiento(datosMantenimiento);
    res.status(201).json({
      success: true,
      message: 'Mantenimiento registrado correctamente',
      mantenimiento_id: mantenimientoId
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al registrar el mantenimiento',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        sqlError: error.sqlMessage
      } : undefined
    });
  }
};

export const eliminarMantenimiento = async (req, res) => {
  try {
    const { id } = req.params;
    await eliminarOrdenMantenimiento(id);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar la orden' });
  }
};

export const obtenerMantenimientoEdicion = async (req, res) => {
  try {
    const { id } = req.params;
    const mantenimiento = await obtenerIdEdicion(id);

    res.json({
      mantenimiento_id: mantenimiento.mantenimiento_id,
      descripcion: mantenimiento.descripcion,
      tipomantenimiento: mantenimiento.tipomantenimiento,
      fecha_creacion: mantenimiento.fecha_creacion,
      estado: mantenimiento.estado,
      ubicacion: mantenimiento.ubicacion,
      observaciones: mantenimiento.observaciones,
      Id_Modelo: mantenimiento.Id_Modelo,     
      Id_Repuesto: mantenimiento.Id_Repuesto  
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al cargar los datos del mantenimiento',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const actualizarMantenimientoController = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;

    let fechaFormateada;
    try {
      fechaFormateada = body.fecha_creacion 
        ? new Date(body.fecha_creacion).toISOString().slice(0, 19).replace('T', ' ')
        : new Date().toISOString().slice(0, 19).replace('T', ' ');
    } catch (e) {
      fechaFormateada = new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    const datosActualizacion = {
      descripcion: body.descripcion,
      tipomantenimiento: body.tipomantenimiento,
      fecha_creacion: fechaFormateada,
      estado: body.estado || 'Pendiente',
      ubicacion: body.ubicacion || null,
      observaciones: body.observaciones || null,
      Id_Modelo: body.Id_Modelo,  // Este lo usas para buscar Id_Equipo en el modelo
      Id_Repuesto: body.Id_Repuesto ? parseInt(body.Id_Repuesto) : null
    };
    const resultado = await actualizarMantenimiento(id, datosActualizacion);
    res.status(200).json({
      success: true,
      message: 'Mantenimiento actualizado correctamente',
      result: resultado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error al actualizar el mantenimiento',
      details: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        sqlError: error.sqlMessage
      } : undefined
    });
  }
};

export const cambiarEstadoSolicitudController = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await cambiarEstadoSolicitud(id);

    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
};

export const cambiarEstadoEliminadoController = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await cambiarEstadoEliminado(id);

    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
};

export const cambiarEstadoCompletadoController = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizado = await cambiarEstadoCompletado(id);

    if (!actualizado) {
      return res.status(404).json({ success: false, error: 'Solicitud no encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error al actualizar el estado:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar el estado' });
  }
};
