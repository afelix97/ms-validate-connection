import * as dateFormat from "dateformat";
const reset = '\x1b[0m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const red = '\x1b[31m';
const uuidIdentif = '\x1b[1m\x1b[92m';

export class Logger {
    private info_app: string = "";
    private dateNow = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss.l");//se obtiene fecha y hora actual para log

    constructor(info_app?: string, pathFileName?: string) {
        this.info_app = `${info_app}[${pathFileName}]::`;
    }
    //funcion para pintar el log
    public info(msg: string) {
        const sanitizedMsg = this.sanitizeString(msg);
        console.info(`${green}::INFO::${this.dateNow}${this.info_app}${reset} ${sanitizedMsg}`);
    }

    //funcion para pintar el log
    public error(msg: string) {
        const sanitizedMsg = this.sanitizeString(msg);
        console.error(`${red}::ERROR::${this.dateNow}${this.info_app}${reset} ${sanitizedMsg}`);
    }
    //funcion para pintar el log
    public warn(msg: string) {
        const sanitizedMsg = this.sanitizeString(msg);
        console.warn(`${yellow}::WARN::${this.dateNow}${this.info_app}${reset} ${sanitizedMsg}`);
    }

    setLogger(info_app: string, pathFileName: string) {
        this.info_app = `${info_app}[${pathFileName}]::`;
    }
    //funcion para limpiar los caracteres especiales
    public sanitizeString(input: string): string {
        // Expresión regular para eliminar caracteres especiales y secuencias de escape
        //let sanitizedInput = JSON.stringify(input);
        let sanitizedInput = input;

        //validar si el input contiene la siguiente palabra "REQUEST_ID =>" para agregar color al uuid
        if (sanitizedInput.includes("REQUEST_ID =>")) {
            let uuid = sanitizedInput.split(" => ")[1].replace(' ::"', "");
            sanitizedInput = sanitizedInput.replace(uuid, `${uuidIdentif}${uuid}${reset}`);//se agrega color al uuid
        }

        return sanitizedInput;
    }
}


