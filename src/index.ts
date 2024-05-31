import "reflect-metadata";
import * as express from "express";
import { Request, Response } from "express";
import structure from './source/data';
import { Routes } from "./routes";
import * as path from 'path';
import * as cors from 'cors';
import { Logger } from "./helpers/logger";
import { UuidMiddleware } from "./middleware/Uuid.middleware";
const http = require('node:http');

//se obtiene el nombre del archivo, sin extencion para agregarlo al log
let info_app: string = `::${structure.APP_MSVALIDATECONNECTION_NAME}::${process.pid}::`;//inicializa el mensaje para el log
const logger = new Logger(info_app, path.basename(__filename).split(".")[0]);//se inicializa el logger
let prefixApi: string = structure.APP_MSVALIDATECONNECTION_PREFIX_API;

let index = Promise.resolve();
index.then(() => [])
    /*.then(arregloCredenciales => classCredenciales.getCredenciales(arregloCredenciales,
        structure.APP_MSBELJERWEB_NAME,
        structure.APP_MSBELJERWEB_BD_CONECTIONS)
    )*/
    .then(arregloCredenciales => {
        let ip = structure.APP_MSVALIDATECONNECTION_IP;
        let port = structure.APP_MSVALIDATECONNECTION_PORT as any;

        // create express app
        const app = express();

        app.use(cors());
        // Middleware para analizar datos JSON en el cuerpo de las solicitudes
        app.use(express.json({ limit: '150mb' }));
        // Middleware para analizar datos codificados en el cuerpo de las solicitudes (por ejemplo, formularios)
        app.use(express.urlencoded({ extended: true })); // support encoded bodies

        //middleware para agregar un id de request a cada peticion
        // Usa el middleware en todas las rutas
        app.use(UuidMiddleware);

        // Middleware para agregar el encabezado HSTS
        app.use((req, res, next) => {
            res.setHeader('Strict-Transport-Security', 'max-age=31536000');
            logger.info(`METHOD = ${req.method} :: ROUTE = ${req.url} :: REQUEST_ID => ${req["uuid"]} ::`);
            next();
        });

        // Crea un enrutador para las rutas del microservicio
        const microservicioRouter = express.Router();
        // Agrega el prefijo definido en prefixApi a todas las rutas del enrutador del microservicio ejemp: /api/v1
        app.use(prefixApi, microservicioRouter);

        // register express routes from defined application routes
        Routes.forEach(route => {
            (microservicioRouter as any)[route.method](route.route, async (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next);

                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
                } else if (result !== null && result !== undefined) {
                    res.json(result);
                }
            });
        });
        //se agrega respuesta para cuando no se encuentre la ruta solicitada
        app.use((req: Request, res: Response, next: Function) => {
            res.status(404);
            res.json({ Error: "NOT FOUND" });
            logger.info(`[${404}|NOT FOUND] METHOD = ${req.method} :: ROUTE = ${req.url}, RESPONSE = ${JSON.stringify({ Error: "ROUTE NOT FOUND" })}`);
        });

        // setup express app here
        // ...
        // start express server
        let httpServer = http.createServer(app);

        httpServer.listen(port, ip, () => {
            logger.info(`MicroService ${structure.APP_MSVALIDATECONNECTION_NAME} has started running at http://${ip}:${port}${prefixApi}`);
        });

    }).catch(error => logger.error(error));
