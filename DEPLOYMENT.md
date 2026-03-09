# Guía de Configuración CI/CD - GastorIA

Esta guía te ayudará a configurar el despliegue automático de tu aplicación usando GitHub Actions, Vercel (frontend) y Render (backend).

## 📋 Archivos Creados

Se han creado los siguientes archivos de configuración:

- `backend/requirements.txt` - Dependencias de Python
- `.github/workflows/backend-ci-cd.yml` - CI/CD para el backend
- `.github/workflows/frontend-ci-cd.yml` - CI/CD para el frontend
- `frontend-react/vercel.json` - Configuración de Vercel
- `render.yaml` - Configuración de Render

## 🚀 Configuración Paso a Paso

### 1. Preparar el Repositorio en GitHub

1. Crea un nuevo repositorio en GitHub (si no lo has hecho)
2. Sube tu código:
   ```bash
   git init
   git add .
   git commit -m "Initial commit with CI/CD setup"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
   git push -u origin main
   ```

### 2. Configurar Vercel (Frontend)

1. Ve a [Vercel](https://vercel.com) e inicia sesión con GitHub
2. Click en "Add New Project"
3. Importa tu repositorio de GitHub
4. Configura el proyecto:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend-react`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Agrega las variables de entorno en Vercel:
   - `VITE_SUPABASE_URL`: Tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY`: Tu Anon Key de Supabase

6. Obtén los tokens necesarios para GitHub Actions:
   - Ve a Settings → Tokens → Create Token
   - Copia el token generado
   - En tu proyecto, ve a Settings → General
   - Copia el **Project ID** y **Org ID** (están en la URL o en Settings)

7. Agrega los secrets en GitHub:
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Click en "New repository secret" y agrega:
     - `VERCEL_TOKEN`: El token que copiaste
     - `VERCEL_ORG_ID`: Tu Organization ID
     - `VERCEL_PROJECT_ID`: Tu Project ID
     - `VITE_SUPABASE_URL`: Tu URL de Supabase
     - `VITE_SUPABASE_ANON_KEY`: Tu Anon Key de Supabase

### 3. Configurar Render (Backend)

1. Ve a [Render](https://render.com) e inicia sesión con GitHub
2. Click en "New +" → "Web Service"
3. Conecta tu repositorio de GitHub
4. Configura el servicio:
   - **Name:** gastoria-backend
   - **Region:** Oregon (u otra región cercana)
   - **Branch:** main
   - **Root Directory:** `backend`
   - **Runtime:** Python 3
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn --bind 0.0.0.0:$PORT app:app`

5. Configura las variables de entorno (si las necesitas):
   - Click en "Environment" en el panel izquierdo
   - Agrega las variables necesarias

6. Obtén el token de Render para GitHub Actions:
   - Ve a Account Settings → API Keys
   - Click en "Create API Key"
   - Copia el token generado

7. Agrega el secret en GitHub:
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Click en "New repository secret" y agrega:
     - `RENDER_TOKEN`: El token que copiaste

### 4. Verificar la Configuración

Una vez configurado todo:

1. Haz un cambio en tu código
2. Haz commit y push:
   ```bash
   git add .
   git commit -m "Test CI/CD pipeline"
   git push origin main
   ```

3. Ve a la pestaña "Actions" en tu repositorio de GitHub
4. Deberías ver los workflows ejecutándose
5. Los despliegues se harán automáticamente cuando los tests pasen

## 🔄 Flujo de Trabajo

### Para el Backend:
1. Se ejecutan pruebas de linting (flake8)
2. Se compilan los archivos Python
3. Si todo pasa, se despliega automáticamente a Render

### Para el Frontend:
1. Se instalan las dependencias
2. Se ejecuta el linter de ESLint
3. Se construye el proyecto
4. Si todo pasa, se despliega automáticamente a Vercel

## 📝 Notas Importantes

- **Despliegue Automático:** Solo se despliega en push a la rama `main` o `master`
- **Pull Requests:** Los PRs ejecutan tests pero no despliegan
- **Cambios Específicos:** Los workflows solo se ejecutan si hay cambios en sus respectivas carpetas
- **Free Tier:** Tanto Vercel como Render tienen planes gratuitos suficientes para desarrollo

## 🔧 Comandos Útiles

### Backend Local
```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

### Frontend Local
```bash
cd frontend-react
npm install
npm run dev
```

## 🛠 Solución de Problemas

### Error en el workflow de backend
- Verifica que `RENDER_TOKEN` esté configurado en los secrets de GitHub
- Asegúrate de que el servicio esté conectado a tu repositorio en Render

### Error en el workflow de frontend
- Verifica que `VERCEL_TOKEN`, `VERCEL_ORG_ID` y `VERCEL_PROJECT_ID` estén configurados
- Asegúrate de que las variables de entorno de Supabase estén en Vercel y GitHub

### Los workflows no se ejecutan
- Verifica que los archivos estén en `.github/workflows/`
- Asegúrate de haber hecho push a la rama `main` o `master`

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Documentación de Render](https://render.com/docs)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

¡Listo! Tu aplicación ahora tiene CI/CD automático. Cada vez que hagas push a main, se ejecutarán los tests y, si pasan, se desplegará automáticamente. 🎉
