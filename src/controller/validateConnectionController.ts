import { Request, Response } from "express";
import structure from '../source/data';
import * as path from 'path';
import { Logger } from "../helpers/logger";
import { ValidateConnectionResponse } from "../interfaces/ValidateConnectionResponse.interface";
import { ValidateConnectionRequest } from "../interfaces/ValidateConnectionRequest.interface";
import { StatusHttp } from "../helpers/statusHttp";
import { ValidateConnectionService } from "../services/ValidateConnection.service";

let info_app: string = `::${structure.APP_MSVALIDATECONNECTION_NAME}::`;//inicializa el mensaje para el log
export class ValidateConnectionController {
    private nameThisFile: string = path.basename(__filename).split(".")[0];
    private logger: any = new Logger(info_app + `::`, path.basename(__filename).split(".")[0]);
    private validateConnectionService = new ValidateConnectionService();

    //funcion que retorna las actividades, sus anexos y el proyecto al que pertenece la actividad
    async doConnection(request: Request, response: Response) {
        let nameFunction: string = "[doConnection]";
        let uuidPeticion: string = request["uuid"];
        this.logger.setLogger(info_app + `[${uuidPeticion}]::`, this.nameThisFile);//se agrega el uuid a la instancia del logger
        let user_auth: string = request.headers['auth-rdv'] ? request.headers['auth-rdv'] as string : "";


        var validateConnectionReq: ValidateConnectionRequest = { ...request.body };

        //inicializacion objeto de respuesta
        var validateConnectionResp: ValidateConnectionResponse = { statusCode: StatusHttp.BAD_REQUEST, data: { validations: [] }, error: StatusHttp[StatusHttp.BAD_REQUEST] };

        this.logger.info(`[${user_auth}]::${nameFunction}:: REQUEST => ${JSON.stringify(request.body)}`);

        if (this.validateRequest(validateConnectionReq) && user_auth) {

            try {
                validateConnectionResp = await this.validateConnectionService.validateConnections(uuidPeticion, validateConnectionReq, user_auth);
            } catch (error) {
                validateConnectionResp.statusCode = StatusHttp.INTERNAL_SERVER_ERROR;
                validateConnectionResp.error = StatusHttp[StatusHttp.INTERNAL_SERVER_ERROR];
                this.logger.error(`${nameFunction} :: CATCH => ${error}`);
            }
        }

        if (validateConnectionResp.statusCode != StatusHttp.OK) {
            response.status(validateConnectionResp.statusCode).json({ Error: validateConnectionResp.error });
        } else {
            response.status(validateConnectionResp.statusCode).json(validateConnectionResp.data);
        }
        this.logger.info(`${nameFunction} :: RESPONSE => ${JSON.stringify(validateConnectionResp)}`);
    }
    //funcion para validar que el request tenga los parametros necesarios
    private validateRequest(request: ValidateConnectionRequest): boolean {
        let nameFunction = "[validateRequest]";

        let isValid: boolean = true;
        if (!request || !request.categorias || request.categorias.length < 1) {
            isValid = false;
        }
        this.logger.info(`${nameFunction} :: isValid => ${isValid}`);
        return isValid;
    }
}