// Componente Loading

import '../styles/components.css';

interface LoadingProps {
  show: boolean;
}

export const Loading = ({ show }: LoadingProps) => {
  if (!show) return null;

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
      <p>Procesando...</p>
    </div>
  );
};
