db = db.getSiblingDB("hotel");

db.createCollection("incidencias");
db.createCollection("reviews");

db.incidencias.createIndex({ reservaId: 1 });
db.incidencias.createIndex({ huespedId: 1 });
db.incidencias.createIndex({ habitacionId: 1 });
db.incidencias.createIndex({ estado: 1, prioridad: 1 });
db.incidencias.createIndex({ fechaCreacion: -1 });

db.reviews.createIndex({ reservaId: 1 }, { unique: true });
db.reviews.createIndex({ huespedId: 1 });
db.reviews.createIndex({ calificacion: 1 });
db.reviews.createIndex({ fechaCreacion: -1 });