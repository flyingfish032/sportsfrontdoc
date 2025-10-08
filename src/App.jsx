// src/App.jsx
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LeaguesPage from './pages/LeaguesPage';
import MatchesPage from './pages/MatchesPage';
import PlayersPage from './pages/PlayersPage';
import TeamsPage from './pages/TeamsPage';
import ScoresPage from './pages/ScoresPage';
import SeriesPage from './pages/SeriesPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import ViewerPage from './pages/ViewerPage';
import Navbar from './components/Navbar'; // Coming up next

function ProtectedRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const location = useLocation();
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  const hideNavbarOnRoutes = ['/viewer', '/login'];
  const shouldShowNavbar = token && !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} /> 
        <Route path="/login" element={<LoginPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/leagues" element={<ProtectedRoute><LeaguesPage /></ProtectedRoute>} />
        <Route path="/matches" element={<ProtectedRoute><MatchesPage /></ProtectedRoute>} />
        <Route path="/players" element={<ProtectedRoute><PlayersPage /></ProtectedRoute>} />
        <Route path="/teams" element={<ProtectedRoute><TeamsPage /></ProtectedRoute>} />
        <Route path="/scores" element={<ProtectedRoute><ScoresPage /></ProtectedRoute>} />
        <Route path="/series" element={<ProtectedRoute><SeriesPage /></ProtectedRoute>} />
        <Route path="/viewer" element={<ProtectedRoute><ViewerPage /></ProtectedRoute>} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
