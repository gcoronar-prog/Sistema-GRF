import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { token } = useParams();

  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${servidor}/reset/pass`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      alert("Contraseña cambiada");
      navigate("/sgf/v1/login");
    } catch (error) {
      alert("Token inválido o expirado");
      console.error(err);
    }
  };

  return (
    <>
      <form onSubmit={handleReset}>
        <label htmlFor="">Contraseña nueva</label>
        <input
          type="text"
          name="user_password"
          value={password}
          onChange={(e) => e.target.value}
        />
        <button type="submit">Crear</button>
      </form>
    </>
  );
}

export default ChangePassword;
