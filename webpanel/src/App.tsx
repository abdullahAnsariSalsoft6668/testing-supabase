import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/AuthContext';
import { AppRouter } from '@/routes/AppRouter';
import { ThemeProvider } from '@/shared/theme/ThemeContext';
import { ToastProvider } from '@/shared/components/ui/Toast';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
