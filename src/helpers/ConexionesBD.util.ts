import { DataSourceOptions } from "typeorm";
import { CategoriasData, CredencialesResponse } from "../interfaces/Credenciales.interface";
import { ConexionBD } from "../interfaces/ConexionBD.interface";

export class ClassConexionesBD {
    //se genera arreglo de conexiones a las bases de datos
    public static getArrayConections(arrayCredenciales: CredencialesResponse, uuidPeticion: string) {

        let categoriasEncontrada:CategoriasData[] = arrayCredenciales.data;
        
        let conexionesBD: DataSourceOptions[] = [];
        categoriasEncontrada.forEach((credencial) => {
            let conexionBD: ConexionBD = {
                //el nombre de la conexion se crea a partir del nombre de la base de datos y el prefijo cnx_ y el uuid de la peticion para hacer conexiones independientes por peticion
                name: credencial.categoria + "|" + uuidPeticion,
                type: credencial.valor.type,
                host: credencial.valor.host,
                port: credencial.valor.port,
                username: credencial.valor.user,
                password: credencial.valor.pass,
                database: credencial.valor.db,
                //entities: [__dirname + "/entity/*.js"],
                cache: true,
                synchronize: false,
                logging: false,
                requestTimeout: 240000,
            };
            //se agrega la conexion a la base de datos al arreglo conexionesBD
            conexionesBD.push(conexionBD);
        });

        return conexionesBD;
    }
}