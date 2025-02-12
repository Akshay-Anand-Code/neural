import { StrictMode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Welcome from './pages/Welcome';
import DashboardLayout from './layouts/DashboardLayout';
import Manifesto from './pages/Manifesto';
import DataVault from './pages/DataVault';
import NeuralNetwork from './pages/NeuralNetwork';
import ConspiracyBuilder from './pages/ConspiracyBuilder';
import Agents from './pages/Agents';
import IlluminatiCursor from './components/IlluminatiCursor';
import PersistentBackground from './components/PersistentBackground';
import Documentation from './pages/Documentation';

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
            <Route path="vault" element={<DataVault />} />
            <Route path="network" element={<NeuralNetwork />} />
            <Route path="conspiracy" element={<ConspiracyBuilder />} />
          </Route>
          <Route path="docs/*" element={<Documentation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StrictMode>
  );
}