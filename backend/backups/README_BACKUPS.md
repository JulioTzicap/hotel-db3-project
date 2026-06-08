# Estrategia de respaldos

El sistema implementa una estrategia de respaldo utilizando PostgreSQL.

## Backup Full

Se realiza mediante pg_dump, generando un archivo SQL completo con la estructura y datos de la base.

Scripts:

* backup.bat
* backup.sh

## Restauración

La restauración se realiza utilizando psql sobre una base limpia.

Scripts:

* restore.bat
* restore.sh

## Estrategia incremental

Se documenta el uso de WAL (Write Ahead Log) como mecanismo de recuperación incremental y recuperación ante fallos.

## Política de retención

* Backup full diario
* Retención de 7 respaldos
* Validación manual de integridad después de restauración
