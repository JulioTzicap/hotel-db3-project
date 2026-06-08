#!/bin/bash

echo "Inicializando base de datos hotel..."

docker exec -i postgres_hotel psql -U postgres -d hotel < sql/schema.sql

docker exec -i postgres_hotel psql -U postgres -d hotel < sql/seeds.sql

docker exec -i postgres_hotel psql -U postgres -d hotel < sql/functions.sql

docker exec -i postgres_hotel psql -U postgres -d hotel < sql/procedures.sql

docker exec -i postgres_hotel psql -U postgres -d hotel < sql/views.sql

docker exec -i postgres_hotel psql -U postgres -d hotel < sql/indexes.sql

echo "Base de datos cargada correctamente."