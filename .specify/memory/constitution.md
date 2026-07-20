# Constitución: Tres en Raya con Agentes de Juego (SDD)
Versión: 1.0.0 | Proyecto: Tarea 1 SDD (DCC Universidad de Chile)

## P1. Stack Tecnológico
Vite + JavaScript Vanilla + Vitest (o React + TypeScript). Prohibido el uso de frameworks de UI pesados o dependencias adicionales sin justificación explícita.

## P2. Arquitectura Pure Domain
El motor del juego (`engine.js`) y los agentes de IA (`agents.js`) son funciones puras sin ninguna dependencia del DOM o la interfaz gráfica. La capa de interfaz (`ui.js` / React) únicamente consume la API de estos módulos.

## P3. Gate TDD (NO NEGOCIABLE)
Cada Criterio de Aceptación (con ID `CA-*`) debe contar con al menos un test automatizado en verde ANTES de dar por cerrada y aprobada la tarea que lo implementa.

## P4. Gate de Commits Trazables
Se requiere exactamente un commit por tarea en Git. El mensaje del commit debe seguir estrictamente el formato:
`T-NNN: descripción breve (CA-X-NN)`

## P5. Gate de Depuración Spec-First (NO NEGOCIABLE)
Ante cualquier bug o comportamiento incorrecto, la corrección debe realizarse en primer lugar modificando `spec.md`. Posteriormente, se regenera el código afectado. Quedan prohibidas las ediciones manuales directas al código sin documentación expresa en el `README.md`.

## P6. Rendimiento y Latencia
Los agentes de IA en cualquiera de sus tres niveles (Sencillo, Medio, Complejo) deben calcular y retornar su jugada en menos de 1 segundo (1000 ms).