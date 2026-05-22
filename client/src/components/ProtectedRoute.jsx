import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); // or check cookie/userType
  const isGuest = localStorage.getItem('userType') === 'guest';
  
  const isAuthenticated = token || isGuest;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
