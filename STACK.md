# Stack Tecnológico y Skills del Proyecto

Este documento detalla las tecnologías seleccionadas y las habilidades (skills) instaladas en el agente para el desarrollo del asistente de proyectos con Gemini y Git.

## 1. Stack Tecnológico

Hemos optado por una arquitectura de **Cliente-Servidor (Decoupled)** para maximizar la compatibilidad con React y facilitar el manejo de Webhooks y APIs.

### Frontend
- **Framework:** [React](https://react.dev/) con [Vite](https://vitejs.dev/) (Rápido, moderno y ligero).
- **Lenguaje:** TypeScript (Tipado fuerte para evitar errores en la integración con APIs).
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) (Diseño rápido y responsivo).
- **Visualización:** [Mermaid.js](https://mermaid.js.org/) (Para diagramas de arquitectura dinámicos).

### Backend
- **Entorno:** Node.js.
- **Framework:** [Express](https://expressjs.com/) (Estándar para APIs y manejo de Webhooks).
- **IA:** [Google Gemini API](https://ai.google.dev/) (Motor de análisis y generación).
- **Integración Git:** [Octokit](https://github.com/octokit/core.js) (SDK oficial de la API de GitHub).

### Persistencia y Servicios
- **Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL con capacidades de tiempo real).
- **Notificaciones:** [Telegram Bot API](https://core.telegram.org/bots/api).

---

## 2. Skills Instaladas

Estas habilidades han sido añadidas al Gemini CLI para proporcionar guías expertas y mejores prácticas durante la codificación.

| Skill | Fuente | Propósito |
| :--- | :--- | :--- |
| `gemini-interactions-api` | `google-gemini/gemini-skills` | Optimización de prompts y manejo estructurado de la API de Gemini. |
| `supabase-postgres-best-practices` | `supabase/agent-skills` | Diseño de esquemas y consultas eficientes en PostgreSQL. |
| `react-vite-best-practices` | `asyrafhussin/agent-skills` | Patrones de arquitectura y rendimiento en React + Vite. |
| `mermaid-diagrams` | `hoodini/ai-agents-skills` | Generación y renderizado de diagramas de arquitectura. |
| `telegram` | `sickn33/antigravity-awesome-skills` | Configuración y manejo de bots de Telegram. |

---

## 3. Comandos de Referencia

### Para el Agente (Uso de Skills)
El agente utilizará estas habilidades automáticamente cuando se realicen tareas relacionadas (ej. "Crea un componente de React" activará las mejores prácticas de Vite).

### Estructura de Carpetas Sugerida
```text
/
├── client/           # Código de React (Vite)
├── server/           # Código de Node.js (Express)
├── PROPOSAL.md       # Idea del proyecto
└── STACK.md          # Este archivo
```
