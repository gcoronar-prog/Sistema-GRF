import React, { useEffect, useState } from "react";
import ListDespacho from "./ListDespacho";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

function DespachoExp() {
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");

  const [busqueda, setBusqueda] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    jpl: "",
    digitador: "",
  });
  const [expediente, setExpediente] = useState([]);
  const [digitador, setDigitador] = useState([]);

  useEffect(() => {
    selectDigitador();
    //console.log(digitador);
  }, []);

  const buscaExpediente = async (fecha_inicio, fecha_fin, jpl, digitador) => {
    try {
      const res = await fetch(
        `${servidor_local}/search_expediente?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&jpl=${jpl}&digitador=${digitador}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      console.log(data, "expediente busqueda");

      // Guardar en el estado
      setExpediente(data.expedientes || []);
    } catch (error) {
      console.error(error);
    }
  };

  const selectDigitador = async () => {
    try {
      const res = await fetch(`${servidor_local}/digitador`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log(data, "digitadores");
      setDigitador(data.expediente || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setBusqueda((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(value);
  };

  const generarPDF = (dato) => {
    const doc = new jsPDF({ orientation: "landscape" });

    const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
    const logoSegPub = `${import.meta.env.VITE_LOGO_SEG}`;
    doc.addImage(logo, "PNG", 250, 5, 35, 18);
    doc.addImage(logoSegPub, "PNG", 200, 9, 42, 15);

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Expedientes Inspección Municipal", 14, 15);

    let filtros = `Filtros aplicados:\n`;
    if (busqueda.fecha_inicio && busqueda.fecha_fin) {
      filtros += `Fecha: ${new Date(busqueda.fecha_inicio).toLocaleString(
        "es-ES"
      )} - ${new Date(busqueda.fecha_fin).toLocaleString("es-ES")}`;
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

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">
          <strong>Búsqueda de Expedientes</strong>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <label htmlFor="fecha_desp_inicio" className="form-label">
              Desde:
            </label>
            <input
              name="fecha_inicio"
              type="datetime-local"
              className="form-control"
              onChange={handleChanges}
              value={busqueda.fecha_inicio}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="fecha_desp_fin" className="form-label">
              Hasta:
            </label>
            <input
              name="fecha_fin"
              type="datetime-local"
              className="form-control"
              onChange={handleChanges}
              value={busqueda.fecha_fin}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="jpl" className="form-label">
              Juzgado:
            </label>
            <select
              name="jpl"
              id=""
              onChange={handleChanges}
              value={busqueda.jpl}
            >
              <option value="">Seleccione JPL</option>
              <option value="jpl1">JPL 1</option>
              <option value="jpl2">JPL 2</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="digitador" className="form-label">
              Digitador:
            </label>
            <select
              name="digitador"
              id=""
              onChange={handleChanges}
              value={busqueda.digitador}
            >
              {digitador.map((d) => (
                <option key={d.cod_user} value={d.user_name}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-primary"
              onClick={() =>
                buscaExpediente(
                  busqueda.fecha_inicio,
                  busqueda.fecha_fin,
                  busqueda.jpl,
                  busqueda.digitador
                )
              }
            >
              <i className="bi bi-list-columns-reverse"></i> Mostrar lista
            </button>
            <button
              className="btn btn-danger"
              onClick={() => generarPDF(expediente)}
            >
              <i className="bi bi-file-earmark-pdf"></i> Descargar PDF
            </button>
          </div>
          <div className="mt-4">
            <ListDespacho expediente={expediente} />
          </div>
        </div>
      </div>
    </>
  );
}

export default DespachoExp;
