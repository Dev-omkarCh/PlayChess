import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/authStore';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = () => {
    const { isAuthenticated, loading } = useAuthStore();
    if (loading) return <div className='h-screen w-screen flex justify-center items-center'>
        <LoadingSpinner size={100} />
    </div>;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;