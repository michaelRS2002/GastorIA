// Componente de Login

import { useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import '../styles/components.css';

export const Login = () => {
  const { signInWithGoogle, loading } = useAuthContext();
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>💰 Asistente Financiero</h1>
          <p className="subtitle">Gestiona tus gastos con inteligencia artificial</p>
        </div>

        <div className="login-content">
          <h2>Iniciar Sesión</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
            Inicia sesión con tu cuenta de Google para acceder a tu historial financiero
          </p>

          {error && (
            <div className="error-message">
              <strong>Error:</strong> {error}
            </div>
          )}

          <button
            className="btn btn-google"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-small"></span>
                Cargando...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332A8.997 8.997 0 009.003 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.964 10.712A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.96A8.996 8.996 0 000 9c0 1.452.348 2.827.96 4.042l3.004-2.33z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.428 0 9.003 0A8.997 8.997 0 00.96 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar con Google
              </>
            )}
          </button>

          <div className="login-features">
            <h3>¿Por qué iniciar sesión?</h3>
            <ul>
              <li>✅ Tus datos están seguros y privados</li>
              <li>✅ Accede a tu historial desde cualquier dispositivo</li>
              <li>✅ Análisis personalizados con IA</li>
              <li>✅ Sincronización automática</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
