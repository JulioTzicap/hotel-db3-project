#!/bin/bash

echo "================================"
echo "RESTAURANDO BASE DE DATOS"
echo "================================"

psql -U postgres -d hotel_bd3_restaurada < backup_hotel.sql

echo ""
echo "Restauracion completada"
echo ""