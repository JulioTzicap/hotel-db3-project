Entrar a la carpeta de backend

    cd backend

Ejecutar los siguientes coandos:

    npm init -y

    npm install express pg mongoose dotenv cors morgan nodemon faker bcrypt uuid mongodb


Para levantar contenedores desde la carpeta de backend

        docker compose up -d

Para ver que el contenedor este levantado

        docker ps


Ejecutar lo archivos sql de la siguiente manera:

    schema.sql

    indexes.sql
    
    views.sql
    
    functions.sql
    
    seed.sql
    
    pruebas.sql

    procedures.sql
    


O alimentarlo con el script

Dar permisos al script

    chmod +x scripts/init_postgres.sh

Ejecutar el script

    ./scripts/init_postgres.sh



Para verificar el contenedor de mongo

    docker exec -it mongo_hotel mongosh

dentro de mongo
    
    use hotel
    show collections

debe mostrar
    
    incidencias
    reviews

Para alimentar el seed

    docker exec -i mongo_hotel mongosh < mongo/seed.mongodb

Para programar backups automaticos en linux
Abrir en terminal
    
        crontab -e

Agregar la siguiente linea

        0 1 * * * cd [Ruta al proyecto] && ./scripts/backup_databases.sh
    
** Cambiar [ruta al proyecto] por la ruta donde se guardo el proyecto

Guardar y verificar con
    
        crontab -l

Para restaurar backups

        cat backups/postgres/NOMBRE_BACKUP.sql | docker exec -i postgres_hotel psql -U postgres -d hotel

        cat backups/mongo/NOMBRE_BACKUP.archive | docker exec -i mongo_hotel mongorestore --archive

** cambiar NOMBRE_BACKUP por el nombre del ultimo backup realizado




