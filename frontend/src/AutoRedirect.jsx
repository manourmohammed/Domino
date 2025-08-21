import { useEffect } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const AutoRedirect = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Sauvegarder la dernière route visitée (sauf login "/")
    useEffect(() => {
        if (location.pathname !== "/") {
            localStorage.setItem("last_route", location.pathname);
        }
    }, [location]);

    // Rediriger seulement si on est sur "/" et que token existe
    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (token && location.pathname === "/") {
            const lastRoute = localStorage.getItem("last_route") || "/home";
            navigate(lastRoute, { replace: true });
        }
    }, [navigate, location]);


    return <Outlet />; // rend la route enfant
};

export default AutoRedirect;
