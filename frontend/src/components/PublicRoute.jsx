import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/authStore';

const PublicRoute = () => {
    const { isAuthenticated, loading } = useAuthStore();
    if (loading) return <div>Loading...</div>;

    return !isAuthenticated ? <Outlet /> : <Navigate to="/menu" replace />;
};

export default PublicRoute;
