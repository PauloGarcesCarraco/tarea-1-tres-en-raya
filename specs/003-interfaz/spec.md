# Spec 003: Interfaz de Usuario (UI)

## Resumen
Especificación funcional de la interfaz gráfica web para la aplicación Tres en Raya. Define la máquina de estados visual, los controles de configuración, la retroalimentación de turnos, el marcador de sesión y la accesibilidad.

---

## User Stories

### US-I-01: Configuración de Partida
**Como** usuario, **quiero** seleccionar el modo de juego, la dificultad del agente y la modalidad antes de empezar, **para** personalizar la experiencia de juego.

### US-I-02: Interacción y Estados del Tablero
**Como** jugador, **quiero** ver con claridad el turno activo, las fichas movibles y la línea ganadora, **para** entender el estado exacto de la partida en todo momento.

### US-I-03: Marcador y Control de Sesión
**Como** usuario, **quiero** contar con un marcador acumulado y la opción de reiniciar la partida, **para** jugar múltiples partidas continuas durante una misma sesión.

---

## Criterios de Aceptación (Notación EARS)

### Configuración e Inicialización
* **CA-I-01 (Pantalla de Configuración):** `WHILE` la aplicación esté en estado `CONFIGURACION`, `EL SISTEMA SHALL` permitir al usuario elegir el modo (Humano vs. Humano / Humano vs. Agente), la dificultad del agente (Sencillo, Medio, Complejo), la ficha inicial y la modalidad (Clásica o Continua).
* **CA-I-02 (Indicador de Turno):** `EL SISTEMA SHALL` mostrar de forma permanente e inequívoca el jugador con el turno activo ('X' u 'O') y su tipo (Humano o Agente).

### Interacción y Retroalimentación Visual
* **CA-I-03 (Manejo de Jugadas Ilegales):** `IF` el jugador intenta realizar una jugada ilegal (hacer clic en una casilla ocupada o fuera de su turno), `THEN EL SISTEMA SHALL` rechazar la acción mostrando un mensaje o alerta visual sin alterar el estado visual del tablero.
* **CA-I-04 (Estado de Espera del Agente):** `WHILE` el agente de IA esté calculando su jugada, `EL SISTEMA SHALL` mostrar un indicador visual de espera ("pensando...") y deshabilitar temporalmente la interacción con el tablero.
* **CA-I-05 (Destaque de Línea Ganadora):** `WHEN` un jugador complete tres fichas en línea, `EL SISTEMA SHALL` resaltar visualmente la línea victoriosa (fila, columna o diagonal) y bloquear cualquier interacción posterior con el tablero.
* **CA-I-06 (Guía Visual en Modalidad Continua):** `WHILE` la modalidad sea Continua y se encuentre en 'fase de movimiento', `EL SISTEMA SHALL` señalar visualmente cuáles fichas del jugador activo se pueden seleccionar y a qué casillas vacías pueden moverse.

### Marcador y Reinicio
* **CA-I-07 (Marcador Acumulado):** `WHEN` finalice una partida (por victoria o empate), `EL SISTEMA SHALL` actualizar de inmediato el marcador acumulado de la sesión (victorias de X, victorias de O y empates).
* **CA-I-08 (Acción de Reinicio):** `WHEN` el usuario accione el botón "Reiniciar", `EL SISTEMA SHALL` limpiar el tablero de juego y reiniciar la partida conservando la configuración seleccionada y el marcador de la sesión.

### Accesibilidad y Responsividad
* **CA-I-09 (Operación por Teclado):** `EL SISTEMA SHALL` permitir la navegación focalleable y la selección de casillas mediante teclado (flechas / Tab y Enter / Espacio).
* **CA-I-10 (Diseño Responsivo):** `EL SISTEMA SHALL` adaptar el tablero y los paneles de control a pantallas móviles y de escritorio sin generar scroll horizontal.

---

## Fuera of Alcance (Out of Scope)
* Temas dinámicos personalizables (modo oscuro/claro configurable).
* Efectos de sonido o audio 3D.
