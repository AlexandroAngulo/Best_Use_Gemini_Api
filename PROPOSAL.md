# Propuesta de Proyecto: Asistente de Desarrollo con Gemini y Git

## 1. Descripción General
Desarrollar una aplicación web diseñada para guiar a los desarrolladores en la fase inicial y de ejecución de un proyecto. La herramienta ayuda a definir el stack tecnológico, establecer flujos de trabajo de Git y monitorear el progreso del código para ofrecer recomendaciones en tiempo real.

## 2. Flujo de Usuario

### Fase 1: Análisis y Definición (Gemini AI)
- **Entrada:** El usuario describe su idea a través de un formulario o una serie de preguntas clave.
- **Procesamiento:** Gemini analiza la propuesta utilizando *System Instructions* específicas para garantizar una salida estructurada.
- **Salida (JSON):** 
  - Listado de **Skills** necesarias.
  - **Stack Tecnológico** recomendado (lenguajes, frameworks, bases de datos).
- **Interacción:** El usuario selecciona y confirma el stack y las habilidades con las que desea trabajar.

### Fase 2: Configuración del Entorno (GitHub API)
- **Vinculación:** El usuario proporciona el enlace de su repositorio de GitHub.
- **Estructuración:** La aplicación utiliza la API de GitHub para:
  - Definir el flujo de trabajo (GitHub Flow, Git Flow, etc.).
  - Configurar reglas de protección de ramas.
  - Crear la estructura básica de ramas si es necesario.
- **Automatización Local:** Generación de un script dinámico (`.sh` para Linux/macOS o `.bat` para Windows) que el usuario copia y ejecuta para configurar su entorno local (clonación, creación de ramas, configuración de remotos).

### Fase 3: Monitoreo y Asistencia Continua
- **Integración:** Configuración de **Webhooks** en el repositorio de GitHub.
- **Acción:** Cada vez que el servidor recibe un evento de `push`:
  1. Lee el contenido de los archivos nuevos o modificados mediante la API.
  2. Gemini analiza el código (ej. modelos JPA, arquitectura, lógica de negocio).
  3. Si hay áreas de mejora, Gemini genera sugerencias y recursos educativos.
- **Notificación:** Los consejos se envían directamente al usuario a través de un **Bot de Telegram** o una aplicación móvil complementaria.

## 3. Arquitectura Técnica (Viabilidad)

- **Frontend:** Aplicación Web (React/Angular/Vue).
- **Backend:** Servidor (Node.js/Python) encargado de la orquestación.
- **IA:** API de Gemini para análisis de texto y código.
- **Integración Git:** GitHub API para gestión de repositorios y Webhooks para eventos en tiempo real.
- **Notificaciones:** API de Telegram Bot.

## 4. Objetivos Principales
- Reducir la fricción al iniciar un nuevo proyecto.
- Estandarizar las mejores prácticas de Git desde el día uno.
- Proporcionar mentoría técnica automatizada basada en el código real del usuario.
