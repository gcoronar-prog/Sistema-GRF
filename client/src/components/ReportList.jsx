import React, { useState, useEffect } from "react";
import { TextField, Button, Select, MenuItem } from "@mui/material";

import { useParams } from "react-router-dom";

function ReportList() {
  const [vehiculo, setVehiculo] = useState([]);
  const [selectVehiculo, setSelectVehiculo] = useState([]);
  const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const params = useParams();

  useEffect(() => {
    loadVehiculo();
  }, []);

  useEffect(() => {
    if (params.id) {
      loadReportes(params.id);
    }
  }, [params.id]);

  const loadVehiculo = async () => {
    const response = await fetch(`${servidor}/vehiculos`);
    const data = await response.json();
    setVehiculo(data);
  };

  const loadReportes = async (id) => {
    const res = await fetch(`${servidor}/central/${id}`);
    const data = await res.json();
    const repo = data[0];
    //setVehiculo(JSON.parse(repo.vehiculo));
    setSelectVehiculo(JSON.parse(repo.vehiculo));
    console.log(repo);
  };

  const handleSelect = (event) => {
    setSelectVehiculo(event.target.value);
    console.log(selectVehiculo);
  };
  return (
    <Select
      multiple
      name="vehiculo"
      value={selectVehiculo}
      onChange={handleSelect}
    >
      {vehiculo.map((v) => (
        <MenuItem key={v.id_vehiculo} value={v.vehiculo}>
          {v.vehiculo}
        </MenuItem>
      ))}
    </Select>
  );
}
export default ReportList;
