// Componente UserProfile

import { useAuthContext } from '../context/AuthContext';
import '../styles/components.css';

export const UserProfile = () => {
  const { user, signOut } = useAuthContext();

  if (!user) return null;

  const handleSignOut = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await signOut();
    }
  };

  return (
    <div className="user-profile">
      <div className="user-info">
        {user.user_metadata?.avatar_url && (
          <img
            src={user.user_metadata.avatar_url}
            alt={user.user_metadata?.full_name || 'Usuario'}
            className="user-avatar"
          />
        )}
        <div className="user-details">
          <span className="user-name">
            {user.user_metadata?.full_name || user.email}
          </span>
          <span className="user-email">{user.email}</span>
        </div>
      </div>
      <button className="btn btn-secondary btn-small" onClick={handleSignOut}>
        Salir
      </button>
    </div>
  );
};
