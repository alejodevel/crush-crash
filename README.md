# SIN FILTRO

Dos juegos para parejas y amigos, en una sola página estática (HTML + CSS + JS, sin dependencias ni build):

- **Crush or Crash** — respondes 10 preguntas sobre ti, mandas un link y la otra persona intenta adivinar. Mezcla opción múltiple, verdad o mentira, rankings por prioridad y respuestas escritas. El resultado va de *LOVE OF MY LIFE* a *TOTAL CRASH* (8 niveles).
- **El Mazo** — cartas de Verdad, Reto y Confesión en tres intensidades (Suave, Picante, Profundo) más modo Caos, con turnos opcionales.

## Probarlo en local (VS Code)

1. Abre la carpeta en VS Code.
2. Instala la extensión **Live Server** y haz clic en *Go Live*, o simplemente abre `index.html` con doble clic.

> Los links de Crush or Crash llevan el reto dentro de la URL. Para compartirlos con otras personas necesitas que el sitio esté publicado (paso siguiente); con `file://` o `localhost` el link solo funciona en tu equipo.

## Subirlo a GitHub + GitHub Pages

```bash
git init
git add .
git commit -m "SIN FILTRO: primera versión"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/sin-filtro.git
git push -u origin main
```

Luego en GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
En un par de minutos queda en `https://TU-USUARIO.github.io/sin-filtro/`.

## Estructura

```
index.html   estructura de las vistas
style.css    todo el diseño (variables de color arriba del archivo)
art.js       ilustraciones SVG de los mazos, reversos, corazón del resultado e iconos
data.js      preguntas, niveles de resultado y cartas  <- aquí se edita el contenido
app.js       router por hash, lógica de los dos juegos, compartir por WhatsApp
fonts/       Jost y DM Mono (autoalojadas, funcionan sin internet)
```

## Editar el contenido

**Preguntas** (`data.js` → `QUESTIONS`). Tipos: `mc`, `bool`, `rank`, `open`.
Cada reto toma 10: 4 de opción múltiple, 2 de verdad/mentira, 2 de ranking y 2 escritas (la primera siempre es de opción múltiple y la última escrita).
Puntos: opción múltiple 1 · verdad/mentira 1 · ranking 2 · escrita 2.
Los `id` viajan dentro de los links: **agrega preguntas con ids nuevos, pero no cambies ni reutilices los existentes** o los links ya enviados dejarán de funcionar.

**Niveles de resultado** (`TIERS`): cada uno tiene `min` (porcentaje mínimo), `name` y `line` (la frase).

**Cartas** (`CARDS`): `CARDS.verdad[1]` es el mazo Verdad en nivel Suave; `[2]` Picante; `[3]` Profundo. Puedes agregar o quitar textos libremente.

**Colores**: variables `--acid`, `--hot`, `--volt`, `--paper`, `--ink` al inicio de `style.css`.

## Cómo se puntúa

- Ranking: 2 puntos si el orden es exacto; 1 punto si aciertas el puesto 1 o al menos dos posiciones.
- Respuesta escrita: se compara sin tildes ni mayúsculas y con tolerancia a plurales y errores leves. Si no coincide, se muestran las dos respuestas y quien adivina decide si cuenta (juego limpio).
