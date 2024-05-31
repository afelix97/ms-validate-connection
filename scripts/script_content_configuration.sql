--"aplicacion": "MSVALIDATECONNECTION"
--"descripcion": "aplicacion para validar conexiones a base de datos"
insert into content_configuration (name,value,type,category,created_by,changed_by) 
values('REMEDIACIONES','{"type": "POST","ip": "127.0.0.1","port":"20050","url": "http://<ip>:<port>/validate-conection/api/v1/try-connection"}',
'MSVALIDATECONNECTION','TRY_CONNECTION','ALDO ALEJANDRO SANCHEZ FELIX','ALDO ALEJANDRO SANCHEZ FELIX');

--INSERT PARA GENERAR TOKEN
insert into cat_loginless ("type", ip) values ('MSVALIDATECONNECTION',md5('127.0.0.1'));