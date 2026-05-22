// Estado de la aplicación
const state = {
    completadas: new Set(),
    seleccionadas: new Set(),
    filtro: 'todas'
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

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', () => {
    renderizarMaterias(materias);
    setupEventListeners();
    actualizarResumen();
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
}

function resetearSeleccion() {
    if (confirm('¿Estás seguro de que deseas limpiar la selección?')) {
        state.seleccionadas.clear();
        state.completadas.clear();
        renderizarMaterias(obtenerMateriasVisibles());
        actualizarResumen();
    }
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
