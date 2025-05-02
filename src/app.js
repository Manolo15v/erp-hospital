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

import citasMedicasRoutes from "./consultas_medicas/routes/citasMedicas.routes.js";
import departamentosRoutes from "./consultas_medicas/routes/departamentos.routes.js";
import pacienteRoutes from "./consultas_medicas/routes/paciente.routes.js";

//Consultas Odontologicas

//Hospitalizacion

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

app.use("/api/consultas_medicas/citas", citasMedicasRoutes);
app.use("/api/consultas_medicas/departamentos", departamentosRoutes);
app.use("/api/consultas_medicas/pacientes", pacienteRoutes);

//Consultas Odontologicas

//Hospitalizacion

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


// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;