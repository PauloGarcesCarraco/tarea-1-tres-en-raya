# Tres en Raya (Tic-Tac-Toe) — Arquitectura Modular y SDD

Implementación web completa del clásico juego **Tres en Raya**, desarrollada bajo estricta metodología de **Desarrollo Guiado por Especificaciones (SDD)** y **Desarrollo Guiado por Pruebas (TDD)** como parte de la Tarea 1 del *Diploma de Postítulo en Ingeniería de Software* de la Universidad de Chile.

---

## Demo en Vivo

El proyecto cuenta con integración y despliegue continuo (CI/CD) automatizado mediante **GitHub Actions**. Puedes jugar directamente en el navegador sin instalar nada:

[Jugar Tres en Raya en GitHub Pages](https://paulogarcescarraco.github.io/tarea-1-tres-en-raya/)

---

## Arquitectura del Sistema

El sistema está construido en **Vanilla JavaScript (ES6+)** sobre **Vite**, diseñado para eliminar por completo el acoplamiento entre la lógica de negocio y la capa de presentación. Se estructura en tres módulos aislados con responsabilidades únicas:

| Módulo | Patrón Arquitectónico | Responsabilidad Principal |
| :--- | :--- | :--- |
| **`001 - Motor`** (`engine.js`) | **Pure Domain** (Funciones puras) | Gestión inmutable del estado del tablero, validación de reglas de negocio para modalidades Clásica y Continua, control de turnos y transiciones de fases. |
| **`002 - Agentes`** (`agents.js`) | **Estrategia Algorítmica** | Motor de toma de decisiones para IA en modo PvE, desacoplado del DOM y con optimización algorítmica. |
| **`003 - Interfaz`** (`ui.js`) | **State-Driven UI** | Renderizado reactivo y unidireccional. El DOM actúa exclusivamente como un reflejo visual del estado retornado por el motor. |

---

## Modalidades de Juego e Inteligencia Artificial

### Modalidades de Juego
* **Clásico:** Tradicional grilla 3x3 donde las piezas son fijas. El juego termina con la victoria de una línea o al completarse las 9 celdas (empate).
* **Continuo:** Cada jugador cuenta con un máximo de **3 piezas** en el tablero. A partir del 4º turno, para insertar una nueva pieza, el jugador debe obligatoriamente liberar una de las piezas que ya colocó previamente. Incluye asistencia visual en interfaz (tooltips) para guiar el cambio de fase.

### Niveles de Inteligencia Artificial (Modo PvE)
El módulo de agentes implementa tres niveles de complejidad, evaluados sin bloquear el hilo principal de ejecución:
1. **Sencillo:** Selección estocástica uniformemente distribuida sobre los movimientos válidos.
2. **Medio:** Heurística de un nivel de profundidad orientada a victoria inmediata o bloqueo de amenaza rival de victoria en el siguiente turno.
3. **Complejo (Minimax + Memoización):** Algoritmo óptimo de teoría de juegos. Explora el árbol de juego completo garantizando una estrategia invencible. Incorpora **memoización** (caché de estados evaluados) para reducir la complejidad computacional y mantener una latencia inferior a los **15 ms**.

---

## Tecnologías y Prácticas de Ingeniería

* **Core:** HTML5, CSS Grid (Maquetación blindada con `aspect-ratio: 1/1` y control anti-reflow), Vanilla JavaScript (ESModules).
* **Tooling:** Vite (Empaquetador y servidor de desarrollo ultrarrápido).
* **Testing:** Vitest + JSDOM (Suite de pruebas unitarias y de integración del DOM).
* **CI/CD:** GitHub Actions (Pipeline automatizado para compilación y publicación estática en GitHub Pages).

---

## Verificación y Suite de Pruebas (TDD)

El proyecto cumple con un **100% de cobertura operacional sobre los criterios de aceptación** definidos en la especificación, validado mediante una suite automatizada de **17 pruebas**:

```text
 ✓ tests/engine.test.js (7 tests)
   ✓ valida inmutabilidad y transiciones de estado
   ✓ detecta condiciones de victoria y empate en modo Clásico
   ✓ gestiona correctamente fases y movimientos en modo Continuo
 ✓ tests/agents.test.js (6 tests)
   ✓ valida movimientos legales en IA Sencilla
   ✓ verifica bloqueo inminente en IA Media
   ✓ asegura estrategia óptima (invencible) y latencia < 15ms en IA Compleja
 ✓ tests/ui.test.js (4 tests)
   ✓ verifica renderizado inicial e inyecciones de estado en JSDOM
   ✓ valida interactividad y actualización visual reactiva

 Test Files  3 passed (3)
      Tests  17 passed (17)
```

---

## Instalación y Uso Local

Para ejecutar el entorno de desarrollo y verificar las pruebas localmente:

### 1. Clonar el repositorio
```bash
git clone https://github.com/PauloGarcesCarraco/tarea-1-tres-en-raya.git
cd tarea-1-tres-en-raya
```

### 2. Instalar dependencias
```bash
npm ci
```

### 3. Ejecutar servidor de desarrollo local
```bash
npm run dev
```
> El juego estará disponible en `http://localhost:5173/`

### 4. Ejecutar la suite de pruebas (Vitest)
```bash
npm test
```

### 5. Compilar para producción (Build)
```bash
npm run build
```

---

## Declaración de Integridad Académica y Uso de IA

En cumplimiento con la **Sección 7 (Condiciones - Integridad)** de las orientaciones del curso, el equipo declara el uso de herramientas de Inteligencia Artificial (LLMs / Asistentes de Código) bajo las siguientes condiciones de transparencia y alineación con el flujo **SDD**:

* **Asistencia en Metodología TDD:** Apoyo en la redacción de aserciones y casos de prueba en Vitest/JSDOM a partir de los criterios de aceptación del negocio (Ciclo Rojo/Verde).
* **Configuración de Entorno y CI/CD:** Resolución de errores de empaquetado y apoyo en la redacción del pipeline de automatización de GitHub Actions (`deploy.yml`).
* **Optimización de Estilos CSS:** Asistencia para solucionar anomalías geométricas de maquetación en CSS Grid sin alterar la lógica puramente funcional del módulo de interfaz.

*Nota de Autoría: En estricto cumplimiento con la normativa del curso, todo el código propuesto por IA fue auditado, refactorizado bajo estándares del grupo, verificado mediante ejecución de pruebas y es completamente dominado a nivel conceptual y técnico por los **cuatro integrantes** del equipo, quienes están capacitados para defender cualquier línea o especificación en la presentación.*

---

## Autores / Equipo de Trabajo

Proyecto desarrollado por el Grupo 3 para el Diplomado en Ingeniería de Software (DCC - FCFM, Universidad de Chile):
 * **Claudio Vera
 * **Jorge Araya
 * **Paulo Garcés
 * **Rodrigo Villegas
 * **Sebastian Galvez
 * **Victoria Borquez 
---

*Universidad de Chile — Facultad de Ciencias Físicas y Matemáticas — Departamento de Ciencias de la Computación.*