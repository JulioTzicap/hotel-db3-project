function procesarPerfil(datos) {

    return {

        ...datos,

        preferencias: {

            ...datos.preferencias,

            tipo_almohada:
                datos.preferencias?.tipo_almohada?.trim(),

            temperatura_preferida:
                datos.preferencias?.temperatura_preferida?.trim(),

            vista_preferida:
                datos.preferencias?.vista_preferida?.trim()
        },

        alergias:
            datos.alergias?.map(
                alergia => alergia.trim()
            ),

        idiomas:
            datos.idiomas?.map(
                idioma => idioma.trim()
            ),

        restricciones_alimentarias:
            datos.restricciones_alimentarias?.map(
                restriccion => restriccion.trim()
            )
    };
}

module.exports = procesarPerfil;