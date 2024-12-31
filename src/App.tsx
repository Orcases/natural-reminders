/** @jsxImportSource react */
import { HashRouter, Routes, Route } from 'react-router-dom';
import Standup from './pages/Standup/Standup';

const App = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Standup />} />
      </Routes>
    </HashRouter>
  );
};

export default App; 