@echo off

echo ================================
echo INICIANDO BACKUP DE POSTGRESQL
echo ================================

pg_dump -U postgres -d hotel_bd3 > backup_hotel.sql

echo.
echo Backup realizado correctamente
echo Archivo generado: backup_hotel.sql
echo.

pause
