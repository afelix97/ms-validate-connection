// creacion de interface credenciales con las siguientes propiedades "host", "db", "user", "pass", "type", "port"
export interface CredencialesResponse {
    data: CategoriasData[];
    notFound: string[];

}
export interface CategoriasData {
    categoria: number;
    valor: CategoriaValue;
    type: string;
    tipo: number;
}

export interface CategoriaValue {
    host: string;
    db: string;
    user: string;
    pass: string;
    type: string;
    port: number;
}

// creacion de interface credencialesRequest  "aplicacion":"string","categorias": [ {"categoria": "number"}]
export interface CredencialesRequest {
    categorias: number[];
}