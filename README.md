# ms-validate-connection

Microservicio para validar alcance y conexion servidor de base de datos

### Como Utilizar
**Puerto 20050**<br>
**Ruta PREFIX:** */validate-conection/api/v1/*<br>
**Ejemplo ruta completa:** *http://host:20050/validate-conection/api/v1/*

**try connection** <br>
*Tipo: POST*<br>
*Ruta: /try-connection*<br>
*type: MSVALIDCONNECT*<br>
*Category: TRY_CONNECTION*<br>
*Request:*

| Valor | Tipo | Requerido | Descripcion |
| ------ | ------ | ------ | ------ |
| categorias | Array | Si | Categorias a validar, Ejemplo: [4000,2190,2344,2099,...] |
<br>

*Header (consumo de forma directa):*
```
{
   "auth-rdv":"231644"
}
```
*Response esperado:*
```
{
    "validations": [
        {
            "categoria": 2099,
            "error": "",
            "status": true
        },
        {
            "categoria": 2190,
            "error": "connect ECONNREFUSED 10.59.17.112:5433",
            "status": false
        },
        {
            "categoria": 4000,
            "error": "",
            "status": true
        }
    ],
    "categoriesNotFound": [
        2342
    ]
}
```

**Valores como el puerto y las rutas pueden cambiar. Validar variables de ambiente en la ruta /sysx/progs/web/conf/config_msvalidateconnection.json o /sysx/nodeapps/config_msvalidateconnection.json*
```
{
    "APP_MSVALIDATECONNECTION_NAME": "MSVALIDCONNECT",
    "APP_MSVALIDATECONNECTION_IP": "127.0.0.1",
    "APP_MSVALIDATECONNECTION_PORT": 20050,
    "APP_MSVALIDATECONNECTION_PREFIX_API": "/validate-conection/api/v1",
    "APP_MSVALIDATECONNECTION_ROUTE_DO_CONNECTION": "/try-connection",
    "APP_CREDENCIALES_ROUTE_ALL": "http://127.0.0.1:30004/credenciales"
}
```

**Nota: El Microservicio esta configurado para poder ser consumido mediante el Microservicio del Proxy*
```
{
    "name": "REMEDIACIONES",
    "type": "MSVALIDCONNECT",
    "category": "TRY_CONNECTION",
    "rutaValidacion": "http://127.0.0.1:20027/authtoken/validateToken",
    "categorias": [
        4000,
        2190,
        2344,
        2099
    ]
}
```