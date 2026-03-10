// Componente Header

import { useAuthContext } from '../context/AuthContext';
import mascotaImg from '../assets/mascota.png';
import '../styles/components.css';

const normalizeFirstName = (fullName: string): string => {
  const firstName = fullName.trim().split(' ')[0];
  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Buenos días';
  if (hour >= 12 && hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

export const Header = () => {
  const { user, isAuthenticated } = useAuthContext();

  const userName = isAuthenticated && user?.user_metadata?.full_name
    ? normalizeFirstName(user.user_metadata.full_name)
    : '';

  const greeting = isAuthenticated && userName ? `${getGreeting()}, ${userName}` : '';

  return (
    <header className="header">
      <div className="header-left">
        <h1>Gastor AI</h1>
        {greeting && <div className="header-greeting">{greeting}</div>}
      </div>
      <img src={mascotaImg} alt="Mascota Gastor AI" className="header-mascot" />
    </header>
  );
};
