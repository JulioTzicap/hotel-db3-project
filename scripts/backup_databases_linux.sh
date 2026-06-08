#!/bin/bash

FECHA=$(date +%Y-%m-%d_%H-%M-%S)

# Crear carpetas por si no existen
mkdir -p backups/postgres
mkdir -p backups/mongo

# hacer backup postgres
docker exec postgres_hotel pg_dump -U postgres -d hotel > backups/postgres/hotel_$FECHA.sql

# hacer backup mongo
docker exec mongo_hotel mongodump --archive > backups/mongo/mongo_hotel_$FECHA.archive

# Borra backups de mas de 7 dias
find backups/postgres -name "*.sql" -mtime +7 -delete
find backups/mongo -name "*.archive" -mtime +7 -delete