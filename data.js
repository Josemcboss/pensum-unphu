// Pensum de Ingeniería en Sistemas Computacionales - UNPHU
// Datos completos con todos los períodos y materias

const materias = [
    // PERÍODO 1
    { id: 1, codigo: "MAT-160", nombre: "ÁLGEBRA SUPERIOR", semestre: 1, creditos: 5, prerequisitos: [], descripcion: "Fundamentos de álgebra y teoría de números" },
    { id: 2, codigo: "ELT-001", nombre: "Electiva I (Artes y Deportes)", semestre: 1, creditos: 1, prerequisitos: [], descripcion: "Actividades de artes o deportes" },
    { id: 3, codigo: "INF-158", nombre: "INTRODUCCIÓN A LA INFORMÁTICA", semestre: 1, creditos: 5, prerequisitos: [], descripcion: "Conceptos fundamentales de informática" },
    { id: 4, codigo: "LET-101", nombre: "LENGUA ESPAÑOLA Y TÉCNICA DE LA EXPRESIÓN I", semestre: 1, creditos: 3, prerequisitos: [], descripcion: "Expresión oral y escrita" },
    { id: 5, codigo: "ORI-100", nombre: "ORIENTACIÓN UNIVERSITARIA", semestre: 1, creditos: 1, prerequisitos: [], descripcion: "Introducción a la vida universitaria" },
    { id: 6, codigo: "EDU-107", nombre: "TÉCNICAS DEL ESTUDIOS E INVESTIGACIÓN", semestre: 1, creditos: 3, prerequisitos: [], descripcion: "Técnicas de estudio y métodos de investigación" },
    
    // PERÍODO 2
    { id: 7, codigo: "MAT-170", nombre: "CÁLCULO DIFERENCIAL E INTEGRAL I", semestre: 2, creditos: 3, prerequisitos: [1], descripcion: "Cálculo de una variable" },
    { id: 8, codigo: "FIS-211", nombre: "FÍSICA GENERAL I", semestre: 2, creditos: 3, prerequisitos: [1], descripcion: "Mecánica clásica" },
    { id: 9, codigo: "INF-160", nombre: "FUNDAMENTOS DE INGENIERIA DE SISTEMAS", semestre: 2, creditos: 3, prerequisitos: [6, 3], descripcion: "Principios de ingeniería de sistemas" },
    { id: 10, codigo: "LEX-110", nombre: "INGLES BASICO", semestre: 2, creditos: 3, prerequisitos: [], descripcion: "Inglés básico" },
    { id: 11, codigo: "LET-102", nombre: "LENGUA ESPAÑOLA Y TÉCNICA DE LA EXPRESIÓN II", semestre: 2, creditos: 3, prerequisitos: [4], descripcion: "Expresión avanzada" },
    { id: 12, codigo: "QUI-111", nombre: "QUÍMICA GENERAL I", semestre: 2, creditos: 3, prerequisitos: [], descripcion: "Conceptos fundamentales de química" },
    { id: 13, codigo: "FIS-221", nombre: "LABORATORIO DE FÍSICA GENERAL I", semestre: 2, creditos: 1, prerequisitos: [8], descripcion: "Laboratorio de física general" },
    { id: 14, codigo: "MAT-362", nombre: "MATEMÁTICA DISCRETA I", semestre: 2, creditos: 4, prerequisitos: [1], descripcion: "Lógica y teoría de conjuntos" },
    
    // PERÍODO 3
    { id: 15, codigo: "MAT-271", nombre: "CÁLCULO DIFERENCIAL E INTEGRAL II", semestre: 3, creditos: 3, prerequisitos: [7], descripcion: "Cálculo multivariable" },
    { id: 16, codigo: "FIS-212", nombre: "FÍSICA GENERAL II", semestre: 3, creditos: 3, prerequisitos: [8], descripcion: "Electromagnetismo y ondas" },
    { id: 17, codigo: "HUM-150", nombre: "HISTORIA DE LA CULTURA UNIVERSAL", semestre: 3, creditos: 3, prerequisitos: [], descripcion: "Historia y cultura mundial" },
    { id: 18, codigo: "LEX-125", nombre: "INGLÉS TÉCNICO I", semestre: 3, creditos: 3, prerequisitos: [10], descripcion: "Inglés técnico" },
    { id: 19, codigo: "INF-161", nombre: "INTRODUCCION A LA PROGRAMACION", semestre: 3, creditos: 4, prerequisitos: [9], descripcion: "Fundamentos de programación" },
    { id: 20, codigo: "FIS-222", nombre: "LABORATORIO DE FÍSICA GENERAL II", semestre: 3, creditos: 1, prerequisitos: [16, 13], descripcion: "Laboratorio de física II" },
    { id: 21, codigo: "MAT-363", nombre: "MATEMATICA DISCRETA II", semestre: 3, creditos: 4, prerequisitos: [14], descripcion: "Teoría de grafos y álgebra booleana" },
    
    // PERÍODO 4
    { id: 22, codigo: "INF-241", nombre: "ALGORITMOS Y ESTRUCTURAS DE DATOS", semestre: 4, creditos: 4, prerequisitos: [19, 21], descripcion: "Diseño de algoritmos y estructuras de datos" },
    { id: 23, codigo: "INF-271", nombre: "ARQUITECTURA DE COMPUTADORES I", semestre: 4, creditos: 3, prerequisitos: [19], descripcion: "Arquitectura de procesadores" },
    { id: 24, codigo: "MAT-371", nombre: "ECUACIONES DIFERENCIALES", semestre: 4, creditos: 3, prerequisitos: [15], descripcion: "Solución de ecuaciones diferenciales" },
    { id: 25, codigo: "ING-110", nombre: "GEOMETRÍA DESCRIPTIVA", semestre: 4, creditos: 3, prerequisitos: [], descripcion: "Geometría aplicada" },
    { id: 26, codigo: "LEX-126", nombre: "INGLÉS TÉCNICO II", semestre: 4, creditos: 3, prerequisitos: [18], descripcion: "Inglés técnico avanzado" },
    { id: 27, codigo: "FIS-223", nombre: "LABORATORIO DE FÍSICA GENERAL III", semestre: 4, creditos: 1, prerequisitos: [16, 20], descripcion: "Laboratorio de física III" },
    { id: 28, codigo: "FIS-213", nombre: "FÍSICA GENERAL III", semestre: 4, creditos: 3, prerequisitos: [16], descripcion: "Óptica y física moderna" },
    
    // PERÍODO 5
    { id: 29, codigo: "INF-273", nombre: "ARQUITECTURA DE COMPUTADORES II", semestre: 5, creditos: 3, prerequisitos: [23], descripcion: "Arquitectura avanzada de computadores" },
    { id: 30, codigo: "MAT-330", nombre: "ESTADÍSTICA PARA INGENIEROS", semestre: 5, creditos: 3, prerequisitos: [7], descripcion: "Probabilidad y estadística" },
    { id: 31, codigo: "INF-272", nombre: "INGENIERIA DE SOFTWARE I", semestre: 5, creditos: 3, prerequisitos: [19], descripcion: "Principios de ingeniería de software" },
    { id: 32, codigo: "MAT-420", nombre: "MÉTODOS NUMÉRICOS Y PROGRAMACIÓN", semestre: 5, creditos: 3, prerequisitos: [15], descripcion: "Métodos numéricos aplicados" },
    { id: 33, codigo: "INF-274", nombre: "PROGRAMACION WEB I", semestre: 5, creditos: 4, prerequisitos: [22], descripcion: "Desarrollo web básico" },
    
    // PERÍODO 6
    { id: 34, codigo: "MAT-260", nombre: "ÁLGEBRA LINEAL", semestre: 6, creditos: 3, prerequisitos: [1], descripcion: "Matrices y transformaciones lineales" },
    { id: 35, codigo: "MAT-339", nombre: "INFERENCIA ESTADISTICA", semestre: 6, creditos: 3, prerequisitos: [30], descripcion: "Estadística inferencial" },
    { id: 36, codigo: "INF-275", nombre: "INGENIERIA DE SOFTWARE II", semestre: 6, creditos: 3, prerequisitos: [31], descripcion: "Diseño e implementación de software" },
    { id: 37, codigo: "INF-276", nombre: "PROGRAMACION DE APLICACIONES MOVILES", semestre: 6, creditos: 4, prerequisitos: [33], descripcion: "Desarrollo de aplicaciones móviles" },
    { id: 38, codigo: "INF-278", nombre: "SISTEMAS CIBERFISICOS I", semestre: 6, creditos: 3, prerequisitos: [31, 29], descripcion: "Introducción a sistemas ciberfísicos" },
    { id: 39, codigo: "INF-277", nombre: "SISTEMAS DE BASE DE DATOS I", semestre: 6, creditos: 3, prerequisitos: [31], descripcion: "Diseño de bases de datos" },
    
    // PERÍODO 7
    { id: 40, codigo: "INF-374", nombre: "CIBERSEGURIDAD EN SOFTWARE", semestre: 7, creditos: 3, prerequisitos: [29, 36, 32], descripcion: "Seguridad en sistemas de software" },
    { id: 41, codigo: "INF-373", nombre: "ELECTRONICA DE SISTEMAS CIBERFISICOS", semestre: 7, creditos: 3, prerequisitos: [27, 38, 24, 12], descripcion: "Electrónica para sistemas ciberfísicos" },
    { id: 42, codigo: "INF-370", nombre: "INGENIERIA DE SOFTWARE III", semestre: 7, creditos: 3, prerequisitos: [36], descripcion: "Ingeniería de software avanzada" },
    { id: 43, codigo: "INF-270", nombre: "PROGRAMACION CON MATRICES", semestre: 7, creditos: 4, prerequisitos: [3, 34], descripcion: "Programación con estructuras matriciales" },
    { id: 44, codigo: "INF-386", nombre: "PROYECTO INTEGRADOR EN SOFTWARE Y BASES DE DATOS", semestre: 7, creditos: 3, prerequisitos: [36, 37, 39], descripcion: "Proyecto integrador I" },
    { id: 45, codigo: "INF-372", nombre: "REDES DE COMPUTADORAS I", semestre: 7, creditos: 3, prerequisitos: [9], descripcion: "Fundamentos de redes" },
    { id: 46, codigo: "INF-371", nombre: "SISTEMAS DE BASES DE DATOS II", semestre: 7, creditos: 3, prerequisitos: [39], descripcion: "Administración de bases de datos" },
    
    // PERÍODO 8
    { id: 47, codigo: "INF-379", nombre: "INTRODUCCION A LA CIENCIA DE DATOS", semestre: 8, creditos: 3, prerequisitos: [43, 39, 35], descripcion: "Fundamentos de ciencia de datos" },
    { id: 48, codigo: "ECO-100", nombre: "INTRODUCCIÓN A LA ECONOMÍA", semestre: 8, creditos: 3, prerequisitos: [1], descripcion: "Principios económicos" },
    { id: 49, codigo: "ADM-105", nombre: "PRINCIPIOS DE ADMINISTRACION", semestre: 8, creditos: 3, prerequisitos: [], descripcion: "Fundamentos de administración" },
    { id: 50, codigo: "INF-375", nombre: "PRINCIPIOS DE SISTEMAS OPERATIVOS", semestre: 8, creditos: 3, prerequisitos: [29], descripcion: "Sistemas operativos" },
    { id: 51, codigo: "INF-377", nombre: "REDES DE COMPUTADORAS II", semestre: 8, creditos: 3, prerequisitos: [45], descripcion: "Redes avanzadas" },
    { id: 52, codigo: "INF-378", nombre: "SISTEMAS CIBERFISICOS II", semestre: 8, creditos: 3, prerequisitos: [45, 41], descripcion: "Sistemas ciberfísicos avanzados" },
    
    // PERÍODO 9
    { id: 53, codigo: "INF-380", nombre: "ADMINISTRACION DE PROYECTOS", semestre: 9, creditos: 3, prerequisitos: [49], descripcion: "Gestión de proyectos de software" },
    { id: 54, codigo: "INF-384", nombre: "AUDITORIA DE SISTEMAS COMPUTACIONALES", semestre: 9, creditos: 3, prerequisitos: [49, 42, 40], descripcion: "Auditoría de sistemas" },
    { id: 55, codigo: "ELT-002", nombre: "Electiva II", semestre: 9, creditos: 3, prerequisitos: [37, 46, 47], descripcion: "Electiva II" },
    { id: 56, codigo: "ING-540", nombre: "INTRODUCCIÓN A LA INGENIERÍA ECONÓMICA", semestre: 9, creditos: 3, prerequisitos: [48], descripcion: "Ingeniería económica" },
    { id: 57, codigo: "INF-383", nombre: "MACHINE LEARNING", semestre: 9, creditos: 3, prerequisitos: [46, 47], descripcion: "Aprendizaje automático" },
    { id: 58, codigo: "INF-381", nombre: "SISTEMAS CIBERFISICOS III", semestre: 9, creditos: 3, prerequisitos: [43, 51, 52], descripcion: "Sistemas ciberfísicos III" },
    
    // PERÍODO 10
    { id: 59, codigo: "INF-434", nombre: "BIG DATA CON PROCESAMIENTO DISTRIBUIDO", semestre: 10, creditos: 3, prerequisitos: [50, 47], descripcion: "Big Data y procesamiento distribuido" },
    { id: 60, codigo: "ELT-003", nombre: "Electiva III", semestre: 10, creditos: 3, prerequisitos: [46, 50, 52, 47], descripcion: "Electiva III" },
    { id: 61, codigo: "INF-432", nombre: "INNOVACION Y EMPRENDIEMIENTO EN INGENIERIA", semestre: 10, creditos: 3, prerequisitos: [56], descripcion: "Innovación y emprendimiento" },
    { id: 62, codigo: "INF-431", nombre: "MINERIA DE DATOS", semestre: 10, creditos: 3, prerequisitos: [57], descripcion: "Minería de datos" },
    { id: 63, codigo: "INF-435", nombre: "PROYECTO INTEGRADOR EN SISTEMAS CIBERFISICOS", semestre: 10, creditos: 3, prerequisitos: [53, 58], descripcion: "Proyecto integrador II" },
    
    // PERÍODO 11
    { id: 64, codigo: "ELT-004", nombre: "Electiva IV", semestre: 11, creditos: 3, prerequisitos: [37, 40, 58, 57], descripcion: "Electiva IV" },
    { id: 65, codigo: "INI-510", nombre: "ÉTICA PROFESIONAL", semestre: 11, creditos: 3, prerequisitos: [], descripcion: "Ética profesional y responsabilidad social" },
    { id: 66, codigo: "INF-440", nombre: "MODELADO Y SIMULACION DE SISTEMAS CIBERFISICOS", semestre: 11, creditos: 3, prerequisitos: [63], descripcion: "Modelado y simulación" },
    { id: 67, codigo: "INF-438", nombre: "PROYECTO INTEGRADOR EN CIENCIAS E INGENIERIA DE DATOS", semestre: 11, creditos: 3, prerequisitos: [53, 57, 62, 59], descripcion: "Proyecto integrador III" },
    { id: 68, codigo: "INF-437", nombre: "SEMINARIO DE INVESTIGACION PARA TRABAJO DE GRADO", semestre: 11, creditos: 3, prerequisitos: [53, 61], descripcion: "Seminario de investigación" },
    
    // PERÍODO 12
    { id: 69, codigo: "INF-905", nombre: "PASANTIA FINAL", semestre: 12, creditos: 8, prerequisitos: [44, 61, 63, 67, 65], descripcion: "Pasantía profesional final" },
    
    // PERÍODO 13
    { id: 70, codigo: "INF-901", nombre: "TRABAJO DE GRADO (ING. DE SISTEMAS)", semestre: 13, creditos: 6, prerequisitos: [68], descripcion: "Trabajo de grado" }
];
