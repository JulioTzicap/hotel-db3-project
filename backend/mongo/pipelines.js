// 1. Incidencias por estado y prioridad
db.incidencias.aggregate([
  {
    $group: {
      _id: {
        estado: "$estado",
        prioridad: "$prioridad"
      },
      total: { $sum: 1 }
    }
  },
  { $sort: { total: -1 } }
]);

// 2. Promedio de reseñas por habitación
db.resenas.aggregate([
  {
    $group: {
      _id: "$habitacionId",
      promedioCalificacion: { $avg: "$calificacion" },
      totalResenas: { $sum: 1 }
    }
  },
  { $sort: { promedioCalificacion: -1 } }
]);

// 3. Incidencias abiertas por habitación
db.incidencias.aggregate([
  { $match: { estado: "abierta" } },
  {
    $group: {
      _id: "$habitacionId",
      totalAbiertas: { $sum: 1 },
      incidencias: {
        $push: {
          titulo: "$titulo",
          prioridad: "$prioridad",
          fechaCreacion: "$fechaCreacion"
        }
      }
    }
  },
  { $sort: { totalAbiertas: -1 } }
]);

// 4. Dashboard con $facet
db.incidencias.aggregate([
  {
    $facet: {
      porEstado: [
        { $group: { _id: "$estado", total: { $sum: 1 } } }
      ],
      porPrioridad: [
        { $group: { _id: "$prioridad", total: { $sum: 1 } } }
      ],
      recientes: [
        { $sort: { fechaCreacion: -1 } },
        { $limit: 5 },
        {
          $project: {
            titulo: 1,
            estado: 1,
            prioridad: 1,
            fechaCreacion: 1
          }
        }
      ]
    }
  }
]);