import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Registration from './pages/Registration';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import JobPage from './pages/JobPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/jobs/:id" element={<ProtectedRoute><JobPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;