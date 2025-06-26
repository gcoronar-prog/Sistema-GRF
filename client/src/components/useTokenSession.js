import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";

export function useTokenSession() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const timeoutRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("No hay token, inicia sesión.");
      navigate("/sgf/v1/login/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expirationTime = decoded.exp - currentTime;

      if (expirationTime <= 0) {
        alert("Tu sesión ha expirado.");
        localStorage.removeItem("token");
        navigate("/sgf/v1/login/");
        return;
      }

      timeoutRef.current = setTimeout(() => {
        alert("Tu sesión ha expirado.");
        localStorage.removeItem("token");
        navigate("/sgf/v1/login/");
      }, expirationTime * 1000);

      fetch(`${import.meta.env.VITE_SERVER_ROUTE_BACK}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("No autorizado");
          return res.json();
        })
        .then((data) => {
          console.log("Usuario cargado:", data.msg[0]);
          setUserData(data.msg[0]);
        })
        .catch((err) => {
          console.error("Error al obtener el perfil:", err);
          localStorage.removeItem("token");
          navigate("/sgf/v1/login/");
        });
    } catch (err) {
      localStorage.removeItem("token");
      navigate("/sgf/v1/login/");
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [navigate]);

  return userData;
}
