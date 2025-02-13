import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { notifications } from '@mantine/notifications';


import { useContext } from 'react';
import { AuthContext } from '@/context/AuthProvider';
//TODO: Recordar en un futuro agregar el import de la notificación y enviarlo por correo
export function MagicLinkJoiner() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token && user?.id) {
      axios
        .post(`${import.meta.env.VITE_API_URL}/poker/magic-link`, {
          token,
          user_id: user.id,
        })
        .then((response) => {
          notifications.show({
            title: 'Éxito',
            message: 'Te has unido a la sala correctamente.',
            color: 'green',
          });
          navigate(`/room/${response.data.sessionId}`);
        })
        .catch((error) => {
          notifications.show({
            title: 'Error',
            message: error.response?.data?.message || error.message,
            color: 'red',
          });
        });
    }
  }, [location.search, navigate, user]);

  return <div>Uniéndote a la sala...</div>;
}
