const mysql= require('mysql2')

const db = mysql.createConnection(
    {
        host:'localhost',
        user:'root',
        password:'v11g06tr',
        database:'sistema_gestion_hospitalaria',
        port: 3306
    }
);
db.connect((err)=>{
    if(err){
        throw err;
    }
    console.log('Conectado a la base de datos')
})
module.exports=db;