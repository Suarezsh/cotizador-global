<div align="center">

<img src="https://raw.githubusercontent.com/Suarezsh/cotizador-global/main/assets/logo.svg" alt="Cotizador Global" width="120">

# Cotizador Global

**Genera cotizaciones y presupuestos profesionales desde cualquier dispositivo.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=flat-square)](https://developer.mozilla.org/es/docs/Web/HTML)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white&style=flat-square)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=flat-square)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![Font Awesome](https://img.shields.io/badge/Font_Awesome-528DD7?logo=font-awesome&logoColor=white&style=flat-square)](https://fontawesome.com/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=flat-square)](https://github.com/Suarezsh/cotizador-global)

[Ver demo en vivo](https://suarezsh.github.io/cotizador-global/) · [Reportar issue](https://github.com/Suarezsh/cotizador-global/issues) · [Solicitar feature](https://github.com/Suarezsh/cotizador-global/issues)

</div>

---

## Tabla de contenidos

- [Descripción](#descripción)
- [Características principales](#características-principales)
- [Capturas de pantalla](#capturas-de-pantalla)
- [Tecnologías](#tecnologías)
- [Cómo usar](#cómo-usar)
  - [Requisitos](#requisitos)
  - [Instalación local](#instalación-local)
  - [Primeros pasos](#primeros-pasos)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Flujo de trabajo](#flujo-de-trabajo)
- [Personalización](#personalización)
- [Roadmap](#roadmap)
- [Contribuciones](#contribuciones)
- [Licencia](#licencia)
- [Contacto](#contacto)

---

## Descripción

**Cotizador Global** es una aplicación web estática que permite a profesionales, freelancers y pequeños negocios crear cotizaciones y presupuestos de forma rápida y profesional. Funciona completamente en el navegador sin necesidad de backend, utilizando `LocalStorage` como base de datos local.

La aplicación está diseñada para adaptarse a cualquier moneda, impuesto, idioma o formato regional del mundo. Todos los datos son editables: configuración global, clientes, monedas, impuestos, estilos visuales y cada cotización individual.

---

## Características principales

### Panel de cotización
- Creación rápida de cotizaciones con número, fechas, cliente, descuentos y anticipos.
- Tabla dinámica de ítems con descripción, tipo, unidad, cantidad, precio y descuento por línea.
- Reordenamiento de ítems con flechas arriba/abajo.
- Control de impuestos por ítem o aplicación global a todos los ítems.
- Cálculos automáticos en tiempo real de subtotales, descuentos, impuestos, total, anticipo y saldo pendiente.

### Panel de administración
- Datos completos del emisor: nombre, slogan, logo, contacto, dirección, identificación fiscal y sitio web.
- Gestión de clientes con información de contacto.
- Gestión de monedas personalizadas con símbolo, posición y separadores.
- Gestión de impuestos personalizados con modo agregado o incluido.
- Términos, condiciones, notas de agradecimiento y pie de página.
- Estilos visuales para el PDF: Clásico, Moderno, Minimalista, Maximalista, Brutalista, Skeuomorfismo, Claymorfismo, Liquid Glass y UI Espacial.
- Color de acento personalizable.

### Diseño y experiencia de usuario
- Interfaz responsive 100% mobile-first.
- Menú inferior tipo Temu para navegación rápida en dispositivos móviles.
- Modales flotantes para todas las acciones de administración.
- Vista previa A4 en vivo del documento final.
- Iconos profesionales de Font Awesome en toda la interfaz.

### Acciones de salida
- Exportar a PDF mediante impresión nativa.
- Compartir por WhatsApp.
- Enviar por correo electrónico.
- Copiar enlace compartible con los datos codificados.
- Guardar y cargar cotizaciones desde LocalStorage.
- Duplicar cotizaciones.
- Respaldo y restauración completa en JSON.

---

## Capturas de pantalla

<div align="center">

| Vista móvil - Cotizar | Vista móvil - Configuración | Vista previa PDF |
|:---:|:---:|:---:|
| ![Cotizar](docs/screenshots/mobile-quote.svg) | ![Configuración](docs/screenshots/mobile-config.svg) | ![PDF](docs/screenshots/pdf-preview.svg) |

| Escritorio - Split view | Modal de clientes | Estilo Liquid Glass |
|:---:|:---:|:---:|
| ![Escritorio](docs/screenshots/desktop-split.svg) | ![Clientes](docs/screenshots/modal-clients.svg) | ![Liquid Glass](docs/screenshots/style-liquid-glass.svg) |

</div>

> Nota: Las capturas de pantalla son ilustrativas. Puedes reemplazarlas por imágenes reales en la carpeta `docs/screenshots/`.

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica de la aplicación. |
| Tailwind CSS | Estilos utilitarios y diseño responsive. |
| JavaScript Vanilla | Lógica de negocio, estado y manipulación del DOM. |
| Font Awesome 6 | Iconografía profesional. |
| LocalStorage | Persistencia local de datos. |

No se utilizan frameworks ni dependencias de backend. La aplicación es completamente estática y puede ejecutarse abriendo el archivo `index.html` directamente.

---

## Cómo usar

### Requisitos

- Un navegador web moderno (Chrome, Firefox, Edge, Safari).
- Conexión a internet solo para cargar Tailwind CSS y Font Awesome desde CDN.

### Instalación local

1. Clona el repositorio:

```bash
git clone https://github.com/Suarezsh/cotizador-global.git
```

2. Entra en la carpeta del proyecto:

```bash
cd cotizador-global
```

3. Abre el archivo `index.html` en tu navegador:

```bash
# En Windows
start index.html

# En macOS
open index.html

# En Linux
xdg-open index.html
```

O usa una extensión como Live Server en Visual Studio Code para una mejor experiencia de desarrollo.

### Primeros pasos

1. **Configura tu negocio**: abre la configuración y completa los datos del emisor.
2. **Agrega clientes, monedas e impuestos**: desde los modales flotantes correspondientes.
3. **Personaliza el estilo visual**: elige un estilo para tu PDF y un color de acento.
4. **Crea una cotización**: selecciona el cliente, agrega ítems y ajusta descuentos.
5. **Visualiza y exporta**: revisa la vista previa A4 y exporta a PDF.

---

## Estructura del proyecto

```text
cotizador-global/
├── index.html                  # Punto de entrada de la aplicación
├── README.md                   # Documentación del proyecto
├── requerimientos.txt          # Requerimientos originales del proyecto
├── assets/
│   ├── css/
│   │   └── styles.css          # Estilos personalizados y estilos visuales del PDF
│   ├── js/
│   │   ├── app.js              # Lógica principal y navegación
│   │   ├── admin.js            # Gestión de modales de administración
│   │   ├── calculations.js     # Motor de cálculos de cotizaciones
│   │   ├── defaults.js         # Datos de ejemplo por defecto
│   │   ├── formatters.js       # Formateo de monedas, fechas y etiquetas
│   │   ├── preview.js          # Renderizado de la vista previa A4
│   │   ├── quote.js            # Panel de cotización
│   │   ├── state.js            # Estado global y persistencia en LocalStorage
│   │   └── storage.js          # Funciones de respaldo/restauración JSON
│   └── logo.svg                # Logo del proyecto
└── docs/
    └── screenshots/              # Capturas de pantalla para el README
```

---

## Flujo de trabajo

```mermaid
graph TD
    A[Configuración del negocio] --> B[Crear cotización]
    B --> C[Agregar ítems y ajustar totales]
    C --> D[Visualizar vista previa A4]
    D --> E{Acción de salida}
    E -->|Exportar| F[PDF]
    E -->|Compartir| G[WhatsApp / Correo / Enlace]
    E -->|Guardar| H[LocalStorage]
```

---

## Personalización

### Estilos visuales del PDF

El panel de administración permite seleccionar entre múltiples estilos visuales para la hoja A4:

- Clásico
- Moderno
- Minimalista
- Maximalista
- Brutalista
- Skeuomorfismo / Clasmorfismo
- Claymorfismo
- Liquid Glass
- UI Espacial

Cada estilo aplica colores, sombras, bordes y tipografías diferentes a la vista previa.

### Color de acento

Puedes personalizar el color principal que se utiliza en títulos, totales y elementos destacados del PDF.

### Monedas e impuestos

Agrega tantas monedas e impuestos como necesites. Cada cotización utiliza la moneda y los impuestos marcados por defecto.

---

## Roadmap

- [x] Diseño responsive con menú inferior tipo Temu.
- [x] Modales flotantes para administración.
- [x] Estilos visuales avanzados para el PDF.
- [x] Control de impuestos por ítem y global.
- [x] Alertas y confirmaciones en modales.
- [ ] Modo oscuro para el panel de administración.
- [ ] Catálogo de productos y servicios guardados.
- [ ] Firma digital en el PDF.
- [ ] Soporte para múltiples cotizaciones activas.

---

## Contribuciones

Las contribuciones son bienvenidas. Si deseas mejorar el proyecto:

1. Haz un fork del repositorio.
2. Crea una rama para tu feature: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios y haz commit: `git commit -m 'Agrega nueva funcionalidad'`.
4. Sube los cambios a tu fork: `git push origin feature/nueva-funcionalidad`.
5. Abre un Pull Request en el repositorio original.

---

## Licencia

Este proyecto está bajo la licencia MIT. Puedes usarlo, modificarlo y distribuirlo libremente.

---

## Contacto

- **Proyecto**: [github.com/Suarezsh/cotizador-global](https://github.com/Suarezsh/cotizador-global)
- **Issues**: [github.com/Suarezsh/cotizador-global/issues](https://github.com/Suarezsh/cotizador-global/issues)

Desarrollado con dedicación para profesionales y emprendedores.

</div>
