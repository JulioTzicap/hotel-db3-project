Entrar a la carpeta de backend

    cd backend

Ejecutar los siguientes coandos:

    npm init -y

    npm install express pg mongoose dotenv cors morgan nodemon faker bcrypt uuid mongodb


Ejecutar lo archivos sql de la siguiente manera:

    schema.sql

    indexes.sql
    
    views.sql
    
    functions.sql
    
    seed.sql
    
    pruebas.sql

    procedures.sql
    
    ## Configuración de MongoDB

PARA MONGO:
desde la carpeta de backend

docker compose up -d

Para ver que el contenedor este levantado

docker ps

para ver que haya iniciado bien las colecciones

docker exec -it mongo_hotel mongosh

dentro de mongo
use hotel
show collections

debe mostrar
incidencias
reviews

Para alimentar el seed

docker exec -i mongo_hotel mongosh < mongo/seed.mongodb



