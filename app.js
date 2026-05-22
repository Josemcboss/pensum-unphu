// Estado de la aplicación
const state = {
    completadas: new Set(),
    seleccionadas: new Set(),
    filtro: 'todas',
    tema: 'default'
};

// Elementos del DOM
const container = document.getElementById('materiasContainer');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalSelectBtn = document.getElementById('modalSelectBtn');
const closeBtn = document.querySelector('.close');
const resetBtn = document.getElementById('resetBtn');
const selectedCount = document.getElementById('selectedCount');
const completedCount = document.getElementById('completedCount');
const showAvailable = document.getElementById('showAvailable');
const showLocked = document.getElementById('showLocked');
const showAll = document.getElementById('showAll');

let materiaActual = null;

// ============ FUNCIONES DE ALMACENAMIENTO LOCAL ============
function guardarProgreso() {
    const datosGuardar = {
        completadas: Array.from(state.completadas),
        seleccionadas: Array.from(state.seleccionadas),
        tema: state.tema,
        ultimaActualizacion: new Date().toISOString()
    };
    localStorage.setItem('pensum-progreso', JSON.stringify(datosGuardar));
}

function cargarProgreso() {
    const datosGuardados = localStorage.getItem('pensum-progreso');
    if (datosGuardados) {
        try {
            const datos = JSON.parse(datosGuardados);
            state.completadas = new Set(datos.completadas || []);
            state.seleccionadas = new Set(datos.seleccionadas || []);
            state.tema = datos.tema || 'default';
            aplicarTema(state.tema);
            return true;
        } catch (e) {
            console.error('Error al cargar progreso:', e);
            return false;
        }
    }
    return false;
}

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    cargarProgreso();
    renderizarMaterias(materias);
    setupEventListeners();
    actualizarResumen();
    crearSelectorTemas();
});

// ============ EVENT LISTENERS ============
function setupEventListeners() {
    searchInput.addEventListener('input', handleSearch);
    modal.addEventListener('click', handleModalClick);
    closeBtn.addEventListener('click', cerrarModal);
    resetBtn.addEventListener('click', resetearSeleccion);
    modalSelectBtn.addEventListener('click', handleSelectMateria);
    showAll.addEventListener('change', handleFiltros);
    showAvailable.addEventListener('change', handleFiltros);
    showLocked.addEventListener('change', handleFiltros);
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) exportBtn.addEventListener('click', exportarPDF);
}

// ============ BÚSQUEDA ============
function handleSearch(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
        renderizarMaterias(materias);
        return;
    }

    const filtered = materias.filter(materia => 
        materia.codigo.toLowerCase().includes(query) ||
        materia.nombre.toLowerCase().includes(query)
    );

    renderizarMaterias(filtered);
}

// ============ FILTROS ============
function handleFiltros() {
    let filtered = materias;

    if (!showAll.checked) {
        filtered = [];
        
        if (showAvailable.checked) {
            filtered.push(...materias.filter(m => puedeHacerMateria(m.id)));
        }
        
        if (showLocked.checked) {
            filtered.push(...materias.filter(m => !puedeHacerMateria(m.id)));
        }
    }

    renderizarMaterias(filtered);
}

// ============ RENDERIZACIÓN ============
function renderizarMaterias(materiasAMostrar) {
    container.innerHTML = '';

    if (materiasAMostrar.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: white;">
                <p style="font-size: 1.3rem; margin-bottom: 10px;">📭 No se encontraron materias</p>
                <p style="opacity: 0.9;">Intenta con otro término de búsqueda</p>
            </div>
        `;
        return;
    }

    materiasAMostrar.forEach(materia => {
        const card = crearTarjetaMateria(materia);
        container.appendChild(card);
    });
}

function crearTarjetaMateria(materia) {
    const div = document.createElement('div');
    const puedeHacer = puedeHacerMateria(materia.id);
    const estaCompleta = state.completadas.has(materia.id);
    const estaSeleccionada = state.seleccionadas.has(materia.id);

    div.className = 'materia-card';
    if (estaCompleta) div.classList.add('completed');
    if (!puedeHacer && !estaCompleta) div.classList.add('locked');
    if (estaSeleccionada) div.classList.add('selected');

    const reqHtml = crearRequisitosHtml(materia);
    const statusHtml = crearStatusHtml(materia, estaCompleta);

    div.innerHTML = `
        <div class="materia-header">
            <span class="materia-codigo">${materia.codigo}</span>
            <span class="materia-badge badge-semestre">Sem. ${materia.semestre}</span>
        </div>
        <h3 class="materia-nombre">${materia.nombre}</h3>
        <p class="materia-descripcion">${materia.descripcion}</p>
        <div style="font-size: 0.9rem; color: var(--gray-600); margin-bottom: 10px;">
            <strong>${materia.creditos}</strong> créditos
        </div>
        ${reqHtml}
        ${statusHtml}
    `;

    div.addEventListener('click', () => abrirModal(materia));

    return div;
}

function crearRequisitosHtml(materia) {
    if (materia.prerequisitos.length === 0) {
        return '';
    }

    const requisitos = materia.prerequisitos.map(id => {
        const prereq = materias.find(m => m.id === id);
        const cumplido = state.completadas.has(id);
        const clase = cumplido ? 'met' : 'unmet';
        const icono = cumplido ? '✓' : '✗';
        return `<span class="requisito-tag ${clase}">${icono} ${prereq.codigo}</span>`;
    }).join('');

    return `
        <div class="materia-requisitos">
            <span class="requisitos-label">Pre-requisitos:</span>
            <div class="requisitos-list">${requisitos}</div>
        </div>
    `;
}

function crearStatusHtml(materia, estaCompleta) {
    const puedeHacer = puedeHacerMateria(materia.id);
    const estaSeleccionada = state.seleccionadas.has(materia.id);

    if (estaCompleta) {
        return '<div class="materia-status status-completed">✓ Ya cursada</div>';
    }

    if (estaSeleccionada) {
        return '<div class="materia-status status-selected">★ Seleccionada</div>';
    }

    if (!puedeHacer) {
        return '<div class="materia-status status-locked">🔒 Requisitos pendientes</div>';
    }

    return '<div class="materia-status status-available">✓ Disponible</div>';
}

// ============ LÓGICA DE REQUISITOS ============
function puedeHacerMateria(id) {
    const materia = materias.find(m => m.id === id);
    
    if (!materia) return false;
    if (state.completadas.has(id)) return true;
    
    // Verificar que todos los pre-requisitos estén completos
    return materia.prerequisitos.every(prereqId => 
        state.completadas.has(prereqId)
    );
}

// ============ MODAL ============
function abrirModal(materia) {
    materiaActual = materia;
    const puedeHacer = puedeHacerMateria(materia.id);
    const estaCompleta = state.completadas.has(materia.id);

    modalTitle.textContent = `${materia.codigo} - ${materia.nombre}`;

    let html = `
        <p><strong>Semestre:</strong> ${materia.semestre}</p>
        <p><strong>Créditos:</strong> ${materia.creditos}</p>
        <p><strong>Descripción:</strong> ${materia.descripcion}</p>
    `;

    if (materia.prerequisitos.length > 0) {
        const prereqsHtml = materia.prerequisitos.map(id => {
            const prereq = materias.find(m => m.id === id);
            const cumplido = state.completadas.has(id);
            const estado = cumplido ? '✓ Completado' : '✗ Pendiente';
            return `<li>${prereq.codigo} - ${prereq.nombre} <span style="color: ${cumplido ? 'green' : 'red'};">${estado}</span></li>`;
        }).join('');
        
        html += `<p><strong>Pre-requisitos:</strong></p><ul>${prereqsHtml}</ul>`;
    }

    modalBody.innerHTML = html;

    // Configurar botón de acción
    if (estaCompleta) {
        modalSelectBtn.textContent = 'Marcar como NO cursada';
        modalSelectBtn.style.backgroundColor = 'var(--danger-color)';
        modalSelectBtn.disabled = false;
    } else if (puedeHacer) {
        modalSelectBtn.textContent = '✓ Marcar como cursada';
        modalSelectBtn.style.backgroundColor = 'var(--success-color)';
        modalSelectBtn.disabled = false;
    } else {
        modalSelectBtn.textContent = 'Requisitos pendientes';
        modalSelectBtn.disabled = true;
        modalSelectBtn.style.backgroundColor = 'var(--gray-400)';
    }

    modal.classList.add('show');
}

function cerrarModal() {
    modal.classList.remove('show');
    materiaActual = null;
}

function handleModalClick(e) {
    if (e.target === modal) {
        cerrarModal();
    }
}

function handleSelectMateria() {
    if (!materiaActual) return;

    const estaCompleta = state.completadas.has(materiaActual.id);

    if (estaCompleta) {
        // Marcar como no cursada
        state.completadas.delete(materiaActual.id);
        state.seleccionadas.delete(materiaActual.id);
    } else {
        // Marcar como cursada directamente
        state.completadas.add(materiaActual.id);
        state.seleccionadas.delete(materiaActual.id);
    }

    cerrarModal();
    renderizarMaterias(obtenerMateriasVisibles());
    actualizarResumen();
}

// ============ UTILIDADES ============
function obtenerMateriasVisibles() {
    let filtered = materias;
    const query = searchInput.value.toLowerCase().trim();

    if (query) {
        filtered = filtered.filter(m =>
            m.codigo.toLowerCase().includes(query) ||
            m.nombre.toLowerCase().includes(query)
        );
    }

    if (!showAll.checked) {
        filtered = [];
        if (showAvailable.checked) {
            filtered.push(...materias.filter(m => puedeHacerMateria(m.id)));
        }
        if (showLocked.checked) {
            filtered.push(...materias.filter(m => !puedeHacerMateria(m.id)));
        }
    }

    return filtered;
}

function actualizarResumen() {
    selectedCount.textContent = state.seleccionadas.size;
    completedCount.textContent = state.completadas.size;
    
    // Calcular créditos
    let creditosCompletados = 0;
    materias.forEach(materia => {
        if (state.completadas.has(materia.id)) {
            creditosCompletados += materia.creditos;
        }
    });
    
    const creditosTotales = 210;
    const creditosRestantes = creditosTotales - creditosCompletados;
    const porcentaje = Math.round((creditosCompletados / creditosTotales) * 100);
    
    // Actualizar elementos
    document.getElementById('creditosCompletados').textContent = creditosCompletados;
    document.getElementById('creditosRestantes').textContent = creditosRestantes;
    document.getElementById('porcentajeProgreso').textContent = `${porcentaje}%`;
    document.getElementById('barraProgreso').style.width = `${porcentaje}%`;
    
    guardarProgreso();
}

function resetearSeleccion() {
    if (confirm('¿Estás seguro de que deseas limpiar la selección?')) {
        state.seleccionadas.clear();
        state.completadas.clear();
        renderizarMaterias(obtenerMateriasVisibles());
        actualizarResumen();
    }
}

// ============ SISTEMA DE TEMAS ============
const temas = {
    default: {
        nombre: 'Predeterminado',
        primary: '#6366f1',
        secondary: '#764ba2'
    },
    dark: {
        nombre: 'Oscuro',
        primary: '#1e293b',
        secondary: '#0f172a'
    },
    green: {
        nombre: 'Verde',
        primary: '#059669',
        secondary: '#047857'
    },
    blue: {
        nombre: 'Azul',
        primary: '#0284c7',
        secondary: '#0369a1'
    }
};

function aplicarTema(nombreTema) {
    const tema = temas[nombreTema] || temas.default;
    const root = document.documentElement;
    
    root.style.setProperty('--primary-color', tema.primary);
    root.style.setProperty('--primary-dark', ajustarBrillo(tema.primary, -20));
    
    if (nombreTema === 'dark') {
        document.body.classList.add('tema-dark');
        document.body.style.background = `linear-gradient(135deg, ${tema.primary} 0%, ${tema.secondary} 100%)`;
    } else {
        document.body.classList.remove('tema-dark');
        document.body.style.background = `linear-gradient(135deg, ${tema.primary} 0%, ${tema.secondary} 100%)`;
    }
    
    state.tema = nombreTema;
    guardarProgreso();
}

function ajustarBrillo(hex, porcentaje) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * porcentaje);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255))
        .toString(16).slice(1);
}

function crearSelectorTemas() {
    const filterSection = document.querySelector('.filter-section');
    const temasHTML = `
        <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid var(--gray-100);">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--gray-800); margin-bottom: 10px;">🎨 Tema</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                ${Object.entries(temas).map(([key, tema]) => `
                    <button class="tema-btn ${state.tema === key ? 'activo' : ''}" 
                            data-tema="${key}"
                            style="padding: 8px; border: 2px solid #ddd; background: white; border-radius: 6px; cursor: pointer; font-size: 0.85rem; font-weight: 500; transition: all 0.3s;">
                        ${tema.nombre}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    
    filterSection.insertAdjacentHTML('afterend', temasHTML);
    
    document.querySelectorAll('.tema-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tema-btn').forEach(b => b.classList.remove('activo'));
            e.target.classList.add('activo');
            aplicarTema(e.target.dataset.tema);
        });
    });
}

// Permitir marcar materias como completadas con doble clic en la tarjeta
document.addEventListener('dblclick', (e) => {
    const card = e.target.closest('.materia-card');
    if (card && !modal.classList.contains('show')) {
        const materiaId = materias.findIndex(m => 
            m.codigo === card.querySelector('.materia-codigo')?.textContent
        );
        
        if (materiaId !== -1) {
            const materia = materias[materiaId];
            const esDisponible = puedeHacerMateria(materia.id);
            
            if (esDisponible && !state.completadas.has(materia.id)) {
                state.completadas.add(materia.id);
                renderizarMaterias(obtenerMateriasVisibles());
                actualizarResumen();
            }
        }
    }
});

// ============ EXPORTAR A PDF ============
function exportarPDF() {
    // Calcular estadísticas
    let creditosCompletados = 0;
    let materiasCompletadas = [];
    let materiasSeleccionadas = [];
    
    materias.forEach(materia => {
        if (state.completadas.has(materia.id)) {
            creditosCompletados += materia.creditos;
            materiasCompletadas.push(materia);
        } else if (state.seleccionadas.has(materia.id)) {
            materiasSeleccionadas.push(materia);
        }
    });
    
    const creditosTotales = 210;
    const creditosRestantes = creditosTotales - creditosCompletados;
    const porcentaje = Math.round((creditosCompletados / creditosTotales) * 100);
    const fechaActual = new Date().toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    // Crear contenido HTML
    let htmlContent = `
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            h1 { color: #6366f1; text-align: center; margin-bottom: 10px; }
            .fecha { text-align: center; color: #666; margin-bottom: 20px; font-size: 12px; }
            .stats { 
                display: grid; 
                grid-template-columns: 1fr 1fr 1fr; 
                gap: 15px; 
                margin-bottom: 30px;
                padding: 20px;
                background: #f3f4f6;
                border-radius: 8px;
            }
            .stat-box {
                text-align: center;
                padding: 15px;
                background: white;
                border-radius: 6px;
                border-left: 4px solid #6366f1;
            }
            .stat-value { font-size: 24px; font-weight: bold; color: #6366f1; }
            .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            h2 { color: #333; margin-top: 25px; margin-bottom: 12px; font-size: 16px; border-bottom: 2px solid #6366f1; padding-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background: #6366f1; color: white; padding: 10px; text-align: left; font-size: 12px; }
            td { padding: 10px; border-bottom: 1px solid #ddd; font-size: 11px; }
            tr:nth-child(even) { background: #f9fafb; }
            .barra-progreso {
                width: 100%;
                height: 20px;
                background: #e5e7eb;
                border-radius: 10px;
                overflow: hidden;
                margin-top: 8px;
            }
            .barra-relleno {
                height: 100%;
                background: #6366f1;
                width: ${porcentaje}%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                font-weight: bold;
            }
            .pie { 
                margin-top: 40px; 
                text-align: center; 
                font-size: 10px; 
                color: #999; 
                border-top: 1px solid #ddd; 
                padding-top: 10px;
            }
        </style>

        <h1>📚 Plan de Estudios - Ingeniería en Sistemas Computacionales</h1>
        <p class="fecha">Generado: ${fechaActual}</p>

        <div class="stats">
            <div class="stat-box">
                <div class="stat-value">${creditosCompletados}</div>
                <div class="stat-label">Créditos Completados</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${creditosRestantes}</div>
                <div class="stat-label">Créditos Restantes</div>
            </div>
            <div class="stat-box">
                <div class="stat-value">${porcentaje}%</div>
                <div class="stat-label">Progreso Total</div>
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <strong>Progreso del Programa:</strong>
            <div class="barra-progreso">
                <div class="barra-relleno">${porcentaje}%</div>
            </div>
        </div>
    `;
    
    // Materias completadas
    if (materiasCompletadas.length > 0) {
        htmlContent += `<h2>✓ Materias Cursadas (${materiasCompletadas.length})</h2>`;
        htmlContent += `<table><tr><th>Código</th><th>Materia</th><th>Semestre</th><th>Créditos</th></tr>`;
        materiasCompletadas.forEach(m => {
            htmlContent += `<tr><td>${m.codigo}</td><td>${m.nombre}</td><td>${m.semestre}</td><td>${m.creditos}</td></tr>`;
        });
        htmlContent += `</table>`;
    }
    
    // Materias seleccionadas
    if (materiasSeleccionadas.length > 0) {
        htmlContent += `<h2>★ Materias Seleccionadas (${materiasSeleccionadas.length})</h2>`;
        htmlContent += `<table><tr><th>Código</th><th>Materia</th><th>Semestre</th><th>Créditos</th></tr>`;
        materiasSeleccionadas.forEach(m => {
            htmlContent += `<tr><td>${m.codigo}</td><td>${m.nombre}</td><td>${m.semestre}</td><td>${m.creditos}</td></tr>`;
        });
        htmlContent += `</table>`;
    }
    
    htmlContent += `<div class="pie">Selector de Materias UNPHU - ${new Date().getFullYear()}</div>`;
    
    // Generar PDF
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    const opt = {
        margin: 10,
        filename: `pensum-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(element).save();
    alert('✓ PDF exportado exitosamente');
}
