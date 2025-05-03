import { pool } from "../../db.js";
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

export const loginQ = async (req, res) => {

    const data = await loadUsers();
    res.status(200).json({results: data});
};

export const save_json = async (req, res) => {
    try {
        const data = req.body;

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);

        const filePath = path.join(__dirname, '..', '..', 'usuario.json');

        // Guardar los datos en el archivo JSON
        await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');

        res.status(200).json({ message: 'Archivo JSON guardado exitosamente' });
    } catch (error) {
        console.error('Error al guardar el archivo JSON:', error);
        res.status(500).json({ message: 'Error al guardar el archivo JSON' });
    }
}

async function loadUsers() {
    let data = [];
    const [departments] = await pool.query('SELECT * FROM departamentos');
    const [employees] = await pool.query('SELECT * FROM empleados');
    const [users] = await pool.query('SELECT * FROM usuarios');
    const [roles] = await pool.query('SELECT * FROM roles');

    users.forEach(user => {
        const employee = employees.find(employee => employee.empleado_id == user.empleado_id) || null;

        let role, department;

        if (employee) {
            role = roles.find(role => role.rol_id == employee.rol_id) || null;
            department = departments.find(department => department.departamento_id == employee.departamento_id) || null;
        }

        user = {
            id: user.usuario_id,
            usuario: user.usuario,
            clave: user.clave,
            empleado_id: user.empleado_id,
            nombre: employee ? employee.nombre : null,
            apellido: employee ? employee.apellido : null,
            email: employee ? employee.email : null,
            cargo: employee ? employee.cargo : null,
            rol: role ? role.nombre : null,
            departamento: department ? department.nombre : null,
            area: employee ? employee.area : null,
            modulos: user.modulos ? user.modulos.split(',') : []
        };

        data.push(user);
    });

    return data;
}
