import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = () => {
    const { isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized) return <div>Chargement...</div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;
