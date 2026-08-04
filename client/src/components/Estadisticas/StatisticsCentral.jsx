import { useState, useRef, useEffect } from "react";
import SelectOrigin from "../SelectOrigin";
import SelectSector from "../SelectSector";
import SelectVehiculo from "../SelectVehiculo";
import SelectTipo from "../SelectTipo";
import SelectRecursos from "../SelectRecursos";
import dayjs from "dayjs";
import SelectClasifica from "../SelectClasifica";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { exportExcel } from "../exportExcel.js";
import RecursosCentralPDF from "../PDFs/RecursosCentralPDF.jsx";
import ClasifCentralPDF from "../PDFs/ClasifCentralPDF.jsx";
import OrigenCentralPDF from "../PDFs/OrigenCentralPDF.jsx";
import RangoCentralPDF from "../PDFs/RangoCentralPDF.jsx";
import EstadoCentralPDF from "../PDFs/EstadoCentralPDF.jsx";
import SelectUsers from "./SelectUsers.jsx";
import UserCentralPDF from "../PDFs/UserCentralPDF.jsx";
import VehiculoCentralPDF from "../PDFs/VehiculoCentralPDF.jsx";
import { useReactToPrint } from "react-to-print";
import ListCentralPDF from "../PDFs/ListCentralPDF.jsx";
import MultiSelectDropdown from "../MultiSelectDropdown.jsx";

function StatisticsCentral() {
  const startMonth = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm");
  const dateNow = dayjs().format("YYYY-MM-DDTHH:mm");

  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");

  const defaultValues = {
    fechaInicio: startMonth,
    fechaFin: dateNow,
    estado: "",
    clasificacion: "",
    captura: "",
    origen: "",
    recursos: "",
    sector: "",
    vehiculo: "",
    centralista: "",
    tipoReporte: "",
  };

  const [central, setCentral] = useState([]);
  const [lista, setLista] = useState([]);
  const printRef = useRef(null);
  const [fechaInicio, setFechaInicio] = useState(startMonth);
  const [fechaFin, setFechaFin] = useState(dateNow);
  const [selectedOrigen, setSelectedOrigen] = useState([]);
  const [selectedSector, setSelectedSector] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState([]);
  const [selectedTipo, setSelectedTipo] = useState([]);
  const [selectedRecursos, setSelectedRecursos] = useState([]);
  const [selectedClasif, setSelectedClasif] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [origen, setOrigen] = useState([]);
  const [sector, setSector] = useState([]);
  const [tipo, setTipo] = useState([]);
  const [recursos, setRecursos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [users, setUsers] = useState([]);

  /*const [rangoFilter, setRangoFilter] = useState([]);
  const [clasifFilter, setClasifFilter] = useState(defaultValues);
  const [origenFilter, setOrigenFilter] = useState(defaultValues);
  const [recursosFilter, setRecursosFilter] = useState([]);*/
  const [estadoFilter, setEstadoFilter] = useState({
    atendido: false,
    progreso: false,
    pendiente: false,
  });
  const [capturaFilter, setCapturaFilter] = useState({
    radios: false,
    telefono: false,
    rrss: false,
    presencial: false,
    email: false,
  });

  const ref = useRef(null);

  const handleMultiSelect = () => {
    const cerrarSiClickAfuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", cerrarSiClickAfuera);
    return () => document.removeEventListener("mousedown", cerrarSiClickAfuera);
  };

  const toggleOpcion = (opcion) => {
    setSelectedRecursos((prev) =>
      prev.includes(opcion)
        ? prev.filter((o) => o !== opcion)
        : [...prev, opcion],
    );
  };

  useEffect(() => {
    handleMultiSelect();
  });

  useEffect(() => {
    loadOrigen();
    loadSector();
    loadTipo();
    loadRecursos();
    loadVehiculos();
    loadUsers();
  }, []);

  useEffect(() => {
    fetchData();
  }, [
    fechaInicio,
    fechaFin,
    estadoFilter,
    capturaFilter,
    selectedClasif,
    selectedOrigen,
    selectedSector,
    selectedVehiculo,
    selectedTipo,
    selectedRecursos,
    selectedUser,
  ]);

  const fetchData = async () => {
    let url = `${server_back}/estadisticaCentral?`;
    let params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado) => {
      if (estadoFilter[estado]) {
        params.append("estado", estado);
      }
    });

    Object.keys(capturaFilter).forEach((captura) => {
      if (capturaFilter[captura]) {
        params.append("captura", captura);
      }
    });
    Object.keys(capturaFilter).forEach((captura) => {
      if (capturaFilter[captura]) {
        params.append("captura", captura);
      }
    });

    if (selectedClasif) {
      params.append("clasificacion", selectedClasif);
    }

    if (selectedOrigen) {
      params.append("origen", selectedOrigen);
    }

    if (selectedSector) {
      params.append("sector", selectedSector);
    }

    if (selectedVehiculo) {
      params.append("vehiculo", selectedVehiculo);
    }

    if (selectedTipo) {
      params.append("tipoReporte", selectedTipo);
    }

    if (selectedRecursos) {
      params.append("recursos", JSON.stringify(selectedRecursos));
    }
    const userCentral = selectedUser.value;
    if (selectedUser) {
      params.append("centralista", userCentral);
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      //setCentral(data.informe || []);
      //console.log(data.informe);
      setLista(data.informe);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Informes Central Municipal",
  });

  const handleCheckboxChange = (e) => {
    const { name, checked, dataset, value } = e.target;

    if (dataset.type === "estado") {
      setEstadoFilter((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("estado");
    } else if (dataset.type === "captura") {
      setCapturaFilter((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("captura");
    }
    console.log(name, checked, value);
  };

  const handleClearFilter = () => {
    setFechaInicio(startMonth);
    setFechaFin(dateNow);
    setSelectedOrigen([]);
    setSelectedSector([]);
    setSelectedVehiculo([]);
    setSelectedTipo([]);
    setSelectedRecursos([]);
    setSelectedClasif([]);
    setSelectedUser([]);
    setEstadoFilter({
      atendido: false,
      progreso: false,
      pendiente: false,
    });
    setCapturaFilter({
      radios: false,
      telefono: false,
      rrss: false,
      presencial: false,
      email: false,
    });
    setCentral([]);
  };

  const fetchResumen = async (endpoint, pdf) => {
    const url = `${server_back}/${endpoint}?`;
    let params = new URLSearchParams();

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio); // params.append("let,const de controlador", parametro frontend)
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado) => {
      if (estadoFilter[estado]) {
        params.append("estado", estado);
      }
    });

    Object.keys(capturaFilter).forEach((captura) => {
      if (capturaFilter[captura]) {
        params.append("captura", captura);
      }
    });

    if (selectedClasif) {
      params.append("clasificacion", selectedClasif);
    }

    if (selectedOrigen) {
      params.append("origen", selectedOrigen);
    }

    if (selectedSector) {
      params.append("sector", selectedSector);
    }

    if (selectedVehiculo) {
      params.append("vehiculo", JSON.stringify(selectedVehiculo));
    }

    if (selectedTipo) {
      params.append("tipoReporte", selectedTipo);
    }

    if (selectedRecursos) {
      params.append("recursos", selectedRecursos);
    }

    if (selectedUser) {
      params.append("centralista", selectedUser.value);
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data);
      if (data.informe.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        pdf(data, fechaInicio, fechaFin);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /* const resumenRecursos = () =>
    fetchResumen("resumen_recursos_central", RecursosCentralPDF);
  const resumenClasi = () =>
    fetchResumen("resumen_clasif_central", ClasifCentralPDF);
  const resumenOrigen = () =>
    fetchResumen("resumen_origen_central", OrigenCentralPDF);
  const resumenEstado = () =>
    fetchResumen("resumen_estado_central", EstadoCentralPDF);
  const resumenRango = () =>
    fetchResumen("resumen_rango_central", RangoCentralPDF);
  const resumenUser = () =>
    fetchResumen("resumen_user_central", UserCentralPDF);
  const resumenVehi = () =>
    fetchResumen("resumen_vehi_central", VehiculoCentralPDF);*/

  const loadOrigen = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/origenes`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      setOrigen(data);
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  const loadSector = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/sectores`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      setSector(data);
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  const loadTipo = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(
        `${servidor}/tipoReporte?grupo_reporte=${selectedClasif}`,
      );
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      setTipo(data.tipo);

      return data;
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  const loadRecursos = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/recursos`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      setRecursos(data);
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  const loadVehiculos = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/vehiculos`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      setVehiculos(data);
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  const loadUsers = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const response = await fetch(`${servidor}/users_gie_central`);
      if (!response.ok) {
        throw new Error("Error al cargar los datos");
      }
      const data = await response.json();
      setUsers(data);
      console.log(data);
      return data;
    } catch (err) {
      console.error("Error:", err);
      return [];
    }
  };

  const handlechanges = (e) => {
    const { name, value } = e.target;
    setSelectedOrigen((prev) => (name === "selectedOrigen" ? value : prev));
    setSelectedSector((prev) => (name === "selectedSector" ? value : prev));
    setSelectedClasif((prev) => (name === "selectedClasif" ? value : prev));
    setSelectedTipo((prev) => (name === "selectedTipo" ? value : prev));
    setSelectedUser((prev) => (name === "selectedUser" ? value : prev));

    console.log(name, value);
  };

  const handleRecursosChange = (nuevosValores) => {
    setSelectedRecursos(nuevosValores);
    console.log("selectedRecursos", nuevosValores);
  };

  const handleVehiculosChange = (nuevosValores) => {
    setSelectedVehiculo(nuevosValores);
    console.log("selectedvehiculos", nuevosValores);
  };

  return (
    <>
      <hr />
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Estadísticas Central Municipal</h5>
        </div>
        <div className="card-body">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Fecha de informes</strong>
                </div>
                <div className="card-body">
                  <label htmlFor="fechaInicio" className="form-label fw-bold">
                    Inicio
                  </label>
                  <input
                    className="form-control mb-2"
                    type="datetime-local"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                  <label htmlFor="fechaFin" className="form-label fw-bold">
                    Término
                  </label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Estado Informes</strong>
                </div>
                <div className="card-body">
                  {Object.keys(estadoFilter).map((key) => (
                    <div className="form-check" key={key}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={key}
                        name={key}
                        data-type="estado"
                        value={key}
                        checked={estadoFilter[key] || false}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Captura de Información</strong>
                </div>
                <div className="card-body">
                  {Object.keys(capturaFilter).map((key) => (
                    <div className="form-check" key={key}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={key}
                        name={key}
                        data-type="captura"
                        value={key}
                        checked={capturaFilter[key] || false}
                        onChange={handleCheckboxChange}
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Clasificación</label>
              <select
                name="selectedClasif"
                id="selectedClasif"
                className="form-select"
                onChange={handlechanges}
              >
                <option value="">Selecciones...</option>
                {[
                  { value: 1, label: "Emergencia" },
                  { value: 2, label: "Incidente" },
                  { value: 3, label: "Factor de riesgo" },
                  { value: 4, label: "Novedad" },
                ].map((o) => (
                  <option key={o.value} value={o.label}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Origen</label>
              <select
                name="selectedOrigen"
                id="selectedOrigen"
                className="form-select"
                onChange={handlechanges}
              >
                <option value="">Seleccione...</option>
                {origen.map((o) => (
                  <option key={o.id_origen} value={o.origen}>
                    {o.origen}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold">Sector</label>
              <select
                name="selectedSector"
                id="selectedSector"
                className="form-select"
                onChange={handlechanges}
              >
                <option value="">Seleccione...</option>
                {sector.map((o) => (
                  <option key={o.id_sector} value={o.sector}>
                    {o.sector}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <label className="form-label fw-bold">Tipo de informe</label>
              <select
                name="selectedTipo"
                id="selectedTipo"
                className="form-select"
                onChange={handlechanges}
              >
                <option value="">Seleccione...</option>
                {tipo.map((o) => (
                  <option key={o.id_tipo} value={o.id_tipo}>
                    {o.descripcion}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Recursos</label>
              <MultiSelectDropdown
                opciones={recursos.map((r) => r.recursos)}
                placeholder="Seleccione..."
                onChange={handleRecursosChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Vehículos</label>
              <MultiSelectDropdown
                opciones={vehiculos.map((r) => r.vehiculo)}
                placeholder="Seleccione..."
                onChange={handleVehiculosChange}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label fw-bold">Centralista</label>
              <select
                name="selectedUser"
                id="selectedUser"
                onChange={handlechanges}
                className="form-select"
              >
                <option value="">Seleccione...</option>
                {users.map((o) => (
                  <option key={o.id_user} value={o.user_name}>
                    {o.nombre} {o.apellido}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <hr />

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <strong>Acciones</strong>
            </div>
            <div className="card-body d-flex flex-column gap-3 align-items-center">
              <button className="btn btn-danger w-75" onClick={handlePrint}>
                <i className="bi bi-file-pdf me-1"></i> Descargar PDF
              </button>
              <button
                className="btn btn-success w-75"
                onClick={() => fetchData()}
              >
                <i className="bi bi-file-earmark-excel me-1"></i> Exportar a
                Excel
              </button>
              <button
                className="btn btn-primary w-75"
                onClick={handleClearFilter}
              >
                <i className="bi bi-stars me-1"></i> Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/*<div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <strong>Resumen Estadísticas</strong>
            </div>
            <div className="card-body row g-2">
              {[
                {
                  text: "Recursos involucrados",
                  handler: resumenRecursos,
                },
                {
                  text: "Clasificación",
                  handler: resumenClasi,
                },
                {
                  text: "Origen",
                  handler: resumenOrigen,
                },
                {
                  text: "Rango Horario",
                  handler: resumenRango,
                },
                {
                  text: "Estado Informe",
                  handler: resumenEstado,
                },
                {
                  text: "Informes por centralista",
                  handler: resumenUser,
                },
                {
                  text: "Resumen vehículos",
                  handler: resumenVehi,
                },
              ].map((btn, idx) => (
                <div className="col-md-6" key={idx}>
                  <button
                    className="btn btn-outline-success w-100"
                    onClick={btn.handler}
                  >
                    <i className="bi bi-download me-1"></i> {btn.text}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>*/}
      </div>
      <br />
      <div style={{ display: "none" }}>
        <ListCentralPDF ref={printRef} data={lista} />
      </div>
    </>
  );
}

export default StatisticsCentral;
