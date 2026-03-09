# 💰 Frontend React + TypeScript - Asistente Financiero

Este es el frontend modernizado del **Asistente Financiero** construido con React y TypeScript.

## 🚀 Características

- ⚛️ **React 18** con TypeScript
- ⚡ **Vite** - Build tool ultra-rápido
- 🎤 **Reconocimiento de voz** - Web Speech API
- 🎨 **CSS moderno** - Variables CSS y animaciones
- 📱 **Responsive** - Diseño adaptable a todos los dispositivos
- 🔄 **Hot Module Replacement** - Desarrollo sin recargar página

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# O con yarn
yarn install

# O con pnpm
pnpm install
```

## 🏃 Ejecutar en Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# O con yarn
yarn dev

# O con pnpm
pnpm dev
```

La aplicación estará disponible en **http://localhost:3000**

## 🔨 Build para Producción

```bash
# Compilar para producción
npm run build

# Previsualizar build de producción
npm run preview
```

Los archivos compilados estarán en la carpeta `dist/`

## 📁 Estructura del Proyecto

```
frontend-react/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Header.tsx
│   │   ├── StatusBar.tsx
│   │   ├── TransactionInput.tsx
│   │   ├── ResultDisplay.tsx
│   │   ├── AnalysisSection.tsx
│   │   ├── SuggestionsSection.tsx
│   │   ├── TransactionsList.tsx
│   │   ├── Loading.tsx
│   │   └── ToastContainer.tsx
│   ├── hooks/               # Custom hooks
│   │   ├── useToast.ts
│   │   └── useSpeechRecognition.ts
│   ├── services/            # Servicios API
│   │   └── api.ts
│   ├── styles/              # Estilos CSS
│   │   ├── app.css
│   │   └── components.css
│   ├── types/               # Tipos TypeScript
│   │   └── index.ts
│   ├── utils/               # Utilidades
│   │   └── formatters.ts
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔧 Configuración

### Backend URL

El frontend está configurado para comunicarse con el backend en `http://localhost:5000`. Si necesitas cambiar esto, modifica el proxy en `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Cambia esto si es necesario
        changeOrigin: true,
      },
    },
  },
})
```

## 🎯 Uso

1. **Asegúrate de que el backend esté corriendo** en `http://localhost:5000`
2. **Inicia el frontend** con `npm run dev`
3. **Abre tu navegador** en `http://localhost:3000`
4. **Registra transacciones** escribiendo o usando voz
5. **Visualiza análisis** financieros por períodos

## 🌐 Navegadores Soportados

- ✅ Chrome/Edge (recomendado para reconocimiento de voz)
- ✅ Firefox
- ✅ Safari (reconocimiento de voz limitado)

## 📝 Scripts Disponibles

- `npm run dev` - Inicia servidor de desarrollo
- `npm run build` - Compila para producción
- `npm run preview` - Previsualiza build de producción
- `npm run lint` - Ejecuta linter

## 🔍 Tecnologías Utilizadas

- **React** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Web Speech API** - Reconocimiento de voz
- **Fetch API** - Comunicación con backend
- **CSS3** - Estilos modernos

## 🐛 Troubleshooting

### El reconocimiento de voz no funciona

- Asegúrate de usar Chrome o Edge
- Permite el acceso al micrófono cuando el navegador lo solicite
- Verifica que estés usando HTTPS o localhost

### Error de conexión con el backend

- Verifica que el backend esté corriendo en `http://localhost:5000`
- Revisa la configuración del proxy en `vite.config.ts`
- Comprueba que no haya errores de CORS

## 📄 Licencia

Parte del proyecto Asistente Financiero © 2026
