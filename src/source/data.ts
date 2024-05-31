// Definir la interfaz
interface Properties_App {
    APP_MSVALIDATECONNECTION_NAME: string;
    APP_MSVALIDATECONNECTION_IP: string;
    APP_MSVALIDATECONNECTION_PORT: number;
    APP_MSVALIDATECONNECTION_PREFIX_API: string;
    APP_MSVALIDATECONNECTION_ROUTE_DO_CONNECTION: string;
    APP_CREDENCIALES_ROUTE_ALL: string;
}

// Asignar los valores del JSON a la variable que implementa la interfaz
const PROPERTIES: Properties_App = { ...require('/sysx/nodeapps/config_msvalidateconnection.json') };

// Exportar la variable para su uso en otros módulos
export default PROPERTIES;
