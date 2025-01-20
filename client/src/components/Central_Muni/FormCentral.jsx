import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TableContainer,
  TextField,
  OutlinedInput,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import CancelIcon from "@mui/icons-material/Cancel";
import AddIcon from "@mui/icons-material/Add";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import { useEffect, useState, useRef } from "react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
//import AccionesComponent from "./FormAcciones";
import dayjs from "dayjs";
import AttachFiles from "../AttachFiles";

function FormCentral() {
  const navigate = useNavigate();
  const params = useParams();

  const [reportesCentral, setReportesCentral] = useState({
    id_reporte: "",
    fecha_ocurrencia: "",
    estado: "",
    fuente_captura: "",
    origen_captura: "",
    clasificacion: "",
    desc_reporte: "",
    vehiculo: [],
    acompanante: [],
    fecha_cierre: null,
    recursos: [],
    otro_recurso: "",
    id_informante: "",
    id_sector: "",
    id_funcionario: "PRB",
    direccion: "",
    coordenadas: "",
    id_tipo_reporte: "",
    id_user_central: "",
    id_origen: "",
  });

  const [editing, setEditing] = useState(false);
  const [modeloVista, setModeloVista] = useState(false);
  const [initialD, setInitialD] = useState(null);
  const [showCancel, setShowCancel] = useState(false);

  const [checkboxRecursos, setCheckboxRecursos] = useState(false);

  const [origenes, setOrigen] = useState([]);
  const [informantes, setInformantes] = useState([]);
  const [tiposReports, setTiposReports] = useState([]);
  const [Vehiculos, setVehiculos] = useState([]);
  const [companion, setCompanion] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [lastReports, setLastReports] = useState([]);

  // const [listaAcciones, setListaAcciones] = useState([]);
  const [idReportes, setIdReportes] = useState([]);
  const [lastIds, setLastIds] = useState(null);

  const [showAction, setShowAction] = useState(false);
  const [showAttach, setShowAttach] = useState(false);
  const [showResource, setShowResource] = useState(false);

  const [selectedValue, setSelectedValue] = useState("");
  const [selectVehiculo, setSelectVehiculo] = useState([]);
  const [selectTripulante, setSelectTripulante] = useState([]);
  const [selectSector, setSelectSector] = useState("");
  const [selectOrigen, setSelectOrigen] = useState("");
  const [selectInformante, setSelectInformante] = useState("");
  const [autocompleteInstance, setAutocompleteInstance] = useState(null);
  const [inputs, setInputs] = useState("");

  useEffect(() => {
    loadOrigen();
    loadInformante();
    loadTipoReport();
    loadVehiculo();
    loadTripulante();
    loadSectores();
    loadLastReport();
    loadIdReportes();
  }, []);

  useEffect(() => {
    if (params.id) {
      loadReportes(params.id);
      setShowCancel(false);
      setEditing(true);
    } else {
      setReportesCentral({
        id_reporte: "",
        fecha_ocurrencia: "",
        estado: "",
        fuente_captura: "",
        origen_captura: "",
        clasificacion: "",
        desc_reporte: "",
        vehiculo: [],
        acompanante: [],
        fecha_cierre: null,
        recursos: [],
        otro_recurso: "",
        id_informante: "",
        id_sector: "",
        id_funcionario: "PRB",
        direccion: "",
        coordenadas: "",
        id_tipo_reporte: "",
        id_user_central: "",
        id_origen: "",
      });
      setSelectVehiculo([]);
      setSelectTripulante([]);
      setShowResource(false);

      setInputs("");
    }
  }, [params.id]);

  const loadIdReportes = async () => {
    const res = await fetch("http://localhost:3000/central", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setIdReportes(data);
  };

  const loadOrigen = async () => {
    const response = await fetch("http://localhost:3000/origenes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setOrigen(data);
  };

  const loadInformante = async () => {
    const response = await fetch("http://localhost:3000/informantes");
    const data = await response.json();
    setInformantes(data);
  };

  const loadTipoReport = async () => {
    const response = await fetch("http://localhost:3000/tipoReportes", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    setTiposReports(data);
  };

  const loadVehiculo = async () => {
    const response = await fetch("http://localhost:3000/vehiculos");
    const data = await response.json();
    setVehiculos(data);
  };

  const loadTripulante = async () => {
    const response = await fetch("http://localhost:3000/tripulantes");
    const data = await response.json();
    setCompanion(data);
  };

  const loadSectores = async () => {
    const response = await fetch("http://localhost:3000/sectores");
    const data = await response.json();
    setSectors(data);
  };

  const loadLastReport = async () => {
    const response = await fetch("http://localhost:3000/central/last/report");
    const data = await response.json();
    setLastIds(data[0].id_reporte);
  };

  const loadReportes = async (id) => {
    const res = await fetch(`http://localhost:3000/central/${id}`);
    const data = await res.json();
    const repo = data[0];
    setInitialD(data);

    setReportesCentral({
      id_reporte: repo.id_reporte,
      fecha_ocurrencia: repo.fecha_ocurrencia,
      estado: repo.estado,
      fuente_captura: repo.fuente_captura,
      clasificacion: repo.clasificacion,
      desc_reporte: repo.desc_reporte,
      vehiculo: repo.vehiculo,
      acompanante: repo.acompanante,
      fecha_cierre: null,
      recursos: repo.recursos,
      otro_recurso: repo.otro_recurso,
      id_informante: repo.id_informante,
      id_sector: repo.id_sector,
      id_funcionario: "PRB",
      direccion: repo.direccion,
      coordenadas: repo.coordenadas,
      id_tipo_reporte: repo.id_tipo_reporte,
      id_user_central: null,
      id_origen: repo.id_origen,
    });
    setSelectVehiculo(repo.vehiculo);
    setSelectTripulante(repo.acompanante);
    setInputs(repo.direccion);

    if (repo.recursos.includes("Otro")) {
      setShowResource(true);
    } else {
      setShowResource(false);
    }
    console.log(reportesCentral);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos que se envían: ", reportesCentral);

    if (params.id) {
      const res = await fetch(`http://localhost:3000/central/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportesCentral),
      });
      setInitialD([reportesCentral]);
      console.log("initial d", initialD[0]);

      if (!res.ok) {
        throw new Error("Error de envio de datos");
      }

      navigate(`/reports/${params.id}/edit`);
    } else {
      try {
        const res = await fetch("http://localhost:3000/central", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reportesCentral),
        });

        if (!res.ok) {
          throw new Error("Error de envio de datos");
        }
        const data = await res.json();
        console.log(data);
        navigate("/");
      } catch (error) {
        console.error("Error de solicitud", error.message);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReportesCentral({
      ...reportesCentral,
      [name]: value,
    });
  };

  const handleNewReport = () => {
    setEditing(!editing);
    navigate("/reports/new");
    setShowCancel(true);
  };

  const handleInputChange = (event) => {
    setInputs(event.target.value);
  };

  const handleChangeSubmit = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD HH:mm:ss");
    setReportesCentral({
      ...reportesCentral,
      fecha_ocurrencia: formattedDate,
    });
  };

  const handleChangeCompanion = (event) => {
    setSelectTripulante(event.target.value);

    setReportesCentral({
      ...reportesCentral,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeReports = (event) => {
    setSelectedValue(event.target.value);

    setReportesCentral((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleChangeSector = (event) => {
    setSelectSector(event.target.value);
    console.log(event.target.name, event.target.value);
    setReportesCentral({
      ...reportesCentral,
      [event.target.name]: event.target.value,
    });

    setReportesCentral({
      ...reportesCentral,
      [event.target.name]: event.target.value,
    });
  };

  const handleChangeInfor = (event) => {
    setSelectInformante(event.target.value);
    setReportesCentral((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleChangeOrigen = (event) => {
    setSelectOrigen(event.target.value);
    setReportesCentral((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleChangeVehi = (event) => {
    setSelectVehiculo(event.target.value);
    setReportesCentral((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
    console.log(reportesCentral.vehiculo);
    console.log(event.target.value);
  };

  const handleNextIdReports = () => {
    // Ordena el array `idReportes` por `id_reporte` de manera ascendente
    const sortedReportes = [...idReportes].sort(
      (a, b) => a.id_reporte - b.id_reporte
    );

    // Busca el índice actual del reporte en el array ordenado
    const currentIndex = sortedReportes.findIndex(
      (element) => element.id_reporte === parseInt(params.id)
    );

    // Verifica si el índice actual es válido y si existe un siguiente reporte
    if (currentIndex !== -1 && currentIndex < sortedReportes.length - 1) {
      // Navega al siguiente reporte en el array ordenado
      const nextId = sortedReportes[currentIndex + 1].id_reporte;
      navigate(`/reports/${nextId}/edit`);
    } else {
      console.log("No hay más reportes disponibles.");
    }
  };

  const handlePrevIdReports = () => {
    // Ordena el array `idReportes` por `id_reporte` de manera descendente
    const sortedReportes = [...idReportes].sort(
      (a, b) => b.id_reporte - a.id_reporte
    );

    // Busca el índice actual del reporte en el array ordenado
    const currentIndex = sortedReportes.findIndex(
      (element) => element.id_reporte === parseInt(params.id)
    );

    // Verifica si el índice actual es válido y si existe un siguiente reporte
    if (currentIndex !== -1 && currentIndex < sortedReportes.length - 1) {
      // Navega al siguiente reporte en el array ordenado
      const prevId = sortedReportes[currentIndex + 1].id_reporte;
      navigate(`/reports/${prevId}/edit`);
    } else {
      console.log("No hay más reportes disponibles.");
    }
  };

  const handleFindId = (event) => {
    const valor = parseInt(event.target.value); // Convertir el valor a número entero
    if (isNaN(valor)) {
      console.log("Por favor ingresa un número válido.");
      return;
    }

    // Verificar si el ID ingresado existe en la lista de reportes
    const reporteExistente = idReportes.some(
      (reporte) => reporte.id_reporte === valor
    );

    if (reporteExistente) {
      // Navegar al reporte si existe
      navigate(`/reports/${valor}/edit`);
    } else {
      console.log("El reporte con este ID no existe.");
    }
  };

  const handleLastReports = async () => {
    const sortedReportes = [...idReportes].sort(
      (a, b) => b.id_reporte - a.id_reporte
    );

    const lastIndex = sortedReportes[0].id_reporte;

    navigate(`/reports/${lastIndex}/edit`);
    console.log(lastIndex);
  };

  const handleFirstReports = async () => {
    const sortedReportes = [...idReportes].sort(
      (a, b) => a.id_reporte - b.id_reporte
    );

    const firstIndex = sortedReportes[0].id_reporte;
    navigate(`/reports/${firstIndex}/edit`);
  };

  const handleCheckboxChecked = (e) => {
    const { name, value, checked } = e.target;

    setCheckboxRecursos(checked);
    if (value === "Otro") {
      setShowResource(!showResource);
      setReportesCentral((prevState) => ({
        ...prevState,
        otro_recurso: "",
      }));
    }
    if (checked) {
      setReportesCentral((prevState) => ({
        ...prevState,
        [name]: [...(prevState[name] || []), value],
      }));
    } else {
      setReportesCentral((prevState) => ({
        ...prevState,
        [name]: prevState[name].filter((item) => item !== value), // Filtra y elimina el valor si está desmarcado
      }));
    }

    console.log(name, value, checked, reportesCentral.recursos);
  };

  const handlePlaceSelect = () => {
    if (autocompleteInstance) {
      const place = autocompleteInstance.getPlace();
      if (place) {
        const formattedAddress = place.formatted_address;
        const location = place.geometry.location;

        setReportesCentral((prevState) => ({
          ...prevState,
          direccion: formattedAddress,
          coordenadas: {
            lat: location.lat(),
            lng: location.lng(),
          },
        }));

        // Actualizar el campo de entrada con la dirección seleccionada
        setInputs(formattedAddress);
      }
    }
  };

  const handleCancel = async () => {
    setEditing(!editing);
    if (editing === false) {
      setReportesCentral(initialD[0]);
    }
    console.log("Valor inicial", initialD[0]);

    console.log(editing);
  };

  const handleDeleteReports = async () => {
    const id = params.id;
    await fetch(`http://localhost:3000/central/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    setIdReportes(idReportes.filter((r) => r.id_reporte !== parseInt(id)));
    navigate(`/reports/${lastIds}/edit`);
    //window.location.reload();
  };

  return (
    <Grid2 container>
      <Typography variant="h3">Reportes de Central Municipal</Typography>
      <form action="" onSubmit={handleSubmit}>
        <Grid2 size={12}>
          <fieldset>
            <legend>Reportes Central</legend>

            <Card
              variant="outlined"
              className="cardCentral1"
              sx={{ borderWidth: "5px" }}
            >
              <Box>
                <CardContent sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    sx={{ mr: -2 }}
                    size="large"
                    onClick={handleFirstReports}
                  >
                    <SkipPreviousIcon />
                  </IconButton>
                  <IconButton onClick={handlePrevIdReports}>
                    <ArrowBackIosNewIcon />
                  </IconButton>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" gutterBottom></Typography>

                    <TextField
                      label="N° Reporte"
                      variant="outlined"
                      value={reportesCentral.id_reporte || ""}
                      //defaultValue={reportesCentral.id_reporte}
                      sx={{
                        width: 120,
                        pointerEvents: "none",
                      }}
                    />
                  </Box>

                  <IconButton sx={{ mr: -2 }} onClick={handleNextIdReports}>
                    <ArrowForwardIosIcon />
                  </IconButton>
                  <IconButton size="large" onClick={handleLastReports}>
                    <SkipNextIcon />
                  </IconButton>
                  <Box flex={1} p={2}>
                    <fieldset>
                      <Typography>Info del usuario</Typography>
                      <Typography>Info del usuario</Typography>
                      <Typography>Info del usuario</Typography>
                    </fieldset>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          </fieldset>

          <fieldset>
            <legend>Fecha y origen de reportes</legend>
            <Card
              variant="outlined"
              className="cardCentral1"
              sx={{ borderWidth: "5px" }}
            >
              <Box display={"flex"} justifyContent={"space-between"}>
                <Box flex={1} p={2}>
                  <CardContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateTimePicker
                        name="fecha_ocurrencia"
                        label="Seleccione fecha y hora"
                        sx={{
                          mb: 1,
                          width: 250,
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        onChange={handleChangeSubmit}
                        value={dayjs(reportesCentral.fecha_ocurrencia)}
                      />
                    </LocalizationProvider>
                    <FormControl fullWidth>
                      <InputLabel id="origenReportesLabel">
                        Origen Información
                      </InputLabel>
                      <Select
                        name="id_origen"
                        label="Origen información"
                        labelId="origenReportesLabel"
                        sx={{
                          mb: 1,
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        onChange={handleChangeOrigen}
                        value={reportesCentral.id_origen}
                      >
                        {origenes.map((o) => (
                          <MenuItem key={o.id_origen} value={o.id_origen}>
                            {o.origen}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="personaInformanteLabel">
                        Persona Informante
                      </InputLabel>
                      <Select
                        name="id_informante"
                        labelId="personaInformanteLabel"
                        label="Persona Informante"
                        sx={{
                          mb: 1,
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        onChange={handleChangeInfor}
                        value={reportesCentral.id_informante}
                        defaultValue=""
                      >
                        {informantes.map((informa) => (
                          <MenuItem
                            key={informa.id_informante}
                            value={informa.id_informante}
                          >
                            {informa.informante}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Typography variant="span">
                      {informantes.telefono}
                    </Typography>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl>
                      <FormLabel id="fuenteCaptura">
                        Fuente de Captura
                      </FormLabel>
                      <RadioGroup
                        name="fuente_captura"
                        onChange={handleChange}
                        value={reportesCentral.fuente_captura}
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                      >
                        <Box display={"flex"}>
                          <Box flex={1}>
                            <FormControlLabel
                              control={<Radio />}
                              value="radio"
                              label="Radio"
                            />
                            <FormControlLabel
                              control={<Radio />}
                              value="telefono"
                              label="Teléfono"
                            />
                            <FormControlLabel
                              control={<Radio />}
                              value="whatsapp"
                              label="Whatsapp"
                            />
                          </Box>
                          <Box flex={1}>
                            <FormControlLabel
                              control={<Radio />}
                              value="RRSS"
                              label="RRSS"
                            />
                            <FormControlLabel
                              control={<Radio />}
                              value="e-mail"
                              label="E-mail"
                            />
                            <FormControlLabel
                              control={<Radio />}
                              value="presencial"
                              label="Presencial"
                            />
                          </Box>
                        </Box>
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl>
                      <FormLabel id="clasificacion">Clasificación</FormLabel>
                      <RadioGroup
                        name="clasificacion"
                        onChange={handleChange}
                        value={reportesCentral.clasificacion}
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                      >
                        <FormControlLabel
                          control={<Radio />}
                          value="emergencia"
                          label="Emergencia"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          value="incidente"
                          label="Incidente"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          value="Factor de Riesgo"
                          label="Factor de Riesgo"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          value="novedad"
                          label="Novedad"
                        />
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl>
                      <FormLabel id="estadoReportes">Estado reporte</FormLabel>
                      <RadioGroup
                        name="estado"
                        onChange={handleChange}
                        value={reportesCentral.estado}
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                      >
                        <FormControlLabel
                          control={<Radio />}
                          value="Pendiente"
                          label="Pendiente"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          value="En progreso"
                          label="En progreso"
                        />
                        <FormControlLabel
                          control={<Radio />}
                          value="Atendido"
                          label="Atendido"
                        />
                      </RadioGroup>
                    </FormControl>
                  </CardContent>
                </Box>
              </Box>
            </Card>
          </fieldset>
        </Grid2>

        <Grid2 size={12}>
          <fieldset>
            <legend>Descripción y Vehículos utilizados</legend>
            <Card variant="outlined" sx={{ borderWidth: "5px" }}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl fullWidth>
                      <InputLabel id="tiposReportes">
                        Tipo de Reporte
                      </InputLabel>
                      <Select
                        name="id_tipo_reporte"
                        label="tipo de reporte"
                        defaultValue={""}
                        labelId="tiposReportes"
                        value={reportesCentral.id_tipo_reporte}
                        sx={{
                          mb: 1,
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        onChange={handleChangeReports}
                      >
                        {tiposReports.map((tipo) => (
                          <MenuItem key={tipo.id_tipo} value={tipo.id_tipo}>
                            {tipo.descripcion}
                          </MenuItem>
                        ))}
                      </Select>
                      <TextField label="Especifique reporte" />
                    </FormControl>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl fullWidth>
                      <InputLabel id="selectVehiculosLabel">
                        Vehículos
                      </InputLabel>
                      <Select
                        name="vehiculo"
                        multiple
                        value={selectVehiculo}
                        onChange={handleChangeVehi}
                        input={<OutlinedInput label="Vehículos" />}
                        sx={{
                          mb: 1,
                          width: 300,
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                      >
                        {Vehiculos.map((vehi) => (
                          <MenuItem
                            key={vehi.id_vehiculo}
                            value={vehi.vehiculo}
                          >
                            {vehi.vehiculo}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControl fullWidth>
                      <InputLabel id="labelSelectTripulantes">
                        Tripulantes
                      </InputLabel>
                      <Select
                        name="acompanante"
                        multiple
                        value={selectTripulante}
                        onChange={handleChangeCompanion}
                        labelId="labelSelectTripulantes"
                        label="Tripulantes"
                        sx={{
                          width: 300,
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                      >
                        {companion
                          .filter((tripu) => tripu && tripu.funcionario)
                          .map((tripu) => (
                            <MenuItem
                              key={tripu.id_funcionario}
                              value={tripu.funcionario}
                            >
                              {tripu.funcionario}
                            </MenuItem>
                          ))}
                        <MenuItem>Carabineros</MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <TextField
                      name="desc_reporte"
                      value={reportesCentral.desc_reporte}
                      multiline
                      variant="outlined"
                      label="Descripción del Reporte"
                      rows={6}
                      fullWidth
                      onChange={handleChange}
                      sx={{
                        pointerEvents:
                          editing && reportesCentral.id_reporte
                            ? "none"
                            : "auto",
                      }}
                    />
                  </CardContent>
                </Box>
              </Box>
            </Card>
          </fieldset>
          <fieldset>
            <legend>Ubicación</legend>
            <Card variant="outlined" sx={{ borderWidth: "5px" }}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl fullWidth>
                      <InputLabel id="labelSelectSector">Sector</InputLabel>
                      <Select
                        name="id_sector"
                        labelId="labelSelectSector"
                        label="Sector"
                        value={reportesCentral.id_sector}
                        defaultValue={""}
                        onChange={handleChangeSector}
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                      >
                        {sectors.map((s) => (
                          <MenuItem key={s.id_sector} value={s.id_sector}>
                            {s.sector}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <LoadScript
                      googleMapsApiKey="AIzaSyDGmGKTyNcNEeOo77q66PcXvjKaB6zMlqY"
                      libraries={["places"]}
                    >
                      <Autocomplete
                        onLoad={(autocomplete) =>
                          setAutocompleteInstance(autocomplete)
                        }
                        onPlaceChanged={handlePlaceSelect}
                      >
                        <TextField
                          name="direccion"
                          label="Escribe una dirección"
                          variant="outlined"
                          fullWidth
                          value={inputs} // Mostramos lo que el usuario escribe o la dirección seleccionada
                          onChange={handleInputChange} // Actualizamos el texto del usuario
                          sx={{
                            pointerEvents:
                              editing && reportesCentral.id_reporte
                                ? "none"
                                : "auto",
                          }}
                        />
                      </Autocomplete>
                    </LoadScript>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}></Box>
              </Box>
            </Card>
          </fieldset>
          <fieldset>
            <legend>Recursos involucrados</legend>
            <Card variant="outlined" sx={{ borderWidth: "5px" }}>
              <Box display={"flex"} justifyContent={"space-between"}>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl>
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Bomberos"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Bomberos"
                            )}
                          />
                        }
                        label="Bomberos"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Carabineros"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Carabineros"
                            )}
                          />
                        }
                        label="Carabineros"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Chilquinta"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Chilquinta"
                            )}
                          />
                        }
                        label="Chilquinta"
                      />
                      <FormControlLabel control={<Checkbox />} label="Esval" />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Operaciones"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Operaciones"
                            )}
                          />
                        }
                        label="Operaciones"
                      />
                    </FormControl>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl>
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="SAMU"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes("SAMU")}
                          />
                        }
                        label="SAMU"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Central cámaras"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Central cámaras"
                            )}
                          />
                        }
                        label="Central cámaras"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Empresas de Telecom."
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Empresas de Telecom."
                            )}
                          />
                        }
                        label="Empresas de Telecom."
                      />
                      <FormControlLabel control={<Checkbox />} label="GRD" />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Alumbrado público"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Alumbrado público"
                            )}
                          />
                        }
                        label="Alumbrado público"
                      />
                    </FormControl>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl>
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="CONAF"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes("CONAF")}
                          />
                        }
                        label="CONAF"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Armada"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Armada"
                            )}
                          />
                        }
                        label="Armada"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Ejército"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Ejército"
                            )}
                          />
                        }
                        label="Ejército"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Patrullaje preventivo"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Patrullaje preventivo"
                            )}
                          />
                        }
                        label="Patrullaje preventivo"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Patrullaje mixto"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Patrullaje mixto"
                            )}
                          />
                        }
                        label="Patrullaje mixto"
                      />
                    </FormControl>
                  </CardContent>
                </Box>
                <Box flex={1} p={2}>
                  <CardContent>
                    <FormControl>
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Inspección"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Inspección"
                            )}
                          />
                        }
                        label="Inspección municipal"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Autopista"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Autopista"
                            )}
                          />
                        }
                        label="Autopista"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="SENAPRED"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "SENAPRED"
                            )}
                          />
                        }
                        label="SENAPRED"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Semáforos"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes(
                              "Semáforos"
                            )}
                          />
                        }
                        label="Semáforos"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="DIMAO"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes("DIMAO")}
                          />
                        }
                        label="DIMAO"
                      />
                      <FormControlLabel
                        sx={{
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                        control={
                          <Checkbox
                            name="recursos"
                            value="Otro"
                            onChange={handleCheckboxChecked}
                            checked={reportesCentral.recursos.includes("Otro")}
                          />
                        }
                        label="Otro"
                      />

                      <TextField
                        name="otro_recurso"
                        value={reportesCentral.otro_recurso || ""}
                        rows={2}
                        multiline
                        onChange={handleChange}
                        sx={{
                          display: showResource ? "auto" : "none",
                          pointerEvents:
                            editing && reportesCentral.id_reporte
                              ? "none"
                              : "auto",
                        }}
                      />
                    </FormControl>
                  </CardContent>
                </Box>
              </Box>

              <Box
                display={"flex"}
                justifyContent={"center"}
                gap={2}
                mt={2}
                mb={6}
              >
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  size="large"
                  sx={{ display: editing ? "auto" : "none" }}
                  onClick={handleNewReport}
                >
                  Nuevo Reporte
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  color="success"
                  size="large"
                  type="submit"
                  sx={{
                    display: editing ? "none" : "auto",
                  }}
                  onClick={() => setEditing(!editing)}
                >
                  Guardar
                </Button>
                {showCancel && (
                  <Button onClick={handleLastReports}>Cancelar</Button>
                )}
                <Button
                  variant="contained"
                  startIcon={editing ? <EditIcon /> : <CancelIcon />}
                  color={editing ? "warning" : "error"}
                  size="large"
                  onClick={handleCancel}
                  sx={{ display: !params.id ? "none" : "" }}
                >
                  {editing ? "Editar" : "Cancelar"}
                </Button>
                <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  color="error"
                  size="large"
                  onClick={handleDeleteReports}
                  sx={{ display: !params.id ? "none" : "" }}
                >
                  Eliminar
                </Button>
                <Button
                  variant="contained"
                  startIcon={<CloudUploadIcon />}
                  color="success"
                  size="large"
                  onClick={() => setShowAttach(!showAttach)}
                  disabled={!params.id}
                >
                  Adjuntar Archivo
                </Button>
              </Box>
            </Card>
          </fieldset>
        </Grid2>
      </form>

      {showAttach && params.id && (
        <div>
          <AttachFiles />
        </div>
      )}
    </Grid2>
  );
}

export default FormCentral;
