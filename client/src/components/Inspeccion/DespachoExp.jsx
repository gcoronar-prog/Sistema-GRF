import React, { useEffect, useState } from "react";
import ListDespacho from "./ListDespacho";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";

function DespachoExp() {
  const servidor_local = import.meta.env.VITE_SERVER_ROUTE_BACK;
  const token = localStorage.getItem("token");

  // Hoy
  /*const hoy = new Date();
  const hoyStr = hoy.toISOString().split("T")[0]; // "2025-09-11"

  // Mañana
  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const ayerStr = ayer.toISOString().split("T")[0]; // "2025-09-12"*/

  const [busqueda, setBusqueda] = useState({
    fecha_inicio: "",
    fecha_fin: "",
    jpl: "",
    digitador: "",
    proceso: "Citación",
  });
  const [expediente, setExpediente] = useState([]);
  const [digitador, setDigitador] = useState([]);

  useEffect(() => {
    selectDigitador();
    //console.log(digitador);
  }, []);

  const buscaExpediente = async (
    fecha_inicio,
    fecha_fin,
    jpl,
    digitador,
    proceso
  ) => {
    try {
      const res = await fetch(
        `${servidor_local}/search_expediente?fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}&jpl=${jpl}&digitador=${digitador}&proceso=${proceso}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      console.log(data, "expediente busqueda");

      if (data.expedientes.length === 0) {
        alert("No existen registros");
      }
      setExpediente(data.expedientes || []);
      console.log(data.expedientes);
    } catch (error) {
      console.error(error);
    }
  };

  const despacharExpe = async (num_expe) => {
    try {
      const ids = num_expe.map((e) => e.id_exp);
      const res = await fetch(`${servidor_local}/despachoExpe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ num_expe: ids }),
      });
      const data = await res.json();
      setExpediente(data.expedientes || []);
      if (data.expedientes.length === 0) {
        alert("No existen registros para despachar");
      }
      console.log("id despacho", ids);

      return data;
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
      //console.log(data.expediente, "digitadores");
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
      "Digitador",
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
      c.user_creador,
      c.fecha_infraccion || "-",
      c.fecha_citacion || "-",
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

  function generarPDF1(expe) {
    if (expe.length === 0) {
      alert("No hay registros para generar documento");
    } else {
      generarPDF(expe);
    }
  }

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-secondary text-white">
          <strong>Despacho de Expedientes</strong>
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
            <label htmlFor="proceso" className="form-label">
              Procedimiento
            </label>
            <select
              className="form-select"
              name="proceso"
              id=""
              value={busqueda.proceso}
              onChange={handleChanges}
              required
            >
              <option value="Citación">Citación</option>
              <option value="Notificación">Notificación</option>
              <option value="Causas">Causas JPL</option>
              <option value="Solicitudes">Solicitudes Generales</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="jpl" className="form-label">
              Juzgado:
            </label>
            <select
              className="form-select"
              name="jpl"
              id=""
              onChange={handleChanges}
              value={busqueda.jpl}
              required
            >
              <option value="">Seleccione JPL</option>
              <option value="JPL 1">JPL 1</option>
              <option value="JPL 2">JPL 2</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="digitador" className="form-label">
              Digitador:
            </label>
            <select
              className="form-select"
              name="digitador"
              id=""
              onChange={handleChanges}
              value={busqueda.digitador}
            >
              {digitador.map((d) => (
                <option key={d.cod_user} value={d.user_name}>
                  {d.user_name}
                </option>
              ))}
            </select>
          </div>

          {busqueda.jpl && (
            <div className="">
              <div className="mb-3">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    buscaExpediente(
                      busqueda.fecha_inicio,
                      busqueda.fecha_fin,
                      busqueda.jpl,
                      busqueda.digitador,
                      busqueda.proceso
                    );
                  }}
                >
                  <i className="bi bi-list-columns-reverse"></i> Mostrar lista
                </button>
              </div>
              <div className="mb-3">
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    generarPDF1(expediente);
                  }}
                >
                  <i className="bi bi-file-earmark-pdf"></i> Descargar PDF
                </button>
              </div>
              <div className="mb-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    despacharExpe(expediente);
                  }}
                >
                  <i className="bi bi-box-arrow-in-right"></i> Despachar
                  Expedientes
                </button>
              </div>
            </div>
          )}
          <div className="mt-4">
            <ListDespacho expediente={expediente} />
          </div>
        </div>
      </div>
    </>
  );
}

export default DespachoExp;
