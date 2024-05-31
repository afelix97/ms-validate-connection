import { v4 as uuidv4 } from 'uuid';

//se crea middleware para agregar un id identificador de cada peticion
export const UuidMiddleware = (req, res, next) => {
    // Genera un UUID por peticion y lo agrega al objeto request y response
    let uuid = uuidv4();
    req.uuid = uuid;
    req.uuid = uuid;
    next();
};