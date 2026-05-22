# Selector de Materias - Pensum Universitario

Aplicación responsiva para seleccionar materias universitarias, visualizar requisitos previos y gestionar el progreso académico.

## 🎯 Características

- **Visualización de Materias**: Ver todas las materias del pensum con código, nombre y descripción
- **Pre-requisitos**: Mostrar claramente qué materias son requisito previo de otras
- **Validación Inteligente**: Solo permite seleccionar materias cuando se cumplen los requisitos
- **Búsqueda Rápida**: Filtrar por código o nombre de materia
- **Seguimiento de Progreso**: Marcar materias como completadas
- **Diseño Responsivo**: Funciona perfectamente en escritorio, tablet y móvil
- **Interfaz Amigable**: Tarjetas visuales con código de colores

## 📁 Estructura de Archivos

```
├── index.html      # Estructura HTML principal
├── styles.css      # Estilos y diseño responsivo
├── app.js          # Lógica de la aplicación
├── data.js         # Base de datos de materias (editable)
└── README.md       # Este archivo
```

## 🚀 Inicio Rápido

1. **Abrir la aplicación**: 
   - Simplemente abre `index.html` en tu navegador web

2. **Personalizar las materias**:
   - Edita el archivo `data.js` con tus materias reales
   - Cada materia necesita:
     - `id`: Número único
     - `codigo`: Código de la materia (ej: CSC101)
     - `nombre`: Nombre completo
     - `semestre`: Número del semestre
     - `creditos`: Cantidad de créditos
     - `prerequisitos`: Array con IDs de materias previas
     - `descripcion`: Breve descripción

## 📋 Ejemplo de Dato

```javascript
{
    id: 1,
    codigo: "CSC101",
    nombre: "Programación I",
    semestre: 1,
    creditos: 3,
    prerequisitos: [],
    descripcion: "Introducción a la programación"
}
```

## 🎨 Cómo Usar

### Búsqueda
- Escribe en la barra de búsqueda para filtrar por código o nombre

### Filtros
- **Mostrar todas**: Ver todas las materias
- **Disponibles**: Solo las que cumples requisitos
- **Con pre-requisitos**: Las que necesitan materias previas

### Seleccionar Materias
1. Click en una tarjeta para abrir los detalles
2. Click en "Seleccionar para cursar"
3. Alternativamente, doble click en la tarjeta para marcar como completada

### Seguimiento
- **Resumen** en la barra lateral muestra tu progreso
- Las tarjetas verdes indican materias completadas
- Las tarjetas amarillas tienen requisitos pendientes

## 🔄 Integración de tu Pensum

Para usar tu pensum real:

1. Abre `data.js`
2. Reemplaza el array `materias` con tus datos
3. Asegúrate de que cada materia tenga los IDs correctos
4. Los `prerequisitos` deben ser un array con los IDs de materias previas

## 🎯 Características Avanzadas

- **Validación de Requisitos**: Automáticamente verifica si cumples los pre-requisitos
- **Actualización en Tiempo Real**: Los cambios se reflejan inmediatamente
- **Código de Colores**:
  - 🟦 Azul: Disponible para cursar
  - 🟩 Verde: Ya cursada
  - 🟨 Amarillo: Requisitos pendientes

## 💡 Consejos

- Usa códigos standardizados para las materias
- Organiza las materias por semestre en `data.js`
- Los pre-requisitos se validan automáticamente
- Puedes resetear toda la selección con el botón "Limpiar Selección"

## 📱 Responsividad

La aplicación es completamente responsiva:
- **Desktop**: Grid de 4 columnas
- **Tablet**: Grid de 2-3 columnas
- **Móvil**: Una sola columna

## 🔧 Personalización de Colores

Edita las variables en `styles.css` (línea 1):

```css
:root {
    --primary-color: #6366f1;      /* Color principal */
    --success-color: #10b981;      /* Color de éxito */
    --warning-color: #f59e0b;      /* Color de alerta */
    --danger-color: #ef4444;       /* Color de peligro */
}
```

## ✨ Mejoras Futuras

- Exportar plan de estudios a PDF
- Sincronizar con base de datos
- Guardar progreso en localStorage
- Cálculo de promedio de créditos
- Reporte de progreso académico

---

**¡Espero que esta aplicación te sea útil! 📚**
