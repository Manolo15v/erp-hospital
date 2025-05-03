import express, { static as stc, json } from "express";
import morgan from "morgan";
import cors from "cors";

/*

Importacion de los routers 

Cada Router va a contener una parte de la api (el backend) y cada router va estar dirijido a un controlador para hacer un crud en la base de datos 

*/

//Administracion

import ordenCompraRoutes from "./Administracion/routes/ordenCompra.routes.js";
import productoRoutes from "./Administracion/routes/producto.routes.js";
import recursosAdministracionRoutes from "./Administracion/routes/recursos.routes.js";

//Citas

import historialRoutes from "./Citas/routes/historial.routes.js";
import reprogramarRoutes from "./Citas/routes/reprogramar.routes.js";
import citasRoutes from "./Citas/routes/citas.routes.js";

//Compras

import proveedoresRoutes from "./Compras/routes/proveedores.routes.js"
import recursosRoutes from "./Compras/routes/recursos.routes.js";
import orderRoutes from "./Compras/routes/orders.routes.js"
import requirementsRoutes from "./Compras/routes/requirements.routes.js"
import inventoryRoutes from "./Compras/routes/inventory.routes.js"
import tableRoutes from "./Compras/routes/table.routes.js"
import updateRoutes from "./Compras/routes/update.routes.js"
import formRoutes from "./Compras/routes/form.routes.js"
import utilsRoutes from "./Compras/routes/utils.routes.js"

//Consultas Medicas

import citasMedicasRoutes from "./consultas_medicas/routes/citasMedicas.routes.js";
import consultasMedRoutes from "./consultas_medicas/routes/consultas.routes.js";
import departamentosRoutes from "./consultas_medicas/routes/departamentos.routes.js";
import historialMedRoutes from "./consultas_medicas/routes/historial.routes.js";
import insumosRoutes from "./consultas_medicas/routes/insumos.routes.js";
import pacienteMedRoutes from "./consultas_medicas/routes/paciente.routes.js";

//Consultas Odontologicas

import citasConsultasOdontoRoutes from "./Consultas_Odontologicas/routes/citas_consultas_odontologicas.routes.js";
import consultasOdontologicasLabRoutes from "./Consultas_Odontologicas/routes/consultas_odontologicas.routes.js";
import consumosConsultasOdontoRoutes from "./Consultas_Odontologicas/routes/consumos_consultas_odontologicas.routes.js";
import dientesRoutes from "./Consultas_Odontologicas/routes/dientes.routes.js";
import odontodiagramaRoutes from "./Consultas_Odontologicas/routes/odontodiagrama.routes.js";
import sectoresRoutes from "./Consultas_Odontologicas/routes/sectores.routes.js";
import segmentosRoutes from "./Consultas_Odontologicas/routes/segmentos.routes.js";
import solicitudesLabRoutes from "./Consultas_Odontologicas/routes/solicitudes_lab_odontologicas.routes.js";

//Hospitalizacion

import camasRoutes from "./Hospitalizacion/routes/camas.routes.js";
import habitacionesRoutes from "./Hospitalizacion/routes/habitaciones.routes.js";
import hospitalizacionesRoutes from "./Hospitalizacion/routes/hospitalizaciones.routes.js";
import examenesRoutes from "./Hospitalizacion/routes/examenes_hospitalizacion.routes.js";
import signosVitalesRoutes from "./Hospitalizacion/routes/signos_vitales.routes.js";
import pacientesRoutes from "./Hospitalizacion/routes/pacientes.routes.js";
import listaEsperaRoutes from "./Hospitalizacion/routes/lista_espera_hospitalizacion.routes.js";

//Inventario

import almacenRoutes from "./Inventario/routes/almacen.routes.js"
import equiposRoutes from "./Inventario/routes/equipos.routes.js"
import modeloEquiposRoutes from "./Inventario/routes/modelosEquipos.routes.js";
import modeloProductosRoutes from "./Inventario/routes/modelosProductos.routes.js";
import instrumentoRoutes from "./Inventario/routes/Instrumentos.routes.js";
import instrumentoUbicacionRoutes from "./Inventario/routes/instrumentosUbicacion.routes.js";
import productosRoutes from "./Inventario/routes/productos.routes.js";
import productosUbicacionRoutes from "./Inventario/routes/productosUbicacion.routes.js";
import repuestosRoutes from "./Inventario/routes/repuestos.routes.js"

//Laboratorio

import examenes_labRoutes from "./Laboratorio/routes/examenes.routes.js";
import pruebasRoutes from "./Laboratorio/routes/pruebas.routes.js";
import resultadosRoutes from "./Laboratorio/routes/resultados.routes.js";
import pacienteRoutes from "./Laboratorio/routes/pacientes.routes.js";
import solicitudesLaboratorioRoutes from "./Laboratorio/routes/solicitudes_laboratorio.routes.js";

//Mantenimiento

import mantenimientoRoute from './mantenimiento/routes/mantenimientoRoute.js';
import reporteRoute from './mantenimiento/routes/reporteRoute.js'
import ordenesTrabajoRoute from './mantenimiento/routes/ordenesRoute.js'

//Personal
import empleadosRoutes from "./Personal/routes/empleados.routes.js";
import especialidadesRoutes from "./Personal/routes/especialidades.routes.js";
import rolesRoutes from "./Personal/routes/roles.routes.js";
import pagosEmpleadosRoutes from "./Personal/routes/pagos_empleados.routes.js";
import usuariosRoutes from "./Usuarios/routes/usuarios.routes.js";

/*

Instanciacion del servidor y configuraciones varias

Esta configurado el server para enviar la pagina index.html de la carpeta public.
Hacer la navegacion desde el front hacia las carpeta pages en un futuro

*/

import loginRoutes from "./Inicio/routes/login.routes.js"

const app = express();

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(stc("public"));

/*

    Declaracion de las rutas para los endpoints
    Todas las rutas que empiecen por "/api/..." van renferenciadas al backend para no mezclar con la navegacion del front

    IMPORTANTE NO USAR LA RUTA "" O "/" DIRECTAMENTE PARA QUE FUNCIONE EL DIRECCIONAMIENTO A LOS ARCHIVOS ESTATICOS EN LA CARPETA PUBLIC EN UN FUTURO

*/

//Administracion

app.use("/api/administracion/ordenes", ordenCompraRoutes); // Rutas para las ordenes de compra
app.use("/api/administracion/productos", productoRoutes); // Rutas para los productos
app.use("/api/administracion/recursos", recursosAdministracionRoutes); // Rutas para los recursos

//Citas

app.use("/api/citas/historial", historialRoutes); // Rutas para el historial de citas
app.use("/api/citas/reprogramar", reprogramarRoutes); // Rutas para reprogramar citas
app.use("/api/citas", citasRoutes); // Rutas generales para citas

//Compras

app.use("/api/compras/proveedores", proveedoresRoutes);
app.use("/api/compras/recursos", recursosRoutes);
app.use("/api/compras/ordenes",orderRoutes);
app.use("/api/compras/requisitorias",requirementsRoutes);
app.use("/api/compras/inventario",inventoryRoutes)
app.use("/api/compras/tabla", tableRoutes)
app.use("/api/compras/actualizar",updateRoutes)
app.use("/api/compras/formulario",formRoutes)
app.use("/api/compras/utiles",utilsRoutes)

//Consultas Medicas

app.use("/api/consultas_medicas/citas", citasMedicasRoutes);
app.use("/api/consultas_medicas/departamentos", departamentosRoutes);
app.use("/api/consultas_medicas/pacientes", pacienteMedRoutes);
app.use("/api/consultas_medicas/consultas", consultasMedRoutes);
app.use("/api/consultas_medicas/historiales", historialMedRoutes);
app.use("/api/consultas_medicas/insumos", insumosRoutes);

//Consultas Odontologicas

app.use("/api/consultas_odontologicas/citas", citasConsultasOdontoRoutes)
app.use("/api/consultas_odontologicas/consultas", consultasOdontologicasLabRoutes)
app.use("/api/consultas_odontologicas/consumos", consumosConsultasOdontoRoutes)
app.use("/api/consultas_odontologicas/dientes", dientesRoutes)
app.use("/api/consultas_odontologicas/odontodiagrama", odontodiagramaRoutes)
app.use("/api/consultas_odontologicas/sectores", sectoresRoutes)
app.use("/api/consultas_odontologicas/segmentos", segmentosRoutes)
app.use("/api/consultas_odontologicas/solicitudes_lab", solicitudesLabRoutes)

//Hospitalizacion

app.use("/api/hospitalizacion/camas", camasRoutes);
app.use("/api/hospitalizacion/habitaciones", habitacionesRoutes);
app.use("/api/hospitalizacion/hospitalizaciones", hospitalizacionesRoutes);
app.use("/api/hospitalizacion/examenes", examenesRoutes);
app.use("/api/hospitalizacion/signosVitales", signosVitalesRoutes);
app.use("/api/hospitalizacion/pacientes", pacientesRoutes);
app.use("/api/hospitalizacion/listaEspera", listaEsperaRoutes);

//Inventario

app.use("/api/inventario/almacen", almacenRoutes);
app.use("/api/inventario/equipos", equiposRoutes);
app.use("/api/inventario/modeloEquipos", modeloEquiposRoutes);
app.use("/api/inventario/instrumento", instrumentoRoutes);
app.use("/api/inventario/instrumentoUbicacion", instrumentoUbicacionRoutes);
app.use("/api/inventario/productos", productosRoutes);
app.use("/api/inventario/modeloProductos", modeloProductosRoutes);
app.use("/api/inventario/productosUbicacion", productosUbicacionRoutes);
app.use("/api/inventario/repuestos", repuestosRoutes);

//Laboratorio

app.use("/api/laboratorio/solicitudesLaboratorio", solicitudesLaboratorioRoutes);
app.use("/api/laboratorio/pacientes", pacienteRoutes);
app.use("/api/laboratorio/resultados", resultadosRoutes);
app.use("/api/laboratorio/examenes", examenes_labRoutes);
app.use("/api/laboratorio/pruebas", pruebasRoutes);

//Mantenimiento

app.use('/api/mantenimiento/mantenimiento', mantenimientoRoute);
app.use('/api/mantenimiento/ordenes', ordenesTrabajoRoute);
app.use('/api/mantenimiento/reporte', reporteRoute);

//Personal

app.use('/api/personal/empleados', empleadosRoutes);
app.use("/api/personal/especialidades", especialidadesRoutes);
app.use("/api/personal/roles", rolesRoutes);
app.use("/api/personal/pagos_empleados", pagosEmpleadosRoutes);

//Usuarios
app.use("/api/usuarios", usuariosRoutes);

app.use("/api/iniciar",loginRoutes)

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;
