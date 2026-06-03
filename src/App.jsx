import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MainLayout from './layouts/MainLayout';
import AppRoutes from './routes/AppRoutes';
import { AppProvider } from './context/AppContext';
import Login from './pages/Login/Login';

const isAuthenticated = () => Boolean(localStorage.getItem('authToken'));

const PublicRoute = ({ children }) => {
  return isAuthenticated() ? <Navigate to="/dashboard" replace /> : children;
};

const ProtectedRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AppProvider>
      <Router basename="/taakt">
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/*" element={
            <ProtectedRoute>
              <MainLayout>
                <AppRoutes />
              </MainLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
      <ToastContainer position="top-right" autoClose={2500} />
    </AppProvider>
  );
}

export default App;
