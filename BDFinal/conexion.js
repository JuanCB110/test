let mysql = require("mysql");
const { listenerCount } = require("process");

//Operaciones MySql
//SELECT * FROM `usuario` WHERE 1
//INSERT INTO `usuario`(`IDUsuario`, `NombreU`, `Correo`, `Contraseña`, `NombreC`, `ApellidoP`, `ApellidoM`, `FechaC`) VALUES ('[value-1]','[value-2]','[value-3]','[value-4]','[value-5]','[value-6]','[value-7]','[value-8]')
//UPDATE `usuario` SET `IDUsuario`='[value-1]',`NombreU`='[value-2]',`Correo`='[value-3]',`Contraseña`='[value-4]',`NombreC`='[value-5]',`ApellidoP`='[value-6]',`ApellidoM`='[value-7]',`FechaC`='[value-8]' WHERE 1
//DELETE FROM `usuario` WHERE 0

let conecion = mysql.createConnection({
    host: "localhost",
    database: "koki_shop",
    user: "root",
    password: ""
});

conecion.connect(function(err){
    if(err){
        throw err;
    }else{
        console.log("Conexion Exitosa");
    }
});

//Cosulta
const usuario = "SELECT * FROM usuario";

conecion.query(usuario, function(error, lista){
    if(error){
        throw error;
    } else {
        console.log(lista);
    }
});

//Modificacion
const modireg = "UPDATE usuario SET NombreC = 'Carmen Armida' WHERE IDUsuario = 23;";
conecion.query(modireg, function(error, rows){
    if(error){
        throw error;
    } else {
        console.log("Datos insertados correcctamente");
    }
});

/*
//Insercion
const novoreg = "INSERT INTO usuario(NombreU, Correo, Contraseña, NombreC, ApellidoP, ApellidoM, FechaC) VALUES ('juanus','juanus@gmail.com','8r887y', 'Juan Carlos de Jesus', 'Cota', 'Bobadilla', '2003-12-20')";
conecion.query(novoreg, function(error, rows){
    if(error){
        throw error;
    } else {
        console.log("Datos insertados correcctamente");
    }
});
*/

conecion.end();