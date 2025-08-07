// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Home from './pages/Home';
import {Sailboat} from "lucide-react";
import Statistics from "./pages/Statistics.jsx";
import Alerts from "./pages/Alerts.jsx";
import AddDomaines from "./pages/AddDomaines.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/Statistics" element={<Statistics />} />
            <Route path="/Alerts" element={<Alerts />} />
            <Route path="/add-domaine" element={<AddDomaines/>} />
        </Routes>
    );
}

export default App;
