import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import NavbarSGF from "../NavbarSGF";
import SelectLey from "../SelectLey";
import SelectInspect from "../SelectInspect";
import SelectVehContri from "../SelectVehContri";
import SelectSector from "../SelectSector";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import estadoInspeccionPDF from "../PDFs/estadoInspeccionPDF";
import TipoProceInspPDF from "../PDFs/TipoProceInspPDF";
import LeyInspeccionPDF from "../PDFs/LeyInspeccionPDF";
import InspectResumenPDF from "../PDFs/InspectResumenPDF";
import VehiInspectPDF from "../PDFs/VehiInspectPDF";
import SesctorInspectPDF from "../PDFs/SectorInspectPDF";
import GlosaInspectPDF from "../PDFs/GlosaInspectPDF";
import { exportExcel } from "../exportExcel";
import SectorInspectPDF from "../PDFs/SectorInspectPDF";

function StatisticsInspect() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const startDate = dayjs().startOf("month").format("YYYY-MM-DDTHH:mm");
  const datenow = dayjs().format("YYYY-MM-DDTHH:mm");
  const defaultValues = {
    fechaInicioInfrac: startDate,
    fechaFinInfrac: datenow,
    fechaInicioCitacion: "",
    fechaFinCitacion: "",
    fechaInicio: "",
    fechaFin: "",

    estado_exp: "",
    tipo_proce: "",
    jpl: "",
    digitador: "",
    leyes: "",
    inspector: "",

    rut_contri: "",
    tipo_vehiculo: "",
    marca_vehiculo: "",
    sector_infrac: "",
  };

  const [inspeccion, setInspeccion] = useState([]);
  const [fechaInicioInfrac, setFechaInicioInfrac] = useState("");
  const [fechaFinInfrac, setFechaFinInfrac] = useState("");
  const [fechaInicioCitacion, setFechaInicioCitacion] = useState("");
  const [fechaFinCitacion, setFechaFinCitacion] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoFilter, setEstadoFilter] = useState({
    pendiente: false,
    despachado: false,
    resuelto: false,
    nulo: false,
  });
  const [tipoProced, setTipoProced] = useState({
    notificacion: false,
    citacion: false,
    causas: false,
    solicitudes: false,
  });
  const [jplFilter, setJplFilter] = useState({ jpl1: false, jpl2: false });
  const [selectedLey, setSelectedLey] = useState("");
  const [selectedInspect, setSelectedInspect] = useState("");
  const [selectedVeh, setSelectedVeh] = useState("");
  const [selectedTipoVeh, setSelectedTipoVeh] = useState("");
  const [selectedSector, setSelectedSector] = useState("");
  //const [tipoDoc, setTipoDoc] = useState(0);

  const token = localStorage.getItem("token");

  const fetchData = async (tipoDoc) => {
    let url = `${server_back}/estadisticaInspeccion?`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.expedientes.length !== 0) {
        if (tipoDoc === 1) {
          generarPDF(data.expedientes);
        } else if (tipoDoc === 2) {
          exportExcel(data.expedientes, "Expedientes.xlsx", "inspect");
        }
      } else {
        alert("No hay datos para mostrar");
      }

      //exportExcel(data.expedientes, "Expedientes.xlsx");
      setInspeccion(data.expedientes);
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  const generarPDF = (dato) => {
    const doc = new jsPDF({ orientation: "landscape" });

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Expedientes Inspección Municipal", 14, 15);

    let filtros = `Filtros aplicados:\n`;
    if (fechaInicio && fechaFin) {
      filtros += `Fecha: ${new Date(fechaInicio).toLocaleString(
        "es-ES"
      )} - ${new Date(fechaFin).toLocaleString("es-ES")}`;
    }
    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(filtros, 14, 25);

    const tableColumn = [
      "ID Expediente",
      "N° Control",
      "Fecha Infracción",
      "Fecha de Citación",
      "Rut contribuyente",
      "Nombre contribuyente",

      "Inspector",
      "Procedimiento",
      "Estado",
      "Dirección infraccion",
      "Sector",
    ];
    console.log(dato);
    const tableRows = dato.map((c) => [
      c.id_expediente,
      c.num_control,
      new Date(c.fecha_infraccion).toLocaleString("es-ES") || "-",
      new Date(c.fecha_citacion).toLocaleString("es-ES") || "-",
      c.rut_contri || "-",
      c.nombre || "-",
      c.funcionario || "-",
      c.tipo_procedimiento || "-",
      c.estado_exp || "-",
      c.direccion_infraccion || "-",
      c.sector_infraccion || "-",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "grid",
      styles: {
        fontSize: 9,
        cellPadding: 3,
        valign: "middle",
        textColor: 33,
        lineColor: [200, 200, 200],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [33, 37, 41],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        0: { cellWidth: 18 },
        1: { cellWidth: 18 },
        7: { cellWidth: 35 },
        9: { cellWidth: 30 },
      },
    });
    doc.output("dataurlnewwindow");
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, dataset, value } = e.target;

    if (dataset.type === "estado") {
      setEstadoFilter((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("estado");
    } else if (dataset.type === "tipo") {
      setTipoProced((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("tipo");
    } else if (dataset.type === "jpl") {
      setJplFilter((prev) => ({
        ...prev,
        [name]: checked,
      }));
      console.log("jpl");
      console.log(name, checked, value);
    }
  };

  const resumenEstadoInsp = async () => {
    const url = `http://${server_back}/resumen_estado_inspe?`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        estadoInspeccionPDF(
          data.expedientes,
          fechaInicioInfrac,
          fechaFinInfrac,
          fechaInicioCitacion,
          fechaFinCitacion,
          fechaInicio,
          fechaFin
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenTipoExp = async () => {
    const url = `${server_back}/resumen_tipo_inspe?`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        TipoProceInspPDF(
          data.expedientes,
          fechaInicioInfrac,
          fechaFinInfrac,
          fechaInicioCitacion,
          fechaFinCitacion,
          fechaInicio,
          fechaFin
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenLeyInspec = async () => {
    const url = `${server_back}/resumen_ley_inspe?`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        LeyInspeccionPDF(
          data.expedientes,
          fechaInicioInfrac,
          fechaFinInfrac,
          fechaInicioCitacion,
          fechaFinCitacion,
          fechaInicio,
          fechaFin
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenInspector = async () => {
    const url = `${server_back}/resumen_inspector_inspe?`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        InspectResumenPDF(
          data.expedientes,
          fechaInicioInfrac,
          fechaFinInfrac,
          fechaInicioCitacion,
          fechaFinCitacion,
          fechaInicio,
          fechaFin
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenVehi = async () => {
    const url = `${server_back}/resumen_vehi_inspe?`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        VehiInspectPDF(
          data.expedientes,
          fechaInicioInfrac,
          fechaFinInfrac,
          fechaInicioCitacion,
          fechaFinCitacion,
          fechaInicio,
          fechaFin
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenSector = async () => {
    const url = `${server_back}/resumen_sector_inspe?;`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        SectorInspectPDF(
          data.expedientes,
          fechaInicioInfrac,
          fechaFinInfrac,
          fechaInicioCitacion,
          fechaFinCitacion,
          fechaInicio,
          fechaFin
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resumenGlosa = async () => {
    const url = `${server_back}/resumen_glosa_inspe?`;
    let params = new URLSearchParams();

    if (fechaInicioInfrac && fechaFinInfrac) {
      params.append("fechaInicioInfrac", fechaInicioInfrac);
      params.append("fechaFinInfrac", fechaFinInfrac);
    }

    if (fechaInicioCitacion && fechaFinCitacion) {
      params.append("fechaInicioCitacion", fechaInicioCitacion);
      params.append("fechaFinCitacion", fechaFinCitacion);
    }

    if (fechaInicio && fechaFin) {
      params.append("fechaInicio", fechaInicio);
      params.append("fechaFin", fechaFin);
    }

    Object.keys(estadoFilter).forEach((estado_exp) => {
      if (estadoFilter[estado_exp]) {
        params.append("estado_exp", estado_exp);
      }
    });

    Object.keys(tipoProced).forEach((tipo_proce) => {
      if (tipoProced[tipo_proce]) {
        params.append("tipo_proce", tipo_proce);
      }
    });

    Object.keys(jplFilter).forEach((jpl) => {
      if (jplFilter[jpl]) {
        params.append("jpl", jpl);
      }
    });

    if (selectedInspect) {
      params.append("inspector", JSON.stringify(selectedInspect.value));
    }

    if (selectedLey) {
      params.append("leyes", JSON.stringify(selectedLey.value));
    }

    if (selectedSector) {
      params.append("sector_infraccion", JSON.stringify(selectedSector.label));
    }

    if (selectedTipoVeh) {
      params.append("tipo_vehiculo", JSON.stringify(selectedTipoVeh.label));
    }

    if (selectedVeh) {
      params.append("marca_vehiculo", JSON.stringify(selectedVeh.value));
    }

    try {
      const res = await fetch(url + params.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      //console.log(data);
      if (data.expedientes.length === 0) {
        alert("No existen datos para mostrar");
      } else {
        GlosaInspectPDF(
          data.expedientes,
          fechaInicioInfrac,
          fechaFinInfrac,
          fechaInicioCitacion,
          fechaFinCitacion,
          fechaInicio,
          fechaFin
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearFilter = () => {
    setFechaInicioInfrac(startDate);
    setFechaFinInfrac(datenow);
    setFechaInicioCitacion("");
    setFechaFinCitacion("");
    setFechaInicio("");
    setFechaFin("");

    setSelectedSector("");
    setSelectedInspect("");
    setSelectedTipoVeh("");
    setSelectedVeh("");
    setSelectedLey("");
    setEstadoFilter({
      pendiente: false,
      despachado: false,
      resuelto: false,
      nulo: false,
    });
    setTipoProced({
      notificacion: false,
      citacion: false,
      causas: false,
      solicitudes: false,
    });
    setJplFilter({ jpl1: false, jpl2: false });
    setInspeccion([]);
  };

  return (
    <>
      <hr />
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Estadísticas Inspección Municipal</h5>
        </div>

        <div className="card-body">
          {/* Filtros por fecha */}
          <div className="row g-3">
            {[
              {
                title: "Fechas de infracción",
                inicio: fechaInicioInfrac,
                fin: fechaFinInfrac,
                setInicio: setFechaInicioInfrac,
                setFin: setFechaFinInfrac,
                name: "fechaInfraccion",
              },
              {
                title: "Fechas de citación",
                inicio: fechaInicioCitacion,
                fin: fechaFinCitacion,
                setInicio: setFechaInicioCitacion,
                setFin: setFechaFinCitacion,
                name: "fechaCitacion",
              },
              {
                title: "Fecha de creación",
                inicio: fechaInicio,
                fin: fechaFin,
                setInicio: setFechaInicio,
                setFin: setFechaFin,
                name: "fechaCreacion",
              },
            ].map((item, index) => (
              <div className="col-md-4" key={index}>
                <div className="card border-secondary h-100">
                  <div className="card-header">
                    <strong>{item.title}</strong>
                  </div>
                  <div className="card-body">
                    <label className="form-label">Inicio</label>
                    <input
                      type="datetime-local"
                      className="form-control mb-2"
                      value={item.inicio}
                      onChange={(e) => item.setInicio(e.target.value)}
                    />
                    <label className="form-label">Término</label>
                    <input
                      type="datetime-local"
                      className="form-control"
                      value={item.fin}
                      onChange={(e) => item.setFin(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Filtros checkbox */}
          <div className="card mt-4">
            <div className="card-body">
              <div className="row g-4">
                {[
                  {
                    label: "Estado expedientes",
                    options: estadoFilter,
                    type: "estado",
                  },
                  {
                    label: "Tipos de procedimientos",
                    options: tipoProced,
                    type: "tipo",
                  },
                  {
                    label: "Juzgados",
                    options: jplFilter,
                    type: "jpl",
                  },
                ].map((filtro, idx) => (
                  <div className="col-md-4" key={idx}>
                    <strong className="form-label d-block mb-2">
                      {filtro.label}
                    </strong>
                    {Object.keys(filtro.options).map((key) => (
                      <div className="form-check" key={key}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={key}
                          name={key}
                          data-type={filtro.type}
                          value={key}
                          checked={filtro.options[key] || false}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Filtros de texto y select */}
          <div className="card mt-4">
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-4">
                  <label htmlFor="rut_contri" className="form-label fw-bold">
                    Rut Contribuyente
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="rut_contri"
                    name="rut_contri"
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="inspectores" className="form-label fw-bold">
                    Inspectores
                  </label>
                  <SelectInspect
                    id="inspectores"
                    selectedInspect={selectedInspect}
                    setSelectInspect={setSelectedInspect}
                    estadistica={true}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="leyes_1" className="form-label fw-bold">
                    Leyes
                  </label>
                  <SelectLey
                    id="leyes_1"
                    selectedLey={selectedLey}
                    setSelectedLey={setSelectedLey}
                    estadistica={true}
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="marcaVeh" className="form-label fw-bold">
                    Marca Vehículo
                  </label>
                  <SelectVehContri
                    id="marcaVeh"
                    selectedVeh={selectedVeh}
                    setSelectVeh={setSelectedVeh}
                    tipo="marca"
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="tipoVeh" className="form-label fw-bold">
                    Tipo de Vehículo
                  </label>
                  <SelectVehContri
                    id="tipoVeh"
                    selectedVeh={selectedTipoVeh}
                    setSelectVeh={setSelectedTipoVeh}
                    tipo="tipo"
                  />
                </div>
                <div className="col-md-4">
                  <label htmlFor="sectorContri" className="form-label fw-bold">
                    Sector
                  </label>
                  <SelectSector
                    id="sectorContri"
                    selectedSector={selectedSector}
                    setSelectedSector={setSelectedSector}
                    estadistica={true}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr />

      {/* Acciones y resumen */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <strong>Acciones</strong>
            </div>
            <div className="card-body d-flex flex-column gap-3 align-items-center">
              <button
                className="btn btn-danger w-75"
                onClick={() => fetchData(1)}
              >
                <i className="bi bi-file-pdf me-1"></i> Descargar PDF
              </button>
              <button
                className="btn btn-success w-75"
                onClick={() => fetchData(2)}
              >
                <i className="bi bi-file-earmark-excel me-1"></i> Descargar
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

        <div className="col-md-6">
          <div className="card">
            <div className="card-header bg-success text-white">
              <strong>Resumen Estadísticas</strong>
            </div>
            <div className="card-body row g-2">
              {[
                {
                  text: "Resumen estado",
                  handler: resumenEstadoInsp,
                },
                {
                  text: "Resumen tipo",
                  handler: resumenTipoExp,
                },
                {
                  text: "Resumen por Ley",
                  handler: resumenLeyInspec,
                },
                {
                  text: "Resumen por Inspector",
                  handler: resumenInspector,
                },
                {
                  text: "Resumen por Vehículo",
                  handler: resumenVehi,
                },
                {
                  text: "Resumen por Sector",
                  handler: resumenSector,
                },
                {
                  text: "Resumen por Glosa",
                  handler: resumenGlosa,
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
        </div>
      </div>
    </>
  );
}

export default StatisticsInspect;
