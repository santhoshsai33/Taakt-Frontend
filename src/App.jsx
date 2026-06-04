import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, matchPath } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login/Login';
import NotFound from './pages/NotFound/NotFound';

const isAuthenticated = () => Boolean(localStorage.getItem('authToken'));

const protectedPathPatterns = [
  '/dashboard',
  '/shipments',
  '/shipments/add',
  '/shipments/edit/:id',
  '/shipments/view/:id',
  '/tracking',
  '/reports',
  '/profile',
];

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const ProtectedShell = () => {
  const location = useLocation();
  const isKnownRoute = protectedPathPatterns.some((pattern) =>
    matchPath({ path: pattern, end: true }, location.pathname),
  );

  if (!isKnownRoute) {
    return <NotFound />;
  }

  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
};

function App() {
  return (
    <AppProvider>
      <Router basename="/">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/*" element={
            <ProtectedRoute>
              <ProtectedShell />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </AppProvider>
  );
}

export default App;
