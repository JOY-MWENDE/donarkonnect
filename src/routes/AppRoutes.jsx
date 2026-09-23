// AppRoutes — all application routes with auth protection
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../auth';
import DashboardLayout from '../components/DashboardLayout';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';
import Donate from '../pages/Donate';
import DonationHistory from '../pages/DonationHistory';
import Notifications from '../pages/Notifications';
import Emergency from '../pages/Emergency';
import NotFound from '../pages/NotFound';

function ProtectedRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function AppRoutes() {
  const { user, ready } = useAuth();

  if (!ready) return null;

  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
      >
        <Route index element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/history" element={<DonationHistory />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/emergency" element={<Emergency />} />
      </Route>

      <Route path="/" element={<Navigate to={user ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
