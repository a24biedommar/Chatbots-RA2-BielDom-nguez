# 2. Funcionalidades y Casos de Uso

## Descripción Funcional

TravelBuddy PWA se fundamenta en un conjunto de capacidades técnicas que permiten la interacción fluida entre el usuario y el asistente de IA para la planificación de rutas de viaje. A continuación se detallan las funcionalidades más relevantes del sistema, describiendo para cada una su lógica técnica de implementación.

### 1. Chat conversacional con integración de Gemini AI

El módulo de chat constituye la interfaz principal de comunicación entre el usuario y el sistema de IA. La gestión del estado conversacional se implementa mediante **Pinia** (`useChatStore`), donde se mantiene un array reactivo de mensajes que incluye tanto las intervenciones del usuario como las respuestas del asistente. La lógica técnica subyacente emplea el patrón de **composable** (`useLocation.js`) para obtener la posición geográfica actual del usuario antes de enviar la consulta al modelo, inyectando contexto geográfico en el prompt. La validación de entrada se realiza mediante sanitización de texto antes del envío al endpoint `/api/chat`, utilizando una capa de protección que evita la inyección de caracteres maliciosos en la conversación.

### 2. Generación inteligente de rutas con parseo de datos estructurados

La respuesta del modelo Gemini se recibir como JSON estructurado que el sistema procesa para construir objetos `TravelRoute`. La validación de tipos se implementa en `/app/types/index.ts`, donde se definen interfaces TypeScript que aseguran la estructura obligatoria de cada ruta: origen (`origen`), destino (`destino`), lista de waypoints (`waypoints`) con coordenadas geográficas (`lat`, `lng`), tiempo estimado (`tempsEstimat`) y distancia en metros (`distanciaMetres`). El sistema emplea un **parser robusto** que tolera variaciones en el formato de respuesta de la IA, aplicando valores por defecto cuando campos opcionales faltan y generando excepciones controladas cuando la respuesta no cumple el esquema mínimo viable.

### 3. Visualización cartográfica interactiva con Leaflet

La capa de mapas se implementa mediante el componente `useModalMap.js`, que inicializa una instancia de Leaflet con tiles de OpenStreetMap. El renderizado de la ruta se realiza mediante la creación de una **polilínea** (`L.polyline`) que conecta secuencialmente el origen, los waypoints y el destino, estilizada con color esmeralda para mantener coherencia con la identidad visual de la aplicación. Los marcadores de posición utilizan iconos personalizados de Bootstrap Icons y se posicionan dinámicamente según las coordenadas recibidas del modelo de IA. La gestión de eventos de mapa incluye listeners para el zoom automático que ajusta la vista (`fitBounds`) según la extensión de la ruta generada, garantizando que todos los puntos sean visibles al usuario.

### 4. Persistencia offline mediante IndexedDB y Pinia

El almacenamiento de rutas guardadas utiliza **localforage** como abstracción sobre IndexedDB, proporcionando una interfaz Promise-based para operaciones asíncronas de lectura y escritura. La integración con Pinia se configura mediante `pinia-plugin-persistedstate`, que serializa automáticamente el estado del `useTravelStore` y lo persiste en el almacenamiento local del navegador. El sistema implementa **gestión de estados de carga** (`loading`, `error`, `success`) durante las operaciones de guardado, permitiendo que la UI refleje el progreso de cada transacción. La estructura de datos almacenada incluye el objeto ruta completo más metadatos de usuario como fecha de creación (`createdAt`) y puntuación (`rating`).

### 5. Galería con búsqueda y ordenación dinámica

La página de galería implementa un sistema de filtrado y ordenación que opera sobre el array de rutas persisted en el store. La búsqueda por título utiliza comparación de strings case-insensitive, aplicando el método `includes()` sobre el título de cada ruta. La ordenación por puntuación implementa un algoritmo de **sorting descendente** basado en la propiedad `rating`, mientras que la búsqueda es un filtrado lineal que itera sobre el catálogo completo. El sistema de puntuación (1-5 estrellas) permite al usuario actualizar el rating de cualquier ruta guardada, reflejando el cambio inmediatamente en la vista y persistiendo el nuevo valor en IndexedDB mediante acciones del store.

---

## Casos de Uso

### Escenario A: Flujo Principal — Generación y guardado de una ruta de viaje

El usuario inicia la aplicación desde la landing page y navega a la sección de chat haciendo clic en el botón de acceso de la interfaz. Una vez en la página de conversación, el sistema detecta automáticamente la ubicación geográfica del dispositivo mediante la API del navegador (`navigator.geolocation`), mostrando un indicador visual mientras se obtiene la posición. El usuario escribe en el campo de entrada un mensaje como "Vull anar a la platja des de Barcelona" (Quiero ir a la playa desde Barcelona), y al presionar el botón de envío, el sistema valida que el campo no esté vacío, añade el mensaje al historial del chat con el estado "pending" y envía la solicitud al endpoint de API.

El endpoint `/api/chat` procesa la consulta junto con las coordenadas de ubicación actuales, construye un prompt enriquecido con contexto geográfico y lo envía a Gemini 2.5 Flash. La IA responde con un objeto JSON conteniendo la ruta completa, que el sistema parsea y valida contra el esquema de tipos definido. El componente de chat recibe la respuesta parseada, renderiza el mensaje del asistente con la información de la ruta y muestra automáticamente un modal emergente con el mapa interactivo. En el modal, el usuario visualiza la polilínea de la ruta sobre el mapa, inspecta los waypoints intermedios en el timeline del itinerario y evalúa la propuesta. Si la ruta le resulta satisfactoria, hace clic en el botón "Desa la ruta" (Guardar la ruta), lo que dispara la acción `saveRoute` del store, que persiste los datos en IndexedDB y muestra un toast de confirmación. El usuario puede cerrar el modal y continuar explorando la aplicación, pudiendo acceder posteriormente a la ruta guardada desde la galería.

### Escenario B: Gestión de errores — Respuesta inválida del modelo de IA

El usuario envía una consulta al sistema, pero el modelo Gemini devuelve una respuesta que no cumple con el formato JSON esperado o carece de los campos obligatorios definidos en el esquema de tipos. El sistema detecta esta anomalía durante la fase de parseo: la función validadora verifica que el objeto recibido contenga las propiedades `origen`, `destino` y `waypoints`; al encontrar un formato inesperado, lanza una excepción controlada que es capturada por el bloque de manejo de errores del componente. En lugar de mostrar el mapa, el sistema renderiza un mensaje de error en el chat indicando "No hem pogut generar una ruta vàlida. Si us plau, prova-ho de nou amb una altra descripció" (No hemos podido generar una ruta válida. Por favor, inténtalo de nuevo con otra descripción), manteniendo intacto el historial de mensajes anteriores.

Adicionalmente, el sistema muestra un toast de notificación temporal con icono de error durante 3 segundos. El estado del store de chat vuelve al modo "ready", permitiendo al usuario realizar nuevos intentos sin necesidad de recargar la página. Este comportamiento demuestra la robustez del sistema ante entradas no válidas: la aplicación no se bloquea, proporciona retroalimentación clara al usuario y mantiene la sesión conversacional activa. El mismo patrón de manejo se aplica a otros casos de borde como la negación del permiso de geolocalización (se muestra un mensaje informativo solicitando acceso) o la pérdida de conexión durante el envío (se captura el error de red y se indica al usuario el fallo de conectividad).

---

## Conexión con SDD

Las funcionalidades descritas en esta sección son el resultado directo de la fase de **Specify** de la metodología **Spec-Driven Development (SDD)** empleada en este proyecto. Cada capacidad técnica deriva directamente de los requisitos funcionales documentados en el archivo `spec.md` del directorio `/specs/001-travel-buddy-pwa/`, donde las historias de usuario y los criterios de éxito (SC-001 a SC-008) establecen las expectativas que el sistema debe cumplir. La traza entre especificaciones y реалиización se mantiene mediante la verificación de que cada funcionalidad implementada satisface al menos un requisito funcional identificado durante la fase de análisis y especificación del proyecto.