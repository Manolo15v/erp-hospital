import express,  {static as stc, json} from "express";
import morgan from "morgan";
import cors from "cors"; // Importa el paquete cors

const app = express();

// Middlewares
app.use(cors()); 
app.use(morgan("dev"));
app.use(json());
app.use(stc("public"));

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "Not found" });
});

export default app;