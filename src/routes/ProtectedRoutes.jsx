import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../context/UserContext';

export const ProtectedUserRoute = () => {
  const { user } = useContext(UserContext);
  return user && !user.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export const ProtectedAdminRoute = () => {
  const { user } = useContext(UserContext);
  return user && user.isAdmin ? <Outlet /> : <Navigate to="/login" />;
};