import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Proposal from './pages/Proposal';
import './static/styles/app.css';
import config from './data/config.json';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:id" element={<Proposal />} />
                <Route path="/" element={config.enableSpecialMode ? <Proposal /> : <Home />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
