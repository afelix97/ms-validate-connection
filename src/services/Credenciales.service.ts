import structure from '../source/data';
//se importa axios
import axios, { Method } from 'axios';
import { CredencialesRequest, CredencialesResponse } from '../interfaces/Credenciales.interface';
import * as path from 'path';
import { Logger } from "../helpers/logger";

export class CredencialesService {
    private info_app: string = `::${structure.APP_MSVALIDATECONNECTION_NAME}::`;//inicializa el mensaje para el log
    private endPoint: string = "";//se crea variable para obtener el endpoint a consumir
    private nameThisFile: string = path.basename(__filename).split(".")[0] + path.basename(__filename).split(".")[1];
    private logger = new Logger(); // instancia de la clase para registrar logs

    //se crea constructor para que se pueda instanciar la clase y se le pase por parametro un string que actualiza el endpoint
    constructor(endPoint: string) {
        this.endPoint = endPoint;
    }

    public async getCredenciales(uuidPeticion: string, categorias: number[], user_auth): Promise<CredencialesResponse> {
        this.logger.setLogger(this.info_app + `[${uuidPeticion}]::`, this.nameThisFile);//se agrega el uuid a la instancia del logger
        //se obtiene el nombre de esta funcion para el logger
        let nameFunction: string = "[getCredenciales]";

        let response: CredencialesResponse = { data: [], notFound: [] };
        let requestCredenciales: CredencialesRequest = {
            categorias: categorias
        };

        this.logger.info(`${nameFunction}:: OBTENIENDO CREDENCIALES -> ${JSON.stringify(requestCredenciales, null, 0)}`);
        //se hace la peticion al endpoint mediante axios
        let statusPeticion: any;
        let statusTextPeticion: any;

        await axios({
            method: 'GET' as Method,
            url: this.endPoint,
            headers: { 'Content-Type': 'application/json', 'auth-rdv': user_auth },
            data: requestCredenciales
        }).then(resp => {

            statusPeticion = resp.status;
            statusTextPeticion = resp.statusText;

            if (resp && resp.data) {
                response = resp.data;
            }
        }).catch(err => {
            try {
                statusPeticion = err.response.status;
                statusTextPeticion = err.response.statusText;
            } catch (error) {
                statusTextPeticion = err.message;
                statusPeticion = err.code;
            }
            //se obtiene el estatus, codigo y mensaje de error y se muestra en consola
            this.logger.error(`${nameFunction}::CATCH => ${statusPeticion} | ${statusTextPeticion}`);
        });

        this.logger.info(`${nameFunction}::[${statusPeticion}|${statusTextPeticion}] CREDENCIALES OBTENIDAS -> ${JSON.stringify(response, null, 0)}`);

        return response;
    }
}


