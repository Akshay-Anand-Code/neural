import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import DashboardLayout from './layouts/DashboardLayout';
import Manifesto from './pages/Manifesto';
import Agents from './pages/Agents';
import IlluminatiCursor from './components/IlluminatiCursor';
import PersistentBackground from './components/PersistentBackground';

export default function App() {
  return (
    <StrictMode>
      <BrowserRouter>
        <IlluminatiCursor />
        <PersistentBackground />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Manifesto />} />
            <Route path="agents" element={<Agents />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}