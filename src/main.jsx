import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from './Home.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<App />} />
      <Route path='home' element={<Home />} />
    </Routes>
  </BrowserRouter>
);
