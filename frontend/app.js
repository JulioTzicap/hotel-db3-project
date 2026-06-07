const BASE_URL = 'http://localhost:3000';

// ─── TOAST ───────────────────────────────────────────────
function toast(msg, type = 'info') {
  const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
  const colors = { success: '#4caf82', error: '#e05c5c', info: '#4a9de0' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<i class="fas ${icons[type]}" style="color:${colors[type]}"></i><span>${msg}</span>`;
  document.getElementById('toastContainer').appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ─── API HELPER ──────────────────────────────────────────
async function api(method, path, body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(BASE_URL + path, opts);
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { error: 'No se pudo conectar al servidor. ¿Está corriendo en localhost:3000?' } };
  }
}

// ─── NAVIGATION ──────────────────────────────────────────
function navigate(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const page = document.getElementById('page-' + pageId);
  const nav = document.querySelector(`[data-page="${pageId}"]`);
  if (page) page.classList.add('active');
  if (nav) nav.classList.add('active');
  document.getElementById('topbarTitle').textContent = nav?.dataset.title || 'Hotel BD3';
  // Auto-load data
  const loaders = {
    dashboard: loadDashboard,
    habitaciones: loadHabitaciones,
    huespedes: loadHuespedes,
    reservas: loadReservas,
    reviews: loadReviews,
    incidencias: loadIncidencias,
    reportes: () => {},
    mongodb: () => {},
  };
  if (loaders[pageId]) loaders[pageId]();
}

// ─── MODAL ───────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ─── ESTADO BADGE ────────────────────────────────────────
function estadoBadge(estado) {
  const map = {
    disponible: 'badge-green', ocupada: 'badge-red', mantenimiento: 'badge-orange',
    limpieza: 'badge-blue', pendiente: 'badge-orange', confirmada: 'badge-gold',
    'en curso': 'badge-blue', completada: 'badge-green', cancelada: 'badge-red',
    'no show': 'badge-gray', abierta: 'badge-red', cerrada: 'badge-green',
    'en proceso': 'badge-orange', pagada: 'badge-green', 'pagada parcial': 'badge-orange',
  };
  return `<span class="badge ${map[estado] || 'badge-gray'}">${estado}</span>`;
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
async function loadDashboard() {
  // Disponibles
  const r1 = await api('GET', '/api/habitaciones-disponibles');
  if (r1.ok) {
    const count = Array.isArray(r1.data) ? r1.data.length : '—';
    document.getElementById('statDisponibles').textContent = count;
  }
  // Huéspedes actuales
  const r2 = await api('GET', '/api/huespedes-actuales');
  if (r2.ok) {
    const count = Array.isArray(r2.data) ? r2.data.length : '—';
    document.getElementById('statHuespedes').textContent = count;
  }
  // Total habitaciones
  const r3 = await api('GET', '/api/habitaciones');
  if (r3.ok) {
    const count = Array.isArray(r3.data) ? r3.data.length : '—';
    document.getElementById('statHabitaciones').textContent = count;
  }
  // Reviews
  const r4 = await api('GET', '/api/reviews');
  if (r4.ok) {
    const count = Array.isArray(r4.data) ? r4.data.length : '—';
    document.getElementById('statReviews').textContent = count;
  }
  // Huéspedes actuales tabla
  if (r2.ok && Array.isArray(r2.data)) {
    const tbody = document.getElementById('tbodyActuales');
    if (r2.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="loading-row">No hay huéspedes en estadía actualmente</td></tr>`;
    } else {
      tbody.innerHTML = r2.data.map(h => `
        <tr>
          <td class="fw-600">${h.nombres || h.nombre || '—'} ${h.apellidos || ''}</td>
          <td>${h.numero_habitacion || h.habitacion || '—'}</td>
          <td>${h.fecha_check_in ? new Date(h.fecha_check_in).toLocaleDateString('es-GT') : '—'}</td>
          <td>${h.fecha_check_out ? new Date(h.fecha_check_out).toLocaleDateString('es-GT') : '—'}</td>
          <td>${estadoBadge('en curso')}</td>
        </tr>`).join('');
    }
  }
}

// ═══════════════════════════════════════════════════════════
// HABITACIONES
// ═══════════════════════════════════════════════════════════
async function loadHabitaciones() {
  const tbody = document.getElementById('tbodyHabitaciones');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="5"><div class="spinner"></div> Cargando...</td></tr>`;
  const r = await api('GET', '/api/habitaciones');
  if (!r.ok) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="5" style="color:var(--danger)">Error: ${r.data?.error || 'Error del servidor'}</td></tr>`;
    return;
  }
  const data = Array.isArray(r.data) ? r.data : [];
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-door-open"></i><p>No hay habitaciones registradas</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(h => `
    <tr>
      <td class="fw-600">#${h.numero_habitacion}</td>
      <td>Piso ${h.numero_piso}</td>
      <td>${h.tipo || h.nombre_tipo || '—'}</td>
      <td>${estadoBadge(h.estado)}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm btn-icon" onclick="editHabitacion(${h.id_habitacion})" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteHabitacion(${h.id_habitacion})" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

async function saveHabitacion() {
  const id = document.getElementById('habId').value;
  const body = {
    numero_habitacion: document.getElementById('habNumero').value,
    numero_piso: parseInt(document.getElementById('habPiso').value),
    id_tipo_habitacion: parseInt(document.getElementById('habTipo').value),
    estado: document.getElementById('habEstado').value,
  };
  if (!body.numero_habitacion || !body.numero_piso || !body.id_tipo_habitacion) {
    toast('Completa todos los campos', 'error'); return;
  }
  const r = id
    ? await api('PUT', `/api/habitaciones/${id}`, body)
    : await api('POST', '/api/habitaciones', body);
  if (r.ok) {
    toast(id ? 'Habitación actualizada' : 'Habitación creada', 'success');
    closeModal('modalHabitacion');
    loadHabitaciones();
  } else {
    toast(r.data?.error || 'Error al guardar', 'error');
  }
}

async function editHabitacion(id) {
  const r = await api('GET', `/api/habitaciones/${id}`);
  if (!r.ok) { toast('No se pudo obtener la habitación', 'error'); return; }
  const h = Array.isArray(r.data) ? r.data[0] : r.data;
  document.getElementById('habId').value = h.id_habitacion;
  document.getElementById('habNumero').value = h.numero_habitacion;
  document.getElementById('habPiso').value = h.numero_piso;
  document.getElementById('habTipo').value = h.id_tipo_habitacion;
  document.getElementById('habEstado').value = h.estado;
  document.getElementById('modalHabitacionTitle').textContent = 'Editar Habitación';
  openModal('modalHabitacion');
}

async function deleteHabitacion(id) {
  if (!confirm('¿Eliminar esta habitación?')) return;
  const r = await api('DELETE', `/api/habitaciones/${id}`);
  if (r.ok) { toast('Habitación eliminada', 'success'); loadHabitaciones(); }
  else toast(r.data?.error || 'Error al eliminar', 'error');
}

function newHabitacion() {
  document.getElementById('habId').value = '';
  document.getElementById('habNumero').value = '';
  document.getElementById('habPiso').value = '';
  document.getElementById('habTipo').value = '1';
  document.getElementById('habEstado').value = 'disponible';
  document.getElementById('modalHabitacionTitle').textContent = 'Nueva Habitación';
  openModal('modalHabitacion');
}

// ═══════════════════════════════════════════════════════════
// HUÉSPEDES
// ═══════════════════════════════════════════════════════════
async function loadHuespedes() {
  const tbody = document.getElementById('tbodyHuespedes');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="6"><div class="spinner"></div> Cargando...</td></tr>`;
  const r = await api('GET', '/api/huespedes');
  if (!r.ok) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="6" style="color:var(--danger)">Error al cargar huéspedes</td></tr>`;
    return;
  }
  const data = Array.isArray(r.data) ? r.data : [];
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-users"></i><p>No hay huéspedes registrados</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(h => `
    <tr>
      <td class="fw-600">${h.nombres} ${h.apellidos}</td>
      <td>${h.correo}</td>
      <td>${h.telefono || '—'}</td>
      <td>${h.nacionalidad || '—'}</td>
      <td>${h.numero_documento || '—'}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm btn-icon" onclick="editHuesped(${h.id_huesped})" title="Editar"><i class="fas fa-edit"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteHuesped(${h.id_huesped})" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

async function saveHuesped() {
  const id = document.getElementById('huesId').value;
  const body = {
    nombres: document.getElementById('huesNombres').value,
    apellidos: document.getElementById('huesApellidos').value,
    correo: document.getElementById('huesCorreo').value,
    telefono: document.getElementById('huesTelefono').value,
    nacionalidad: document.getElementById('huesNacionalidad').value,
    numero_documento: document.getElementById('huesDocumento').value,
  };
  if (!body.nombres || !body.apellidos || !body.correo) {
    toast('Nombre, apellido y correo son requeridos', 'error'); return;
  }
  const r = id
    ? await api('PUT', `/api/huespedes/${id}`, body)
    : await api('POST', '/api/huespedes', body);
  if (r.ok) {
    toast(id ? 'Huésped actualizado' : 'Huésped registrado', 'success');
    closeModal('modalHuesped');
    loadHuespedes();
  } else {
    toast(r.data?.error || 'Error al guardar', 'error');
  }
}

async function editHuesped(id) {
  const r = await api('GET', `/api/huespedes/${id}`);
  if (!r.ok) { toast('No se pudo obtener el huésped', 'error'); return; }
  const h = Array.isArray(r.data) ? r.data[0] : r.data;
  document.getElementById('huesId').value = h.id_huesped;
  document.getElementById('huesNombres').value = h.nombres;
  document.getElementById('huesApellidos').value = h.apellidos;
  document.getElementById('huesCorreo').value = h.correo;
  document.getElementById('huesTelefono').value = h.telefono || '';
  document.getElementById('huesNacionalidad').value = h.nacionalidad || '';
  document.getElementById('huesDocumento').value = h.numero_documento || '';
  document.getElementById('modalHuespedTitle').textContent = 'Editar Huésped';
  openModal('modalHuesped');
}

async function deleteHuesped(id) {
  if (!confirm('¿Eliminar este huésped?')) return;
  const r = await api('DELETE', `/api/huespedes/${id}`);
  if (r.ok) { toast('Huésped eliminado', 'success'); loadHuespedes(); }
  else toast(r.data?.error || 'Error al eliminar', 'error');
}

function newHuesped() {
  ['huesId','huesNombres','huesApellidos','huesCorreo','huesTelefono','huesNacionalidad','huesDocumento'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('modalHuespedTitle').textContent = 'Nuevo Huésped';
  openModal('modalHuesped');
}

// ═══════════════════════════════════════════════════════════
// RESERVAS
// ═══════════════════════════════════════════════════════════
async function loadReservas() {
  // Load huespedes and habitaciones for selects
  const [rH, rHab] = await Promise.all([api('GET', '/api/huespedes'), api('GET', '/api/habitaciones')]);
  if (rH.ok && Array.isArray(rH.data)) {
    const sel = document.getElementById('resHuesped');
    sel.innerHTML = '<option value="">Seleccionar...</option>' +
      rH.data.map(h => `<option value="${h.id_huesped}">${h.nombres} ${h.apellidos}</option>`).join('');
  }
  if (rHab.ok && Array.isArray(rHab.data)) {
    const sel = document.getElementById('resHabitacion');
    sel.innerHTML = '<option value="">Seleccionar...</option>' +
      rHab.data.filter(h => h.estado === 'disponible').map(h => `<option value="${h.id_habitacion}">Hab. ${h.numero_habitacion} — Piso ${h.numero_piso}</option>`).join('');
  }
}

async function crearReserva() {
  const body = {
    id_huesped: parseInt(document.getElementById('resHuesped').value),
    id_habitacion: parseInt(document.getElementById('resHabitacion').value),
    fecha_check_in: document.getElementById('resCheckIn').value,
    fecha_check_out: document.getElementById('resCheckOut').value,
    cantidad_huespedes: parseInt(document.getElementById('resCantidad').value),
  };
  if (!body.id_huesped || !body.id_habitacion || !body.fecha_check_in || !body.fecha_check_out) {
    toast('Completa todos los campos', 'error'); return;
  }
  const r = await api('POST', '/api/reservas', body);
  const box = document.getElementById('resRespuesta');
  box.textContent = JSON.stringify(r.data, null, 2);
  if (r.ok) {
    toast('¡Reserva creada exitosamente!', 'success');
    // Reset
    document.getElementById('resHuesped').value = '';
    document.getElementById('resHabitacion').value = '';
    document.getElementById('resCheckIn').value = '';
    document.getElementById('resCheckOut').value = '';
    document.getElementById('resCantidad').value = '1';
  } else {
    toast(r.data?.error || 'Error al crear reserva', 'error');
  }
}

async function hacerCheckout() {
  const body = {
    id_reserva: parseInt(document.getElementById('coReserva').value),
    monto_pago: parseFloat(document.getElementById('coMonto').value),
    metodo_pago: document.getElementById('coMetodo').value,
  };
  if (!body.id_reserva || !body.monto_pago) {
    toast('ID de reserva y monto son requeridos', 'error'); return;
  }
  const r = await api('POST', '/api/checkout', body);
  const box = document.getElementById('coRespuesta');
  box.textContent = JSON.stringify(r.data, null, 2);
  if (r.ok) toast('Checkout realizado exitosamente', 'success');
  else toast(r.data?.error || 'Error en checkout', 'error');
}

// ─── SALDO ───
async function consultarSaldo() {
  const id = document.getElementById('saldoId').value;
  if (!id) { toast('Ingresa el ID de reserva', 'error'); return; }
  const r = await api('GET', `/api/saldo/${id}`);
  document.getElementById('saldoRespuesta').textContent = JSON.stringify(r.data, null, 2);
  if (!r.ok) toast('Error al consultar saldo', 'error');
}

// ═══════════════════════════════════════════════════════════
// REVIEWS (MongoDB)
// ═══════════════════════════════════════════════════════════
async function loadReviews() {
  const tbody = document.getElementById('tbodyReviews');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="6"><div class="spinner"></div> Cargando...</td></tr>`;
  const r = await api('GET', '/api/reviews');
  if (!r.ok) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="6" style="color:var(--danger)">Error al cargar reviews</td></tr>`;
    return;
  }
  const data = Array.isArray(r.data) ? r.data : [];
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-star"></i><p>No hay reviews registradas</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(rv => `
    <tr>
      <td class="fw-600">${rv.titulo || '—'}</td>
      <td>${rv.huespedId || '—'}</td>
      <td>${rv.habitacionId || '—'}</td>
      <td>${renderStars(rv.calificacion)}</td>
      <td>${rv.comentario ? rv.comentario.substring(0, 60) + '...' : '—'}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteReview('${rv._id || rv.reservaId}')" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

function renderStars(n) {
  const stars = Math.round(n || 0);
  return '★'.repeat(stars) + '☆'.repeat(5 - stars);
}

async function saveReview() {
  const body = {
    reservaId: parseInt(document.getElementById('rvReserva').value),
    huespedId: parseInt(document.getElementById('rvHuesped').value),
    habitacionId: parseInt(document.getElementById('rvHabitacion').value),
    calificacion: parseInt(document.getElementById('rvCalificacion').value),
    titulo: document.getElementById('rvTitulo').value,
    comentario: document.getElementById('rvComentario').value,
    aspectos: {
      limpieza: parseInt(document.getElementById('rvLimpieza').value),
      atencion: parseInt(document.getElementById('rvAtencion').value),
      comodidad: parseInt(document.getElementById('rvComodidad').value),
      ubicacion: parseInt(document.getElementById('rvUbicacion').value),
      precioCalidad: parseInt(document.getElementById('rvPrecio').value),
    },
    visible: true,
    fechaCreacion: new Date().toISOString(),
  };
  if (!body.reservaId || !body.titulo) { toast('Reserva ID y título son requeridos', 'error'); return; }
  const r = await api('POST', '/api/reviews', body);
  if (r.ok) {
    toast('Review creada exitosamente', 'success');
    closeModal('modalReview');
    loadReviews();
  } else {
    toast(r.data?.error || 'Error al guardar review', 'error');
  }
}

async function deleteReview(id) {
  if (!confirm('¿Eliminar esta review?')) return;
  const r = await api('DELETE', `/api/reviews/${id}`);
  if (r.ok) { toast('Review eliminada', 'success'); loadReviews(); }
  else toast('Error al eliminar', 'error');
}

// ═══════════════════════════════════════════════════════════
// INCIDENCIAS (MongoDB)
// ═══════════════════════════════════════════════════════════
async function loadIncidencias() {
  const tbody = document.getElementById('tbodyIncidencias');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="6"><div class="spinner"></div> Cargando...</td></tr>`;
  const r = await api('GET', '/api/incidencias');
  if (!r.ok) {
    tbody.innerHTML = `<tr class="loading-row"><td colspan="6" style="color:var(--danger)">Error al cargar incidencias</td></tr>`;
    return;
  }
  const data = Array.isArray(r.data) ? r.data : [];
  if (data.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>No hay incidencias registradas</p></div></td></tr>`;
    return;
  }
  tbody.innerHTML = data.map(inc => `
    <tr>
      <td class="fw-600">${inc.titulo || '—'}</td>
      <td><span class="badge badge-blue">${inc.tipo || '—'}</span></td>
      <td><span class="badge badge-red">${inc.prioridad || '—'}</span></td>
      <td>${estadoBadge(inc.estado || 'abierta')}</td>
      <td>${inc.habitacionId || '—'}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-success btn-sm btn-icon" onclick="cerrarIncidencia('${inc._id || inc.reservaId}')" title="Cerrar"><i class="fas fa-check"></i></button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="deleteIncidencia('${inc._id || inc.reservaId}')" title="Eliminar"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}

async function saveIncidencia() {
  const body = {
    reservaId: parseInt(document.getElementById('incReserva').value),
    huespedId: parseInt(document.getElementById('incHuesped').value),
    habitacionId: parseInt(document.getElementById('incHabitacion').value),
    tipo: document.getElementById('incTipo').value,
    prioridad: document.getElementById('incPrioridad').value,
    estado: 'abierta',
    titulo: document.getElementById('incTitulo').value,
    descripcion: document.getElementById('incDescripcion').value,
  };
  if (!body.titulo || !body.tipo) { toast('Título y tipo son requeridos', 'error'); return; }
  const r = await api('POST', '/api/incidencias', body);
  if (r.ok) {
    toast('Incidencia registrada', 'success');
    closeModal('modalIncidencia');
    loadIncidencias();
  } else {
    toast(r.data?.error || 'Error al registrar', 'error');
  }
}

async function cerrarIncidencia(id) {
  const r = await api('PUT', `/api/incidencias/${id}`, { estado: 'cerrada', prioridad: 'media' });
  if (r.ok) { toast('Incidencia cerrada', 'success'); loadIncidencias(); }
  else toast('Error al cerrar', 'error');
}

async function deleteIncidencia(id) {
  if (!confirm('¿Eliminar esta incidencia?')) return;
  const r = await api('DELETE', `/api/incidencias/${id}`);
  if (r.ok) { toast('Incidencia eliminada', 'success'); loadIncidencias(); }
  else toast('Error al eliminar', 'error');
}

// ═══════════════════════════════════════════════════════════
// REPORTES PostgreSQL
// ═══════════════════════════════════════════════════════════
async function runReporte(endpoint, resultId, params = '') {
  const box = document.getElementById(resultId);
  box.textContent = 'Cargando...';
  const r = await api('GET', endpoint + params);
  box.textContent = JSON.stringify(r.data, null, 2);
  if (!r.ok) toast('Error al obtener reporte', 'error');
  else toast('Reporte obtenido', 'success');
}

async function reporteDisponibilidad() {
  const inicio = document.getElementById('dispInicio').value;
  const fin = document.getElementById('dispFin').value;
  const tipo = document.getElementById('dispTipo').value;
  if (!inicio || !fin) { toast('Ingresa fechas de inicio y fin', 'error'); return; }
  const params = `?inicio=${inicio}&fin=${fin}${tipo ? '&tipo=' + tipo : ''}`;
  runReporte('/api/disponibilidad', 'resDisponibilidad', params);
}

// ═══════════════════════════════════════════════════════════
// REPORTES MongoDB
// ═══════════════════════════════════════════════════════════
// (handled by runReporte with their endpoints)

// ─── INIT ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  navigate('dashboard');
});
