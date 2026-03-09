# Testing Guide - GastorIA

Este documento describe cómo ejecutar y mantener los tests del proyecto.

## Estructura de Tests

```
GastorIA/
├── backend/
│   ├── tests/
│   │   ├── __init__.py
│   │   ├── conftest.py           # Fixtures compartidas
│   │   ├── test_transaction.py   # Tests del modelo Transaction
│   │   ├── test_utils.py         # Tests de utilidades
│   │   └── test_api.py           # Tests de integración API
│   └── pytest.ini                # Configuración pytest
│
└── frontend-react/
    ├── src/
    │   ├── test/
    │   │   └── setup.ts          # Configuración global
    │   ├── components/
    │   │   └── *.test.tsx        # Tests de componentes
    │   ├── hooks/
    │   │   └── *.test.ts         # Tests de hooks
    │   └── utils/
    │       └── *.test.ts         # Tests de utilidades
    └── vitest.config.ts          # Configuración Vitest
```

## Backend Tests (Python + pytest)

### Instalación de dependencias

```bash
cd backend
pip install -r requirements.txt
```

### Ejecutar tests

```bash
# Todos los tests
pytest

# Tests con cobertura
pytest --cov=. --cov-report=html

# Solo tests unitarios
pytest -m unit

# Solo tests de integración
pytest -m integration

# Tests específicos
pytest tests/test_transaction.py

# Tests con verbose
pytest -v
```

### Ver reporte de cobertura

```bash
# Abrir en navegador
open htmlcov/index.html  # macOS
start htmlcov/index.html # Windows
```

## Frontend Tests (TypeScript + Vitest)

### Instalación de dependencias

```bash
cd frontend-react
npm install
```

### Ejecutar tests

```bash
# Todos los tests
npm test

# Tests con cobertura
npm run test:coverage

# Tests con UI interactiva
npm run test:ui

# Watch mode (auto-reload)
npm test -- --watch

# Tests específicos
npm test -- Header.test.tsx
```

### Ver reporte de cobertura

```bash
# Abrir en navegador
open coverage/index.html
```

## CI/CD Pipeline

Los tests se ejecutan automáticamente en GitHub Actions:

- **Push a `main` o `tests`**: Ejecuta todos los tests
- **Pull Request a `main`**: Ejecuta todos los tests y linting
- **Pipeline incluye**:
  - Backend tests (pytest)
  - Frontend tests (vitest)
  - Linting (ESLint)
  - Build check
  - Coverage reports (Codecov)

## Escribir Nuevos Tests

### Backend (pytest)

```python
import pytest
from models.transaction import Transaction

@pytest.mark.unit
def test_create_transaction(sample_transaction):
    """Test descripción"""
    assert sample_transaction.cantidad > 0
```

### Frontend (Vitest + React Testing Library)

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeTruthy();
  });
});
```

## Buenas Prácticas

1. **Mantener cobertura > 70%** - El CI fallará si cae por debajo
2. **Tests independientes** - Cada test debe poder ejecutarse solo
3. **Usar fixtures y mocks** - No dependas de recursos externos
4. **Tests descriptivos** - Nombres claros de lo que se prueba
5. **Evitar tests frágiles** - No dependas de detalles de implementación

## Markers de pytest

- `@pytest.mark.unit` - Tests unitarios rápidos
- `@pytest.mark.integration` - Tests de integración
- `@pytest.mark.slow` - Tests que tardan más

## Troubleshooting

### Error: "ModuleNotFoundError"

```bash
# Asegúrate de estar en el directorio correcto
cd backend
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
```

### Error: "Cannot find module" (Frontend)

```bash
# Reinstalar dependencias
cd frontend-react
rm -rf node_modules package-lock.json
npm install
```

### Tests pasan localmente pero fallan en CI

- Verifica variables de entorno en `.github/workflows/ci.yml`
- Asegúrate de que los secrets estén configurados en GitHub
- Revisa diferencias de versión Node/Python

## Recursos

- [Pytest Documentation](https://docs.pytest.org/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [GitHub Actions](https://docs.github.com/actions)
