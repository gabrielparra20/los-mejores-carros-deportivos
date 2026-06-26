import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CarPage from './pages/CarPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auto/:id" element={<CarPage />} />
    </Routes>
  );
}

export default App;
