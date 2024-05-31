import structure from '../source/data';
import * as path from 'path';
import { Logger } from "../helpers/logger";
import { CredencialesService } from "./Credenciales.service";
import { ValidateConnectionRequest } from '../interfaces/ValidateConnectionRequest.interface';
import { DetalleCategoria, ValidateConnectionResponse } from '../interfaces/ValidateConnectionResponse.interface';
import { StatusHttp } from '../helpers/statusHttp';
import { DataSource, DataSourceOptions } from "typeorm";
import { ClassConexionesBD } from "../helpers/ConexionesBD.util";
import { ConexionBD } from '../interfaces/ConexionBD.interface';

export class ValidateConnectionService {
  private info_app: string = `::${structure.APP_MSVALIDATECONNECTION_NAME}::`;//inicializa el mensaje para el log
  private nameThisFile: string = path.basename(__filename).split(".")[0] + path.basename(__filename).split(".")[1];
  private logger: any = new Logger(); // instancia de la clase para registrar logs
  private credencialesService = new CredencialesService(structure.APP_CREDENCIALES_ROUTE_ALL);//se inicializa el servicio de credenciales

  async validateConnections(uuidPeticion: string, validateConnectionReq: ValidateConnectionRequest, user_auth: string) {
    let nameFunction = "[resultadoValidaciones]";
    this.logger.setLogger(this.info_app + `[${uuidPeticion}]::`, this.nameThisFile);//se agrega el uuid a la instancia del logger
    //inicializacion objeto de respuesta
    var validateConnectionResp: ValidateConnectionResponse = { statusCode: StatusHttp.BAD_REQUEST, data: { validations: [] }, error: StatusHttp[StatusHttp.BAD_REQUEST] };

    //se obtienen las credenciales del application al que se le validaran los permisos de alcance y acceso
    await this.credencialesService.getCredenciales(uuidPeticion, validateConnectionReq.categorias, user_auth).then(async (datafoCategorias) => {

      // Se obtiene el arreglo de objetos para posteriormente inicializar las conexiones con las bases de datos
      const arregloConexionesBD: DataSourceOptions[] = ClassConexionesBD.getArrayConections(datafoCategorias, uuidPeticion);

      //se delcara e inicializa el data response que detallara el status de las conexiones a validar
      let resultValidacion: DetalleCategoria[] = [];

      for (let connectionToValidate of arregloConexionesBD as ConexionBD[]) {

        // declaracion de variable que detallara el status de conexion
        let detailCateg: DetalleCategoria = { categoria: 0, error: "", status: false };

        //categoria a validar alcance y conexion
        detailCateg.categoria = connectionToValidate.name.split("|")[0] ? parseInt(connectionToValidate.name.split("|")[0]) : 0;

        //se inicializa el objeto DataSource
        let dataSource = new DataSource({ ...connectionToValidate });

        //Se establece la conexion al servidor de base de datos
        try {
          await dataSource.initialize();
        } catch (error) {
          this.logger.error(`${nameFunction}:: ERROR AL INICIALIZAR LA CONEXION [${detailCateg.categoria}] Error => ${error}`);
          detailCateg.error = error.message;
          detailCateg.status = false;
        }

        //Se valida se se logro establecer la conexion con el servidor de base de datos
        if (dataSource.isInitialized) {
          this.logger.info(`${nameFunction}:: CONEXION ESTABLECIDA => [${detailCateg.categoria}]`);
          detailCateg.status = true;

          this.destroyConnection(dataSource);// se destruye la conexion una vez establecida
        } else {
          validateConnectionResp.statusCode = StatusHttp.INTERNAL_SERVER_ERROR;
          validateConnectionResp.error = StatusHttp[StatusHttp.INTERNAL_SERVER_ERROR];
          dataSource = null;
        }

        resultValidacion.push(detailCateg);
        detailCateg = null;
      }

      //valida si existen conexiones exitosas
      if (resultValidacion.length > 0) {
        validateConnectionResp.statusCode = StatusHttp.OK;
        validateConnectionResp.data.validations = resultValidacion;
        validateConnectionResp.error = "";
      } else {
        validateConnectionResp.statusCode = StatusHttp.NO_CONTENT;
        validateConnectionResp.error = StatusHttp[StatusHttp.NO_CONTENT];
        this.logger.warn(`${nameFunction} :: SIN INFORMACION PARA VALIDAR`);
      }

      //retorna las categorias que no se encontraron
      validateConnectionResp.data.categoriesNotFound = datafoCategorias.notFound;

    }).catch((err) => {
      validateConnectionResp.statusCode = StatusHttp.INTERNAL_SERVER_ERROR;
      validateConnectionResp.error = StatusHttp[StatusHttp.INTERNAL_SERVER_ERROR];
      this.logger.error(`${nameFunction} :: credencialesService.getCredenciales CATCH => ${err}`);
    });
    return validateConnectionResp;
  }
  //funcion para destruir la conexion establecida
  async destroyConnection(dataSourceToDestroy: DataSource) {
    let nameFunction = "[ValidateConnectionService.destroyConnection]";
    if (dataSourceToDestroy) {

      let dataSourceName = dataSourceToDestroy.name;
      try {
        await dataSourceToDestroy.destroy();
        this.logger.info(`${nameFunction}:: CONEXION CERRADA => [${dataSourceName}]`);
      } catch (error) {
        this.logger.error(`${nameFunction}:: ERROR AL CERRAR CONEXION => [${dataSourceName}], Error: ${error}`);
      }
    }
  }
}