import { jwtDecode } from "jwt-decode";

let expirado = 0;

export const AuthHome = async ({ navigate, setUserData }) => {
  const token = localStorage.getItem("token");

  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const expirationTime = decoded.exp - currentTime;

      if (expirationTime <= 0) {
        alert("Tu sesión ha expirado.");
        localStorage.removeItem("token");
        navigate("/sgf/v1/login/");
      }

      if (expirado) {
        clearTimeout(expirado);
      }
      expirado = setTimeout(() => {
        alert("Tu sesión ha expirado.");
        localStorage.removeItem("token");
        navigate("/sgf/v1/login/");
      }, expirationTime * 1000);

      const res = await fetch(
        `${import.meta.env.VITE_SERVER_ROUTE_BACK}/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        throw new Error("No autorizado");
      }

      const data = await res.json();
      setUserData(data.msg[0]);
    } catch (error) {
      console.error("Error en autenticación:", error);
      localStorage.removeItem("token");
      navigate("/sgf/v1/login/");
    }
  } else {
    alert("No hay token, inicia sesión.");
    navigate("/sgf/v1/login/");
  }
};
