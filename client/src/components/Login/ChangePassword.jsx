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

  const handleChange = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  return (
    <>
      <div className="container min-vh-100 d-flex justify-content-center align-items-center bg-light">
        <div
          className="card shadow-lg p-4"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <div className="card-body">
            <h4 className="card-title text-center mb-4">
              🔐 Cambio de contraseña
            </h4>
            <form onSubmit={handleReset}>
              <div className="mb-3">
                <label htmlFor="user_password" className="form-label">
                  🔒 Contraseña nueva
                </label>
                <input
                  className="form-control"
                  type="password"
                  id="user_password"
                  name="user_password"
                  value={password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Cambiar contraseña
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
