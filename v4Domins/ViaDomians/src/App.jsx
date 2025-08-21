import { Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./AuthContext";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Alerts from "./pages/Alerts";
import Statistics from "./pages/Statistics";
import AddDomaines from "./pages/AddDomaines";
import PrivateRoute from "./PrivateRoute";
import AutoRedirect from "./AutoRedirect";
import { useEffect } from "react";

function AppRoutes() {
    const location = useLocation();

    // Sauvegarder la dernière route visitée (sauf login "/")
    useEffect(() => {
        if (location.pathname !== "/") {
            localStorage.setItem("last_route", location.pathname);
        }
    }, [location]);

    return (
        <Routes>
            {/* Route publique avec AutoRedirect */}
            <Route element={<AutoRedirect />}>
                <Route path="/" element={<Login />} />
            </Route>

            {/* Routes privées */}
            <Route element={<PrivateRoute />}>
                <Route path="/home" element={<Home />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/add-domaine" element={<AddDomaines />} />
            </Route>
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
}
