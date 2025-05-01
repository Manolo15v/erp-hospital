import express,  {static as stc, json} from "express";
import morgan from "morgan";
import cors from "cors"; 

/*

Importacion de los routers 

Cada Router va a contener una parte de la api (el backend) y cada router va estar dirijido a un controlador para hacer un crud en la base de datos 

*/

//Administracion

//Citas

//Compras

//Consultas Medicas

//Consultas Odontologicas

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

//Mantenimiento

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

//Citas

//Compras

//Consultas Medicas

//Consultas Odontologicas

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

//Mantenimiento

//Personal

app.use('/api/personal/empleados', empleadosRoutes);
app.use("/api/personal/especialidades", especialidadesRoutes);
app.use("/api/personal/roles", rolesRoutes);
app.use("/api/personal/pagos_empleados", pagosEmpleadosRoutes);
app.use("/api/personal/usuarios",usuariosRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;