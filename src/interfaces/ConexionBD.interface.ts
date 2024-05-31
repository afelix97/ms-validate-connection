
//se crea interface para la conexion a la base de datos
export interface ConexionBD {
    name?: string;
    type: any;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities?: any[];
    cache: boolean;
    synchronize: boolean;
    logging: boolean;
    requestTimeout: number;
    options?: any;
}