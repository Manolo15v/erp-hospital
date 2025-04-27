import { createPool } from "mysql2/promise";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER, } from "./config.js";

// Crear el pool de conexiones
export const pool = createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  database: DB_DATABASE,
});

// Probar la conexión y manejar errores
pool
  .getConnection()
  .then((connection) => {
    console.log("Conexión exitosa a la base de datos");
    connection.release(); // Liberar la conexión al pool
  })
  .catch((err) => {
    console.error("Error al conectarse a la base de datos:");

    switch (err.code) {
        case "ECONNREFUSED":
            console.error(`No se pudo conectar al servidor MySQL en ${DB_HOST}:${DB_PORT}.`);
            console.error("Verifica que el servidor MySQL esté en ejecución y que el puerto sea correcto.");
            break;

        case "ER_ACCESS_DENIED_ERROR":
            console.error(`Error de autenticación: Verifica el usuario (${DB_USER}) y la contraseña (${DB_PASSWORD}).`);
            break;

        case "ER_BAD_DB_ERROR":
            console.error(`La base de datos '${DB_DATABASE}' no existe. Verifica el nombre de la base de datos.`);
            break;

        case "ETIMEDOUT":
            console.error(`Tiempo de espera agotado al intentar conectarse a ${DB_HOST}:${DB_PORT}.`);
            console.error("Verifica tu conexión a internet, el firewall y que el servidor MySQL esté accesible.");
            break;
    
        default:
            console.error("Error desconocido:", err);
            break;
    }
  });

// Escuchar eventos de error del pool
pool.on("error", (err) => {
  console.error("Error en el pool de conexiones:");
  if (err.code === "PROTOCOL_CONNECTION_LOSTs") {
    console.error("La conexión con el servidor MySQL se perdió.");
  } else if (err.code === "ER_CON_COUNT_ERROR") {
    console.error("Se alcanzó el límite máximo de conexiones al servidor MySQL.");
  } else {
    console.error("Error desconocido en el pool:", err);
  }
});