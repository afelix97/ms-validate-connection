//creacion de interface para la respuesta del microservicio beljerweb con estructura de datos {statusCode, data}
export interface ValidateConnectionResponse {
    statusCode: number;
    data?: DataResponse;
    error?: any;

}
export interface DataResponse {
    validations: DetalleCategoria[];
    categoriesNotFound?: string[];
}

export interface DetalleCategoria {
    categoria: number;
    status: boolean;
    error?: string;
}