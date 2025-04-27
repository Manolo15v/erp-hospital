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

//Inventario

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

//Consultas Odontologicas

//Hospitalizacion

//Inventario

//Laboratorio

//Mantenimiento

//Personal


// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;