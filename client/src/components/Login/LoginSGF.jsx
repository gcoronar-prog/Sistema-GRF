import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginSGF() {
  const defaultValues = {
    user_name: "",
    password: "",
  };

  const navigate = useNavigate();

  const [login, setLogin] = useState(defaultValues);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(login),
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data);
        localStorage.setItem("token", data.msg);
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  return (
    <div>
      <h4>Login SGF</h4>

      <form onSubmit={handleSubmit}>
        <label htmlFor="">Usuario</label>
        <input
          type="text"
          name="user_name"
          onChange={handleChanges}
          value={login.user_name}
        />
        <label htmlFor="">Contraseña</label>
        <input
          type="password"
          name="password"
          onChange={handleChanges}
          value={login.password}
        />

        <button type="submit">Acceder</button>
      </form>
    </div>
  );
}

export default LoginSGF;
