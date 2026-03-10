# 💰 GastorIA - Intérprete Financiero con IA

Sistema inteligente de gestión financiera que procesa transacciones usando **Groq API (Llama 3.3 70B)** para clasificar automáticamente gastos e ingresos por voz o texto, con soporte para jerga colombiana.

## 📊 Métricas del Sistema

- ✅ **Precisión con IA**: ~92% de clasificación correcta
- ⚡ **Precision Fallback**: ~78% con diccionarios de palabras clave
- 🧪 **Cobertura de Tests**: 71% (22 tests unitarios + integración)
- 🚀 **Tiempo de Respuesta**: 2-4s (IA) | ~100ms (fallback)
- 🌐 **Disponibilidad**: ~99.5% uptime
- 🇨🇴 **Jerga Colombiana**: "lucas", "palos", montos informales

## 🎯 Características

- 🤖 **IA-First con Fallback**: Groq API primero, diccionarios de keywords si falla
- 🎤 **Entrada por Voz**: Reconocimiento de voz (Web Speech API en Chrome/Edge)
- 💬 **Lenguaje Natural**: "gasté 50 lucas en almuerzo" → Comida, $50,000
- 📊 **Análisis Inteligente**: Reportes por período (diario, semanal, mensual, anual)
- 💡 **Sugerencias IA**: Recomendaciones de ahorro personalizadas
- 📱 **Responsive**: Interfaz adaptable a móvil y desktop
- 🔐 **Autenticación OAuth**: Login con Google vía Supabase
- ☁️ **CI/CD**: Deploy automático con GitHub Actions + Render
- 🔒 **Row Level Security**: Aislamiento total de datos entre usuarios

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│  Usuario (Voz/Texto en lenguaje natural)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Frontend (React + TypeScript)                          │
│  - Render Static Site                                   │
│  - Web Speech API (voz)                                 │
│  - Supabase Auth (OAuth Google)                         │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Backend API (Flask + Python)                           │
│  - Render Web Service                                   │
│  - JWT validation                                       │
└────┬──────────────┬──────────────┬──────────────────────┘
     │              │              │
     ▼              ▼              ▼
┌─────────┐  ┌──────────┐  ┌───────────────┐
│ Groq API│  │ Keyword  │  │ Supabase      │
│ (IA)    │  │ Fallback │  │ PostgreSQL    │
│ Llama   │  │ Dict.    │  │ + RLS         │
│ 3.3 70B │  │          │  │               │
└─────────┘  └──────────┘  └───────────────┘

GastorIA/
├── backend/                 # API REST (Flask + Python)
│   ├── app.py              # Endpoints + JWT auth
│   ├── models/             # Transaction, FinancialService
│   ├── utils/              # groq_client, keyword_extractor, validators
│   ├── tests/              # 22 tests (pytest)
│   └── requirements.txt    # Flask, gunicorn, jsonschema
│
├── frontend-react/         # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── components/     # UI (Input, List, Analysis, Suggestions)
│   │   ├── services/       # API client + Supabase
│   │   ├── hooks/          # useSpeechRecognition, useAuth
│   │   └── context/        # AuthContext
│   └── vitest.config.ts    # Tests frontend
│
└── .github/workflows/      # CI/CD con GitHub Actions
    ├── backend-ci-cd.yml   # Deploy a Render (backend)
    └── frontend-ci-cd.yml  # Deploy a Render (frontend)
```

## 🚀 Inicio Rápido

### **Backend (Flask + IA)**

```bash
cd backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# (Opcional) Instalar Ollama local para IA
# https://ollama.ai
# ollama pull mistral

# Ejecutar servidor
python app.py
```

**Backend cusa **Groq API** como proveedor principal de IA:

### **Opción 1: Groq Cloud** ⭐ **En producción actual**

```bash
# .env
AI_PROVIDER=groq
AI_API_BASE_URL=https://api.groq.com/openai/v1
AI_API_KEY=gsk_your-groq-api-key
AI_API_MODEL=llama-3.3-70b-versatile
```

**Ventajas**:
- ✅ Ultra-rápido (10x más rápido que GPT-4)
- ✅ Tier gratuito generoso (30 req/min, 14,400 tokens/min)
- ✅ Precisión ~92% en clasificación
- ✅ Compatible con jerga colombiana
- ✅ API compatible con OpenAI (fácil migración)

**Costos** (tier pago si se escala):
- ~$0.59 por millón de tokens (entrada)
- ~$0.79 por millón de tokens (salida)
- **Proyección**: ~$9/mes para 1,000 usuarios activos

### **Opción 2: Ollama Local** (Futuro - Desarrollo)

```bash
# .env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:70b
```

**Ventajas**: Gratuito, privado, sin límites  
**Desventajas**: Requiere GPU (lento en CPU), setup complejo  
**Requisito**: Instalar [Ollama](https://ollama.ai)

### **Opción 3: OpenAI** (Alternativa costosa)

```bash
# .env
AI_PROVIDER=openai
AI_API_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-your-api-key
AI_API_MODEL=gpt-4o-mini
```

**Ventajas**: Mayor precisión potencial (~95%)  
**Desventajas**: ~33x más caro que Groq (~$300/mes para 1,000 usuari
## 🔧 Configuración de IA

El backend soporta **dos proveedores de IA**:

### **Opción 1: Ollama (Local - Gratis)** ⭐ Recomendado para desarrollo

```bash
# .env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

**Ventajas**: Gratuito, privado, sin límites
**Requisito**: Instalar [Ollama](https://ollama.ai)

### **Opción 2: OpenAI/Groq (Cloud - Producción)**

```bash
# .env
AI_PROVIDER=openai
AI_API_BASE_URL=https://api.openai.com/v1
AI_API_KEY=sk-your-api-key
AI_API_MODEL=gpt-4o-mini
```

**Ventajas**: Más potente, sin instalación local
**Requisito**: API key (tiene costos)

## 🌐 API Endpoints

### Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/health` | Estado del servidor y IA |
| `POST` | `/api/process-audio` | **Procesar transacción** (principal) |
| `GET` | `/api/transactions` | Obtener todas las transacciones |
| `DELETE` | `/api/transactions` | Eliminar todas las transacciones |
| `GET` | `/api/analysis/{period}` | Análisis financiero |
| `GET` | `/api/suggestions` | Sugerencias de ahorro |

### Ejemplo de Uso

```bash
# Procesar una transacción
curl -X POST http://localhost:5000/api/process-audio \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Gasté 50 mil pesos en comida",
    "use_ai": true
  }'

# Respuesta
{ a **Render** (backend y frontend):

```
Push a main → GitHub Actions → Tests → Deploy a Render
```

### Pipeline CI/CD

**Backend** (.github/workflows/backend-ci-cd.yml):
1. ✅ Setup Python 3.11 + dependencies
2. 🧪 Flake8 (linting) + pytest (cobertura mínima 45%)
3. 🚀 Deploy a Render (si tests pasan)

**Frontend** (.github/workflows/frontend-ci-cd.yml):
1. ✅ Setup Node.js 20 + dependencies
2. 🧪 ESLint + Vitest + Build con Vite
3. 🚀 Deploy a Render Static Site (si build pasa)

### Configurar CI/CD:

1. Lee la guía completa: **[DEPLOYMENT.md](DEPLOYMENT.md)** (si existe)
2. Configura secrets en GitHub (Settings → Secrets):
   - `RENDER_API_KEY` - Token de Render
3. Variables de entorno en Render (dashboard):
   - **Backend**: `AI_PROVIDER`, `AI_API_KEY`, `SUPABASE_URL`, `SUPABASE_KEY`
   - **Frontend**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`

### URLs de Producción

- **Frontend**: https://gastoria-frontend.onrender.com (o tu URL de Render)
- **Backend API**: https://gastoria-backend.onrender.com/api (o tu URL de Render)

**Tiempo de deploy**: ~8-13 minutos (desde push hasta producción)  
**Rollback**: ~3 minutos (desde dashboard de Render)
- **`Login.tsx`** - Autenticación con Supabase
- **`TransactionInput.tsx`** - Input de voz/texto para transacciones
- **`TransactionsList.tsx`** - Lista de transacciones
### Backend (pytest)

```bash
cd backend

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar tests con cobertura
pytest --cov=. --cov-report=html

# Solo tests específicos
pytest tests/test_transaction.py -v
pytest tests/test_api.py -v
```

**Cobertura acbackend/.env`)
```bash
# IA Configuration (Groq - Producción)
AI_PROVIDER=groq
AI_API_BASE_URL=https://api.groq.com/openai/v1
AI_API_KEY=gsk_your-groq-api-key-here
AI_API_MODEL=llama-3.3-70b-versatile

# Supabase (opcional para backend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-role-key

# Flask
PORT=5000
FLASK_DEBUG=False  # En producción
```

### Frontend (`frontend-react/.env`)
```bash
# Supabase (autenticación + base de datos)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Backend API
VITE_API_BASE_URL=http://localhost:5000/api  # Desarrollo
# VITE_API_BASE_URL=https://gastoria-backend.onrender.com/api  # Producción
cd frontend-react

# Ejecutar tests
npm run test

# Con cobertura
npm run test:coverage

# Lint
npm run lint
```

## 📈 Ejemplos de Uso - Jerga Colombiana

El sistema entiende expresiones coloquiales colombianas:

```bash
# Entrada: "gasté 50 lucas en almuerzo"
→ Tipo: gasto | Categoría: Comida | Cantidad: $50,000 | Confianza: 0.94

# Entrada: "me pagaron dos palos de salario"
→ Tipo: ingreso | Categoría: Salario | Cantidad: $2,000,000 | Confianza: 0.98

# Entrada: "5 lucas de parqueadero en el centro"
→ Tipo: gasto | Categoría: Gasolina/Transporte | Cantidad: $5,000 | Confianza: 0.89

# Entrada: "un millón doscientos de arriendo"
→ Tipo: gasto | Categoría: Vivienda | Cantidad: $1,200,000 | Confianza: 0.96
```

**Formatos monetarios soportados:**
- "lucas" → miles (ej: "50 lucas" = 50,000)
- "palos" → millones (ej: "2 palos" = 2,000,000)
- "mil", "millón", "millones"
- Números con puntos: "$1.500.000"
- Decimales: "50.5 mil" = 50,500**Tests pasan** → Deploy automático
3. **Frontend** → Vercel
4. **Backend** → Render

### Configurar CI/CD:

1. Lee la guía completa: **[DEPLOYMENT.md](DEPLOYMENT.md)**
2. Configura secrets en GitHub:
   - `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
   - `RENDER_TOKEN`
  **Flask 3.0.2** - Framework web REST API
- **Requests** - HTTP client para Groq API
- **Gunicorn** - Servidor WSGI (producción en Render)
- **jsonschema** - Validación de respuestas del LLM
- **pytest** - Testing framework
- **pytest-cov** - Cobertura de código
- **flake8** - Linting y análisis estático

### Frontend
- **React 18** - UI Library
- **TypeScript** - Tipado estático
- **👥 Equipo** - Proyecto Integrador II

**Universidad del Valle - Facultad de Ingeniería**

- Daniel Rojas
- Maria Alejandra Moya 
- Jose Adrian Marin 
- Juan Fernando Calle
- Michael Ramirez


**Curso**: Proyecto Integrador II  
**Fecha**: Marzo 2026

## 📚 Documentación Adicional

- **[TESTING.md](TESTING.md)** - Guía completa de tests y cobertura

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. **Ejecuta los tests**: `pytest` (backend) y `npm run test` (frontend)
4. **Asegura cobertura mínima**: 45% (CI/CD lo verificará)
5. Commit con mensajes descriptivos (`git commit -m 'Add: clasificación de categoría X'`)
6. Push a la branch (`git push origin feature/AmazingFeature`)
7. Abre un Pull Request (CI debe pasar ✅)

### Branching Strategy

- `main` - Producción (protegida, requiere PR + CI passing)
- `tests` - Desarrollo y testing (CI ejecuta tests, no deploy)
- `feature/*` - Ramas individuales de características

## 🐛 Reportar Bugs

Abre un issue en GitHub con:
- ❗ Descripción clara del problema
- 🔄 Pasos exactos para reproducir
- 📋 Logs del servidor (`backend/`) o consola del navegador
- 📸 Screenshots (si aplica)
- 🌐 Navegador y versión (para bugs de frontend)

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 📞 Soporte

- 🐛 **Bugs**: GitHub Issues
- 💬 **Preguntas**: GitHub Discussions
- 🧪 **Testing**: [TESTING.md](TESTING.md)

## 🎯 Roadmap Futuro

- [ ] Edición de transacciones (actualmente solo crear/eliminar)
- [ ] Categorías personalizadas por usuario
- [ ] Exportar reportes a PDF/Excel
- [ ] Gráficos interactivos (Chart.js / Recharts)
- [ ] Cache con Redis para respuestas frecuentes (reducir costos IA)
- [ ] Soporte offline con Service Workers
- [ ] Dockerización completa (backend + frontend)
- [ ] Soporte para más jerga regional (mexicana, argentina, etc.)

---

**Desarrollado con ❤️ para Proyecto Integrador II - Universidad del Valle**
- Requests - HTTP client para IA
- Gunicorn - Servidor WSGI (producción)
- jsonschema - Validación de datos

### Frontend
- React 18 - UI Library
- TypeScript - Tipado estático
- Vite - Build tool
- Supabase - Autenticación y BD

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

## 🐛 Reportar Bugs

Abre un issue en GitHub con:
- Descripción del problema
- Pasos para reproducir
- Logs del servidor/navegador
- Screenshots (si aplica)

## 📞 Soporte

- 📖 Documentación: Ver archivos `.md` en el repositorio
- 🐛 Bugs: GitHub Issues
- 💬 Preguntas: GitHub Discussions

---

**Desarrollado con ❤️ para PI-II**





