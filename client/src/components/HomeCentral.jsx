import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarSGF from "./NavbarSGF";

function HomeCentral() {
  const navigate = useNavigate();
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const token = localStorage.getItem("token");
    //console.log("token", token);
    if (!token) {
      navigate("/sgf/v1/login/");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        throw new Error("No autorizado");
      }
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      navigate("/sgf/v1/login/");
    }
  };

  return (
    <>
      <h1>holiii</h1>
      <NavbarSGF />
    </>
  );
}

export default HomeCentral;
