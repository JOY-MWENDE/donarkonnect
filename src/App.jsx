// App — root component: providers + router + routes
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth';
import { ToastProvider } from './toast';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
