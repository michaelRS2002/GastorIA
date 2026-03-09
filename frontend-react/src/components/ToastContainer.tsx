// Componente Toast para notificaciones

import type { Toast } from '../types';
import '../styles/components.css';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastContainer = ({ toasts, onRemove }: ToastContainerProps) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast ${toast.type}`}
          onClick={() => onRemove(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};
