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
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(BASE_URL + path, opts);
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { error: 'No se pudo conectar al servidor.' } };
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
  return `<span class="badge ${map[estado] || 'badge-gray'}">${estado || '—'}</span>`;
}

// ─── RENDER TABLE HELPER ─────────────────────────────────
function renderTable(containerId, data, columns) {
  const container = document.getElementById(containerId);
  if (!data || data.length === 0) {
    container.innerHTML = `<div class="empty-state"><i class="fas fa-inbox"></i><p>Sin datos para mostrar</p></div>`;
    return;
  }
  const thead = columns.map(c => `<th>${c.label}</th>`).join('');
  const tbody = data.map(row => {
    const cells = columns.map(c => {
      let val = row[c.key] ?? '—';
      if (c.format === 'money') val = val !== '—' ? `Q ${parseFloat(val).toLocaleString('es-GT', {minimumFractionDigits:2})}` : '—';
      if (c.format === 'date' && val !== '—') val = new Date(val).toLocaleDateString('es-GT');
      if (c.format === 'pct') val = val !== '—' ? `${parseFloat(val).toFixed(1)}%` : '—';
      if (c.format === 'stars') val = renderStars(val);
      if (c.format === 'badge') val = estadoBadge(val);
      if (c.bold) val = `<strong>${val}</strong>`;
      return `<td>${val}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  container.innerHTML = `
    <div class="table-container">
      <table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table>
    </div>`;
}

function renderStars(n) {
  const s = Math.round(n || 0);
  return `<span style="color:var(--gold);letter-spacing:2px">${'★'.repeat(s)}${'☆'.repeat(5-s)}</span> <span class="text-muted">(${n})</span>`;
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
async function loadDashboard() {
  const [r1, r2, r3, r4] = await Promise.all([
    api('GET', '/api/habitaciones-disponibles'),
    api('GET', '/api/huespedes-actuales'),
    api('GET', '/api/habitaciones'),
    api('GET', '/api/reviews'),
  ]);
  if (r1.ok) document.getElementById('statDisponibles').textContent = Array.isArray(r1.data) ? r1.data.length : '—';
  if (r2.ok) document.getElementById('statHuespedes').textContent = Array.isArray(r2.data) ? r2.data.length : '—';
  if (r3.ok) document.getElementById('statHabitaciones').textContent = Array.isArray(r3.data) ? r3.data.length : '—';
  if (r4.ok) document.getElementById('statReviews').textContent = Array.isArray(r4.data) ? r4.data.length : '—';

  if (r2.ok && Array.isArray(r2.data)) {
    const tbody = document.getElementById('tbodyActuales');
    if (r2.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="loading-row">No hay huéspedes en estadía actualmente</td></tr>`;
    } else {
      tbody.innerHTML = r2.data.map(h => `<tr>
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
  if (!r.ok) { tbody.innerHTML = `<tr class="loading-row"><td colspan="5" style="color:var(--danger)">${r.data?.error || 'Error del servidor'}</td></tr>`; return; }
  const data = Array.isArray(r.data) ? r.data : [];
  if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-door-open"></i><p>No hay habitaciones</p></div></td></tr>`; return; }
  tbody.innerHTML = data.map(h => `<tr>
    <td class="fw-600">#${h.numero_habitacion}</td>
    <td>Piso ${h.numero_piso}</td>
    <td>${h.tipo || h.nombre_tipo || '—'}</td>
    <td>${estadoBadge(h.estado)}</td>
    <td><div class="flex gap-2">
      <button class="btn btn-outline btn-sm btn-icon" onclick="editHabitacion(${h.id_habitacion})" title="Editar"><i class="fas fa-edit"></i></button>
      <button class="btn btn-danger btn-sm btn-icon" onclick="deleteHabitacion(${h.id_habitacion})" title="Eliminar"><i class="fas fa-trash"></i></button>
    </div></td>
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
  if (!body.numero_habitacion || !body.numero_piso || !body.id_tipo_habitacion) { toast('Completa todos los campos', 'error'); return; }
  const r = id ? await api('PUT', `/api/habitaciones/${id}`, body) : await api('POST', '/api/habitaciones', body);
  if (r.ok) { toast(id ? 'Habitación actualizada' : 'Habitación creada', 'success'); closeModal('modalHabitacion'); loadHabitaciones(); }
  else toast(r.data?.error || 'Error al guardar', 'error');
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
  ['habId','habNumero','habPiso'].forEach(i => document.getElementById(i).value = '');
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
  if (!r.ok) { tbody.innerHTML = `<tr class="loading-row"><td colspan="6" style="color:var(--danger)">Error al cargar huéspedes</td></tr>`; return; }
  const data = Array.isArray(r.data) ? r.data : [];
  if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><i class="fas fa-users"></i><p>No hay huéspedes</p></div></td></tr>`; return; }
  tbody.innerHTML = data.map(h => `<tr>
    <td class="fw-600">${h.nombres} ${h.apellidos}</td>
    <td>${h.correo}</td>
    <td>${h.telefono || '—'}</td>
    <td>${h.nacionalidad || '—'}</td>
    <td>${h.numero_documento || '—'}</td>
    <td><div class="flex gap-2">
      <button class="btn btn-outline btn-sm btn-icon" onclick="editHuesped(${h.id_huesped})"><i class="fas fa-edit"></i></button>
      <button class="btn btn-danger btn-sm btn-icon" onclick="deleteHuesped(${h.id_huesped})"><i class="fas fa-trash"></i></button>
    </div></td>
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
  if (!body.nombres || !body.apellidos || !body.correo) { toast('Nombre, apellido y correo son requeridos', 'error'); return; }
  const r = id ? await api('PUT', `/api/huespedes/${id}`, body) : await api('POST', '/api/huespedes', body);
  if (r.ok) { toast(id ? 'Huésped actualizado' : 'Huésped registrado', 'success'); closeModal('modalHuesped'); loadHuespedes(); }
  else toast(r.data?.error || 'Error al guardar', 'error');
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
  ['huesId','huesNombres','huesApellidos','huesCorreo','huesTelefono','huesNacionalidad','huesDocumento'].forEach(i => document.getElementById(i).value = '');
  document.getElementById('modalHuespedTitle').textContent = 'Nuevo Huésped';
  openModal('modalHuesped');
}

// ═══════════════════════════════════════════════════════════
// RESERVAS
// ═══════════════════════════════════════════════════════════
async function loadReservas() {
  const [rH, rHab] = await Promise.all([api('GET', '/api/huespedes'), api('GET', '/api/habitaciones')]);
  if (rH.ok && Array.isArray(rH.data)) {
    document.getElementById('resHuesped').innerHTML = '<option value="">Seleccionar...</option>' +
      rH.data.map(h => `<option value="${h.id_huesped}">${h.nombres} ${h.apellidos}</option>`).join('');
  }
  if (rHab.ok && Array.isArray(rHab.data)) {
    document.getElementById('resHabitacion').innerHTML = '<option value="">Seleccionar...</option>' +
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
  if (!body.id_huesped || !body.id_habitacion || !body.fecha_check_in || !body.fecha_check_out) { toast('Completa todos los campos', 'error'); return; }
  const r = await api('POST', '/api/reservas', body);
  const box = document.getElementById('resRespuesta');
  if (r.ok) {
    toast('¡Reserva creada exitosamente!', 'success');
    box.innerHTML = `<div style="color:var(--success)"><i class="fas fa-check-circle"></i> Reserva creada exitosamente</div>
      <div class="mt-4" style="font-size:.85rem;color:var(--text-muted)">${JSON.stringify(r.data, null, 2)}</div>`;
  } else {
    toast(r.data?.error || 'Error al crear reserva', 'error');
    box.innerHTML = `<div style="color:var(--danger)"><i class="fas fa-times-circle"></i> ${r.data?.error || 'Error al crear reserva'}</div>`;
  }
}

async function hacerCheckout() {
  const body = {
    id_reserva: parseInt(document.getElementById('coReserva').value),
    monto_pago: parseFloat(document.getElementById('coMonto').value),
    metodo_pago: document.getElementById('coMetodo').value,
  };
  if (!body.id_reserva || !body.monto_pago) { toast('ID y monto son requeridos', 'error'); return; }
  const r = await api('POST', '/api/checkout', body);
  const box = document.getElementById('coRespuesta');
  if (r.ok) {
    toast('Checkout realizado exitosamente', 'success');
    box.innerHTML = `<div style="color:var(--success)"><i class="fas fa-check-circle"></i> Checkout completado</div>
      <div class="mt-4" style="font-size:.85rem;color:var(--text-muted)">${JSON.stringify(r.data, null, 2)}</div>`;
  } else {
    toast(r.data?.error || 'Error en checkout', 'error');
    box.innerHTML = `<div style="color:var(--danger)"><i class="fas fa-times-circle"></i> ${r.data?.error || 'Error'}</div>`;
  }
}

async function consultarSaldo() {
  const id = document.getElementById('saldoId').value;
  if (!id) { toast('Ingresa el ID de reserva', 'error'); return; }
  const r = await api('GET', `/api/saldo/${id}`);
  const box = document.getElementById('saldoRespuesta');
  if (r.ok) {
    const d = Array.isArray(r.data) ? r.data[0] : r.data;
    box.innerHTML = `
      <div class="grid-2" style="gap:12px">
        <div class="stat-card" style="padding:16px">
          <div class="stat-icon gold"><i class="fas fa-file-invoice-dollar"></i></div>
          <div><div class="stat-value" style="font-size:1.3rem">Q ${parseFloat(d.total || d.monto_total || 0).toLocaleString('es-GT',{minimumFractionDigits:2})}</div><div class="stat-label">Total facturado</div></div>
        </div>
        <div class="stat-card" style="padding:16px">
          <div class="stat-icon red"><i class="fas fa-coins"></i></div>
          <div><div class="stat-value" style="font-size:1.3rem">Q ${parseFloat(d.saldo || d.saldo_pendiente || 0).toLocaleString('es-GT',{minimumFractionDigits:2})}</div><div class="stat-label">Saldo pendiente</div></div>
        </div>
      </div>`;
  } else {
    box.innerHTML = `<div style="color:var(--danger)"><i class="fas fa-times-circle"></i> No se encontró la reserva</div>`;
  }
}

// ═══════════════════════════════════════════════════════════
// REVIEWS
// ═══════════════════════════════════════════════════════════
async function loadReviews() {
  const tbody = document.getElementById('tbodyReviews');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="5"><div class="spinner"></div> Cargando...</td></tr>`;
  const r = await api('GET', '/api/reviews');
  if (!r.ok) { tbody.innerHTML = `<tr class="loading-row"><td colspan="5" style="color:var(--danger)">Error al cargar reviews</td></tr>`; return; }
  const data = Array.isArray(r.data) ? r.data : [];
  if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-star"></i><p>No hay reviews</p></div></td></tr>`; return; }
  tbody.innerHTML = data.map((rv, i) => `<tr>
    <td class="fw-600">${rv.titulo || '—'}</td>
    <td>${renderStars(rv.calificacion)}</td>
    <td>${rv.huespedId || '—'}</td>
    <td>${rv.habitacionId || '—'}</td>
    <td><div class="flex gap-2">
      <button class="btn btn-outline btn-sm" onclick="verDetalleReview(${i})"><i class="fas fa-eye"></i> Ver</button>
      <button class="btn btn-danger btn-sm btn-icon" onclick="deleteReview('${rv._id || rv.reservaId}')"><i class="fas fa-trash"></i></button>
    </div></td>
  </tr>`).join('');
  window._reviewsData = data;
}

function verDetalleReview(i) {
  const rv = window._reviewsData[i];
  if (!rv) return;
  const aspectos = rv.aspectos || {};
  document.getElementById('detalleModalTitle').textContent = rv.titulo || 'Detalle de Review';
  document.getElementById('detalleModalBody').innerHTML = `
    <div class="flex gap-2 items-center mb-4">
      <span style="font-size:1.5rem;color:var(--gold)">${'★'.repeat(Math.round(rv.calificacion || 0))}${'☆'.repeat(5 - Math.round(rv.calificacion || 0))}</span>
      <span class="fw-600" style="font-size:1.1rem">${rv.calificacion}/5</span>
    </div>
    <div class="grid-2 mb-4" style="gap:10px">
      <div><span class="text-muted">Huésped ID</span><div class="fw-600">${rv.huespedId || '—'}</div></div>
      <div><span class="text-muted">Habitación ID</span><div class="fw-600">${rv.habitacionId || '—'}</div></div>
      <div><span class="text-muted">Reserva ID</span><div class="fw-600">${rv.reservaId || '—'}</div></div>
      <div><span class="text-muted">Fecha</span><div class="fw-600">${rv.fechaCreacion ? new Date(rv.fechaCreacion).toLocaleDateString('es-GT') : '—'}</div></div>
    </div>
    <div class="form-label mb-2">Comentario completo</div>
    <div style="background:var(--dark-3);border-radius:8px;padding:16px;line-height:1.7;color:var(--text);border:1px solid #2a2a2a">${rv.comentario || '—'}</div>
    ${Object.keys(aspectos).length ? `
    <div class="divider"></div>
    <div class="form-label mb-3" style="color:var(--gold)">Aspectos evaluados</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
      ${Object.entries(aspectos).map(([k,v]) => `
        <div style="background:var(--dark-3);border-radius:8px;padding:12px;border:1px solid #2a2a2a">
          <div class="text-muted" style="font-size:.75rem;text-transform:capitalize;margin-bottom:4px">${k}</div>
          <div style="color:var(--gold)">${'★'.repeat(v)}${'☆'.repeat(5-v)}</div>
        </div>`).join('')}
    </div>` : ''}`;
  openModal('modalDetalle');
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
  if (r.ok) { toast('Review creada exitosamente', 'success'); closeModal('modalReview'); loadReviews(); }
  else toast(r.data?.error || 'Error al guardar', 'error');
}

async function deleteReview(id) {
  if (!confirm('¿Eliminar esta review?')) return;
  const r = await api('DELETE', `/api/reviews/${id}`);
  if (r.ok) { toast('Review eliminada', 'success'); loadReviews(); }
  else toast('Error al eliminar', 'error');
}

// ═══════════════════════════════════════════════════════════
// INCIDENCIAS
// ═══════════════════════════════════════════════════════════
async function loadIncidencias() {
  const tbody = document.getElementById('tbodyIncidencias');
  tbody.innerHTML = `<tr class="loading-row"><td colspan="5"><div class="spinner"></div> Cargando...</td></tr>`;
  const r = await api('GET', '/api/incidencias');
  if (!r.ok) { tbody.innerHTML = `<tr class="loading-row"><td colspan="5" style="color:var(--danger)">Error al cargar incidencias</td></tr>`; return; }
  const data = Array.isArray(r.data) ? r.data : [];
  if (data.length === 0) { tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>No hay incidencias</p></div></td></tr>`; return; }
  tbody.innerHTML = data.map((inc, i) => `<tr>
    <td class="fw-600">${inc.titulo || '—'}</td>
    <td><span class="badge badge-blue">${inc.tipo || '—'}</span></td>
    <td><span class="badge ${inc.prioridad === 'alta' ? 'badge-red' : inc.prioridad === 'media' ? 'badge-orange' : 'badge-gray'}">${inc.prioridad || '—'}</span></td>
    <td>${estadoBadge(inc.estado || 'abierta')}</td>
    <td><div class="flex gap-2">
      <button class="btn btn-outline btn-sm" onclick="verDetalleIncidencia(${i})"><i class="fas fa-eye"></i> Ver</button>
      <button class="btn btn-success btn-sm btn-icon" onclick="cerrarIncidencia('${inc._id || inc.reservaId}')" title="Cerrar"><i class="fas fa-check"></i></button>
      <button class="btn btn-danger btn-sm btn-icon" onclick="deleteIncidencia('${inc._id || inc.reservaId}')"><i class="fas fa-trash"></i></button>
    </div></td>
  </tr>`).join('');
  window._incidenciasData = data;
}

function verDetalleIncidencia(i) {
  const inc = window._incidenciasData[i];
  if (!inc) return;
  document.getElementById('detalleModalTitle').textContent = inc.titulo || 'Detalle de Incidencia';
  document.getElementById('detalleModalBody').innerHTML = `
    <div class="flex gap-2 mb-4" style="flex-wrap:wrap">
      <span class="badge badge-blue">${inc.tipo || '—'}</span>
      <span class="badge ${inc.prioridad === 'alta' ? 'badge-red' : inc.prioridad === 'media' ? 'badge-orange' : 'badge-gray'}">Prioridad: ${inc.prioridad || '—'}</span>
      ${estadoBadge(inc.estado || 'abierta')}
    </div>
    <div class="grid-2 mb-4" style="gap:10px">
      <div><span class="text-muted">Huésped ID</span><div class="fw-600">${inc.huespedId || '—'}</div></div>
      <div><span class="text-muted">Habitación ID</span><div class="fw-600">${inc.habitacionId || '—'}</div></div>
      <div><span class="text-muted">Reserva ID</span><div class="fw-600">${inc.reservaId || '—'}</div></div>
    </div>
    <div class="form-label mb-2">Descripción completa</div>
    <div style="background:var(--dark-3);border-radius:8px;padding:16px;line-height:1.7;color:var(--text);border:1px solid #2a2a2a">${inc.descripcion || '—'}</div>`;
  openModal('modalDetalle');
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
  if (r.ok) { toast('Incidencia registrada', 'success'); closeModal('modalIncidencia'); loadIncidencias(); }
  else toast(r.data?.error || 'Error al registrar', 'error');
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
// REPORTES PostgreSQL — en tablas bonitas
// ═══════════════════════════════════════════════════════════
async function reporteHabDisponibles() {
  const btn = event.target; btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
  const r = await api('GET', '/api/habitaciones-disponibles');
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> Ejecutar';
  if (!r.ok) { toast('Error al obtener reporte', 'error'); return; }
  renderTable('rHabDisp', Array.isArray(r.data) ? r.data : [r.data], [
    { key: 'numero_habitacion', label: 'N° Habitación', bold: true },
    { key: 'numero_piso', label: 'Piso' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'capacidad', label: 'Capacidad' },
    { key: 'precio_noche', label: 'Precio/noche', format: 'money' },
    { key: 'estado', label: 'Estado', format: 'badge' },
  ]);
  toast('Reporte obtenido', 'success');
}

async function reporteHuespActuales() {
  const btn = event.target; btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
  const r = await api('GET', '/api/huespedes-actuales');
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> Ejecutar';
  if (!r.ok) { toast('Error al obtener reporte', 'error'); return; }
  renderTable('rHuespAct', Array.isArray(r.data) ? r.data : [r.data], [
    { key: 'nombres', label: 'Nombres', bold: true },
    { key: 'apellidos', label: 'Apellidos' },
    { key: 'numero_habitacion', label: 'Habitación' },
    { key: 'fecha_check_in', label: 'Check-in', format: 'date' },
    { key: 'fecha_check_out', label: 'Check-out est.', format: 'date' },
    { key: 'dias_transcurridos', label: 'Días' },
  ]);
  toast('Reporte obtenido', 'success');
}

async function reporteOcupacion() {
  const btn = event.target; btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
  const r = await api('GET', '/api/ocupacion-mensual');
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> Ejecutar';
  if (!r.ok) { toast('Error al obtener reporte', 'error'); return; }
  renderTable('rOcup', Array.isArray(r.data) ? r.data : [r.data], [
    { key: 'mes', label: 'Mes', bold: true },
    { key: 'tipo_habitacion', label: 'Tipo' },
    { key: 'porcentaje_ocupacion', label: '% Ocupación', format: 'pct' },
    { key: 'ingresos_hospedaje', label: 'Ingresos hospedaje', format: 'money' },
    { key: 'ingresos_extras', label: 'Ingresos extras', format: 'money' },
    { key: 'total_reservas', label: 'Total reservas' },
  ]);
  toast('Reporte obtenido', 'success');
}

async function reporteSaldo() {
  const id = document.getElementById('rSaldoId').value;
  if (!id) { toast('Ingresa el ID de reserva', 'error'); return; }
  const r = await api('GET', `/api/saldo/${id}`);
  if (!r.ok) { toast('Error al obtener saldo', 'error'); return; }
  const d = Array.isArray(r.data) ? r.data[0] : r.data;
  document.getElementById('rSaldo').innerHTML = `
    <div class="grid-2" style="gap:12px">
      <div class="stat-card" style="padding:16px">
        <div class="stat-icon gold"><i class="fas fa-file-invoice"></i></div>
        <div><div class="stat-value" style="font-size:1.2rem">Q ${parseFloat(d.total || d.monto_total || 0).toLocaleString('es-GT',{minimumFractionDigits:2})}</div><div class="stat-label">Total facturado</div></div>
      </div>
      <div class="stat-card" style="padding:16px">
        <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
        <div><div class="stat-value" style="font-size:1.2rem">Q ${parseFloat(d.pagado || d.monto_pagado || 0).toLocaleString('es-GT',{minimumFractionDigits:2})}</div><div class="stat-label">Ya pagado</div></div>
      </div>
      <div class="stat-card" style="padding:16px;grid-column:1/-1">
        <div class="stat-icon red"><i class="fas fa-coins"></i></div>
        <div><div class="stat-value" style="font-size:1.4rem">Q ${parseFloat(d.saldo || d.saldo_pendiente || 0).toLocaleString('es-GT',{minimumFractionDigits:2})}</div><div class="stat-label">Saldo pendiente</div></div>
      </div>
    </div>`;
  toast('Saldo consultado', 'success');
}

async function reporteDisponibilidad() {
  const inicio = document.getElementById('dispInicio').value;
  const fin = document.getElementById('dispFin').value;
  const tipo = document.getElementById('dispTipo').value;
  if (!inicio || !fin) { toast('Ingresa fechas de inicio y fin', 'error'); return; }
  const params = `?inicio=${inicio}&fin=${fin}${tipo ? '&tipo=' + tipo : ''}`;
  const r = await api('GET', '/api/disponibilidad' + params);
  if (!r.ok) { toast('Error al obtener disponibilidad', 'error'); return; }
  renderTable('resDisponibilidad', Array.isArray(r.data) ? r.data : [r.data], [
    { key: 'numero_habitacion', label: 'N° Habitación', bold: true },
    { key: 'numero_piso', label: 'Piso' },
    { key: 'tipo', label: 'Tipo' },
    { key: 'capacidad', label: 'Capacidad' },
    { key: 'precio_noche', label: 'Precio/noche', format: 'money' },
  ]);
  toast('Disponibilidad obtenida', 'success');
}

// ═══════════════════════════════════════════════════════════
// REPORTES MongoDB — en tablas bonitas
// ═══════════════════════════════════════════════════════════
async function reporteSatisfaccion() {
  const btn = event.target; btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
  const r = await api('GET', '/api/satisfaccion');
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> Ejecutar';
  if (!r.ok) { toast('Error al obtener reporte', 'error'); return; }
  const raw = Array.isArray(r.data) ? r.data : [r.data];
  // Normalizar campos: soporta tanto snake_case como camelCase
  const data = raw.map(d => ({
    trimestre: d.trimestre || d._id || '—',
    promedio_general: parseFloat(d.promedio_general || d.promediaCalificacion || d.promedioCalificacion || 0).toFixed(2),
    total_reviews: d.total_reviews || d.totalReviews || '—',
    max: d.maxCalificacion || d.max || '—',
    min: d.minCalificacion || d.min || '—',
  }));
  renderTable('rSatisf', data, [
    { key: 'trimestre', label: 'Trimestre / Período', bold: true },
    { key: 'promedio_general', label: 'Calif. promedio', format: 'stars' },
    { key: 'total_reviews', label: 'N° Reviews' },
    { key: 'max', label: 'Máxima' },
    { key: 'min', label: 'Mínima' },
  ]);
  toast('Reporte obtenido', 'success');
}

async function reporteAspectos() {
  const btn = event.target; btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
  const r = await api('GET', '/api/aspectos-mejorables');
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> Ejecutar';
  if (!r.ok) { toast('Error al obtener reporte', 'error'); return; }
  const raw = Array.isArray(r.data) ? r.data : [r.data];
  // Si viene un solo objeto con las métricas de aspectos (limpieza, atencion, etc.)
  // lo convertimos en filas para la tabla
  if (raw.length === 1 && raw[0].limpieza !== undefined) {
    const d = raw[0];
    const filas = Object.entries(d)
      .filter(([k]) => k !== '_id')
      .map(([k, v]) => ({ aspecto: k.charAt(0).toUpperCase() + k.slice(1), promedio: parseFloat(v).toFixed(2) }));
    renderTable('rAspectos', filas, [
      { key: 'aspecto', label: 'Aspecto', bold: true },
      { key: 'promedio', label: 'Promedio (1–5)', format: 'stars' },
    ]);
  } else {
    const data = raw.map(d => ({
      aspecto: d._id || d.aspecto || '—',
      menciones: d.count || d.menciones || '—',
      porcentaje: d.porcentaje || '—',
    }));
    renderTable('rAspectos', data, [
      { key: 'aspecto', label: 'Aspecto', bold: true },
      { key: 'menciones', label: 'Menciones' },
      { key: 'porcentaje', label: '%', format: 'pct' },
    ]);
  }
  toast('Reporte obtenido', 'success');
}

async function reporteIncidencias() {
  const btn = event.target; btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
  const r = await api('GET', '/api/incidencias-analisis');
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> Ejecutar';
  if (!r.ok) { toast('Error al obtener reporte', 'error'); return; }

  // El $facet devuelve [{ porEstado: [...], porPrioridad: [...], recientes: [...] }]
  // Desempacar el array si viene envuelto
  const facet = Array.isArray(r.data) ? r.data[0] : r.data;
  const container = document.getElementById('rIncAn');
  if (facet && typeof facet === 'object' && (facet.porEstado || facet.porPrioridad || facet.porTipo || facet.recientes)) {
    let html = '';
    if (facet.porEstado) {
      const filas = facet.porEstado.map(d => ({ estado: d._id || '—', total: d.total || '—' }));
      html += `<div class="form-label mb-2" style="color:var(--gold)">Por estado</div>`;
      html += buildTableHtml(filas, [{key:'estado',label:'Estado',bold:true},{key:'total',label:'Total'}]);
    }
    if (facet.porPrioridad) {
      const filas = facet.porPrioridad.map(d => ({ prioridad: d._id || '—', total: d.total || '—' }));
      html += `<div class="form-label mb-2 mt-4" style="color:var(--gold)">Por prioridad</div>`;
      html += buildTableHtml(filas, [{key:'prioridad',label:'Prioridad',bold:true},{key:'total',label:'Total'}]);
    }
    if (facet.porTipo) {
      const filas = facet.porTipo.map(d => ({ tipo: d._id || '—', total: d.total || '—' }));
      html += `<div class="form-label mb-2 mt-4" style="color:var(--gold)">Por tipo</div>`;
      html += buildTableHtml(filas, [{key:'tipo',label:'Tipo',bold:true},{key:'total',label:'Total'}]);
    }
    if (facet.recientes) {
      const filas = facet.recientes.map(d => ({
        titulo: d.titulo || '—',
        tipo: d.tipo || '—',
        prioridad: d.prioridad || '—',
        estado: d.estado || '—',
        fecha: d.fechaCreacion ? new Date(d.fechaCreacion).toLocaleDateString('es-GT') : '—',
      }));
      html += `<div class="form-label mb-2 mt-4" style="color:var(--gold)">Incidencias recientes</div>`;
      html += buildTableHtml(filas, [
        {key:'titulo',label:'Título',bold:true},
        {key:'tipo',label:'Tipo'},
        {key:'prioridad',label:'Prioridad'},
        {key:'estado',label:'Estado'},
        {key:'fecha',label:'Fecha'},
      ]);
    }
    container.innerHTML = html || '<div class="empty-state"><i class="fas fa-inbox"></i><p>Sin datos</p></div>';
    toast('Reporte obtenido', 'success');
    return;
  }
  if (!Array.isArray(r.data) && typeof r.data === 'object') {
    let html = '';
    if (r.data.porEstado) {
      const filas = r.data.porEstado.map(d => ({ estado: d._id || '—', total: d.total || '—' }));
      html += `<div class="form-label mb-2" style="color:var(--gold)">Por estado</div>`;
      html += buildTableHtml(filas, [{key:'estado',label:'Estado',bold:true},{key:'total',label:'Total'}]);
    }
    if (r.data.porPrioridad) {
      const filas = r.data.porPrioridad.map(d => ({ prioridad: d._id || '—', total: d.total || '—' }));
      html += `<div class="form-label mb-2 mt-4" style="color:var(--gold)">Por prioridad</div>`;
      html += buildTableHtml(filas, [{key:'prioridad',label:'Prioridad',bold:true},{key:'total',label:'Total'}]);
    }
    if (r.data.porTipo) {
      const filas = r.data.porTipo.map(d => ({ tipo: d._id || '—', total: d.total || '—' }));
      html += `<div class="form-label mb-2 mt-4" style="color:var(--gold)">Por tipo</div>`;
      html += buildTableHtml(filas, [{key:'tipo',label:'Tipo',bold:true},{key:'total',label:'Total'}]);
    }
    // Cualquier otra clave del facet
    Object.entries(r.data).forEach(([key, val]) => {
      if (!['porEstado','porPrioridad','porTipo'].includes(key) && Array.isArray(val) && val.length) {
        const cols = Object.keys(val[0]).map(k => ({key:k, label:k, bold: k==='_id'}));
        html += `<div class="form-label mb-2 mt-4" style="color:var(--gold)">${key}</div>`;
        html += buildTableHtml(val, cols);
      }
    });
    container.innerHTML = html || '<div class="empty-state"><i class="fas fa-inbox"></i><p>Sin datos</p></div>';
  } else {
    const data = Array.isArray(r.data) ? r.data : [r.data];
    renderTable('rIncAn', data, [
      { key: '_id', label: 'Categoría', bold: true },
      { key: 'total', label: 'Total' },
      { key: 'cerradas', label: 'Cerradas' },
    ]);
  }
  toast('Reporte obtenido', 'success');
}

// Helper para construir HTML de tabla sin usar renderTable (que reemplaza innerHTML)
function buildTableHtml(data, columns) {
  if (!data || data.length === 0) return '<p class="text-muted">Sin datos</p>';
  const thead = columns.map(c => `<th>${c.label}</th>`).join('');
  const tbody = data.map(row => {
    const cells = columns.map(c => {
      let val = row[c.key] ?? '—';
      return `<td>${c.bold ? `<strong>${val}</strong>` : val}</td>`;
    }).join('');
    return `<tr>${cells}</tr>`;
  }).join('');
  return `<div class="table-container"><table><thead><tr>${thead}</tr></thead><tbody>${tbody}</tbody></table></div>`;
}

async function reporteHuespFrecuentes() {
  const btn = event.target; btn.disabled = true; btn.innerHTML = '<div class="spinner"></div>';
  const r = await api('GET', '/api/huespedes-frecuentes');
  btn.disabled = false; btn.innerHTML = '<i class="fas fa-play"></i> Ejecutar';
  if (!r.ok) { toast('Error al obtener reporte', 'error'); return; }
  const raw = Array.isArray(r.data) ? r.data : [r.data];

  // Para cada huésped de Mongo, buscar su nombre en PostgreSQL
  const data = await Promise.all(raw.map(async d => {
    const id = d._id || d.huespedId;
    let nombre = '—';
    if (id) {
      const rH = await api('GET', `/api/huespedes/${id}`);
      if (rH.ok) {
        const h = Array.isArray(rH.data) ? rH.data[0] : rH.data;
        if (h) nombre = `${h.nombres || ''} ${h.apellidos || ''}`.trim();
      }
    }
    return {
      nombre,
      id: id || '—',
      total_reviews: d.totalReviews || d.total_reviews || '—',
      promedio: parseFloat(d.promedioCalificacion || d.promediaCalificacion || d.promedio || 0).toFixed(2),
      estadias: d.total_estadias || d.estadias || '—',
      gasto: d.gasto_total || d.gasto || '—',
    };
  }));

  renderTable('rHuespFrec', data, [
    { key: 'nombre', label: 'Huésped', bold: true },
    { key: 'id', label: 'ID' },
    { key: 'total_reviews', label: 'Reviews' },
    { key: 'promedio', label: 'Calif. promedio', format: 'stars' },
    { key: 'estadias', label: 'Estadías' },
    { key: 'gasto', label: 'Gasto total', format: 'money' },
  ]);
  toast('Reporte obtenido', 'success');
}

// ─── INIT ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  navigate('dashboard');
});