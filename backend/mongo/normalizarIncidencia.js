function normalizarIncidencia(data) {
  return {
    reservaId: Number(data.reservaId),
    huespedId: Number(data.huespedId),
    habitacionId: Number(data.habitacionId),
    tipo: String(data.tipo).toLowerCase().trim(),
    prioridad: data.prioridad || "media",
    estado: data.estado || "abierta",
    titulo: String(data.titulo).trim(),
    descripcion: String(data.descripcion).trim(),
    evidencias: data.evidencias || [],
    seguimiento: data.seguimiento || [],
    fechaCreacion: data.fechaCreacion || new Date(),
    fechaCierre: data.fechaCierre || null
  };
}

module.exports = normalizarIncidencia;