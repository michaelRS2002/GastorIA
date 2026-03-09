# GitHub Actions Workflows

Este directorio contiene los workflows de CI/CD para el proyecto GastorIA.

## Workflows Disponibles

### 1. Backend CI/CD (`backend-ci-cd.yml`)

**Se ejecuta cuando:**
- Se hace push a `main` o `master` con cambios en la carpeta `backend/`
- Se crea un Pull Request que modifica la carpeta `backend/`

**Pasos:**
1. **Test Job:**
   - Configura Python 3.11
   - Instala dependencias
   - Ejecuta linting con flake8
   - Compila archivos Python para verificar sintaxis

2. **Deploy Job:** (solo en push a main/master)
   - Despliega automáticamente a Render

**Secrets requeridos:**
- `RENDER_TOKEN`: Token de API de Render

---

### 2. Frontend CI/CD (`frontend-ci-cd.yml`)

**Se ejecuta cuando:**
- Se hace push a `main` o `master` con cambios en la carpeta `frontend-react/`
- Se crea un Pull Request que modifica la carpeta `frontend-react/`

**Pasos:**
1. **Test Job:**
   - Configura Node.js 20
   - Instala dependencias con npm ci
   - Ejecuta ESLint
   - Construye el proyecto

2. **Deploy Job:** (solo en push a main/master)
   - Despliega automáticamente a Vercel

**Secrets requeridos:**
- `VERCEL_TOKEN`: Token de Vercel
- `VERCEL_ORG_ID`: ID de la organización
- `VERCEL_PROJECT_ID`: ID del proyecto
- `VITE_SUPABASE_URL`: URL de Supabase
- `VITE_SUPABASE_ANON_KEY`: Anon Key de Supabase

---

## Cómo modificar los workflows

### Cambiar las ramas de despliegue

Edita la sección `on:` en cada workflow:

```yaml
on:
  push:
    branches: [ main, develop ]  # Agrega o quita ramas
```

### Agregar más pasos de testing

Agrega pasos adicionales en el job `test`:

```yaml
- name: Run unit tests
  run: |
    cd backend
    pytest
```

### Cambiar la versión de Python/Node

Modifica el step de setup:

```yaml
- name: Set up Python
  uses: actions/setup-python@v5
  with:
    python-version: '3.12'  # Cambia la versión aquí
```

## Monitoreo

Para ver el estado de los workflows:
1. Ve a la pestaña "Actions" en tu repositorio
2. Selecciona el workflow que quieres ver
3. Verás el historial de ejecuciones

## Badges

Puedes agregar badges al README principal:

```markdown
![Backend CI/CD](https://github.com/USUARIO/REPO/workflows/Backend%20CI/CD%20-%20Render/badge.svg)
![Frontend CI/CD](https://github.com/USUARIO/REPO/workflows/Frontend%20CI/CD%20-%20Vercel/badge.svg)
```
