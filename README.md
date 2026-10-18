# ARCADIA · web

Web de una sola página de ARCADIA: ocio gaming activo y gratuito para jóvenes de 16 a 30 años en Bizkaia.

## Archivos

- `index.html`: todo el contenido (textos, secciones y formulario).
- `styles.css`: colores, tipografías y diseño.
- `main.js`: el pasaporte interactivo del inicio y el formulario de inscripción.

## Publicarla gratis con GitHub Pages

1. En el repositorio, ve a **Settings → Pages**.
2. En *Source* elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`. Guarda.
3. En un par de minutos estará en `https://irolaizo.github.io/arcadia-web/`.

## Activar el formulario de inscripción

El formulario necesita un servicio que recoja las respuestas. Lo más sencillo es Formspree (gratis hasta 50 envíos al mes):

1. Crea una cuenta en https://formspree.io con el email de ARCADIA.
2. Crea un formulario nuevo y copia su dirección (algo como `https://formspree.io/f/abcdwxyz`).
3. En `main.js`, pégala en la primera línea: `const FORM_ENDPOINT = "https://formspree.io/f/abcdwxyz";`

Hasta entonces, el formulario avisa de que las inscripciones abren pronto.

## Pendiente

- Email, Instagram y TikTok en el pie de página (`index.html`, sección `footer`).
- Lugar y fecha del primer pop-up.
- Versión en euskera.
