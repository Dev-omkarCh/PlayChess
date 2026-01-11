import { useNavigate } from 'react-router-dom';

export const useAppNavigator = () => {
  const navigate = useNavigate();

  return {
    // Standard navigation
    goTo: (path) => navigate(path),

    // Navigation that replaces the history (good for redirects)
    replaceWith: (path) => navigate(path, { replace: true }),

    // Go back one page
    goBack: () => navigate(-1),

    // Navigate to a specific route with data (state)
    goToWithData: (path, data) => navigate(path, { state: data }),

    // Common app-specific routes
    goToHome: () => navigate('/'),
    goToLogin: () => navigate('/login'),
    goToSignup: () => navigate('/signup'),
    goToProfile: () => navigate('/profile'),
    goToMenu: () => navigate('/menu'),
  };
};