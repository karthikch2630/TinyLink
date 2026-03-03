import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import CreateLink from './pages/CreateLink';
import LinkDetails from './pages/LinkDetails';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create" element={<CreateLink />} />
          <Route path="/link/:code" element={<LinkDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
