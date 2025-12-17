import { useState } from "react";
import SelectSector from "../SelectSector";

function StatisicsSoliImg() {
  const server_back = import.meta.env.VITE_SERVER_ROUTE_BACK;

  const [fecha_solicitud_inicio, setFecha_solicitud_inicio] = useState("");
  const [fecha_solicitud_fin, setFecha_solicitud_fin] = useState("");
  const [fecha_siniestro_inicio, setFecha_siniestro_inicio] = useState("");
  const [fecha_siniestro_fin, setFecha_siniestro_fin] = useState("");
  const [rut_usuario, setRut_usuario] = useState("");
  const [rut_responsable, setRut_responsable] = useState("");
  const [selectedSector, setSelectedSector] = useState([]);
  const [estado_solicitud, setEstado_solicitud] = useState({
    Pendiente: false,
    Revisión: false,
    Entregada: false,
    Nula: false,
  });
  const [entidad, setEntidad] = useState({
    "JPL 1": false,
    "JPL 2": false,
    Carabineros: false,
    Fiscalía: false,
    "Otras Instituciones": false,
  });

  const token = localStorage.getItem("token");

  const fetchDatos = async (tipoDoc) => {
    let url = `${server_back}/estadisticaIMG?`;
    let params = new URLSearchParams();

    if (fecha_solicitud_inicio && fecha_solicitud_fin) {
      params.append("fecha_inicio", fecha_solicitud_inicio);
      params.append("fecha_fin", fecha_solicitud_fin);
    }

    if (fecha_siniestro_inicio && fecha_siniestro_fin) {
      params.append("fecha_inicio_soli", fecha_siniestro_inicio);
      params.append("fecha_fin_soli", fecha_siniestro_fin);
    }

    if (rut_usuario) {
      params.append("rut_solicitante", rut_usuario);
    }

    if (rut_responsable) {
      params.append("rut_resp", rut_responsable);
    }

    if (selectedSector) {
      params.append("sector", JSON.stringify(selectedSector));
    }

    Object.keys(estado_solicitud).forEach((estado) => {
      if (estado_solicitud[estado]) {
        params.append("estado_soli", estado);
      }
    });

    Object.keys(entidad).forEach((ent) => {
      if (entidad[ent]) {
        params.append("entidad", ent);
      }
    });

    try {
      const res = await fetch(url + params.toString(), {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.solicitud.length !== 0) {
        if (tipoDoc === 1) {
          //pdf
        } else {
          //excel
        }
      } else {
        alert("No existen datos para mostrar");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const generarPDFSoli = (data) => {
    const doc = new jsPDF({ orientation: "landscape" });
    const logo = `${import.meta.env.VITE_LOGO_MUNI}`;
    const logoSegPub = `${import.meta.env.VITE_LOGO_SEG}`;
    doc.addImage(logo, "PNG", 250, 5, 35, 18);
    doc.addImage(logoSegPub, "PNG", 200, 9, 42, 15);

    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text("Solicitudes Imagenes Seguridad Ciudadana", 14, 15);

    let filtros = `Filtros aplicados:\n`;
    if (fecha_solicitud_inicio && fecha_solicitud_fin) {
      filtros += `Fecha: ${new Date(fecha_solicitud_inicio).toLocaleString(
        "es-ES"
      )} - ${new Date(fecha_solicitud_fin).toLocaleString("es-ES")}`;
    }

    doc.setFontSize(11);
    doc.setTextColor(80);
    doc.text(filtros, 14, 25);

    const tableColumn = [
      "ID Solicitud",
      "Fecha documento",
      "Estado solicitud",
      "Fecha grabación",
      "Sector solicitado",
      "Dirección",
      "Entidad denuncia",
      "N° de parte / documento",
    ];

    const tableRows = data.map((d) => [
      d.cod_solicitud,
      new Date(d.fecha_solicitud).toLocaleDateString("es-ES"),
      d.estado_solicitud,
      new Date(d.fecha_siniestro).toLocaleDateString("es-ES"),
      d.sector_solicitud,
      d.direccion_solicitud,
      d.entidad,
      d.num_parte,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 35,
      theme: "grid",
      tableWidth: "full",
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
    });
    doc.output("dataurlnewwindow");
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, dataset } = e.target;
    if (dataset.type === "entidad") {
      setEntidad((prev) => ({ ...prev, [name]: checked }));
    } else if (dataset.type === "estado") {
      setEstado_solicitud((prev) => ({ ...prev, [name]: checked }));
    }
  };

  return (
    <>
      <div className="card shadow-sm">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">Estadísticas Solicitudes de imágenes</h5>
        </div>
        <div className="card-body">
          <div className="row row-cols-lg-4 g-2 g-lg-">
            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Fecha atenciones</strong>
                </div>
                <div className="card-body">
                  <label className="form-label fw-bold">Fecha de inicio</label>
                  <input
                    className="form-control mb-2"
                    type="datetime-local"
                    id="fechaInicio"
                    value={fecha_solicitud_inicio}
                    onChange={(e) => setFecha_solicitud_inicio(e.target.value)}
                  />
                  <label className="form-label fw-bold">Fecha fin</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    id="fechaFin"
                    value={fecha_solicitud_fin}
                    onChange={(e) => setFecha_solicitud_fin(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Fechas solicitadas</strong>
                </div>
                <div className="card-body">
                  <label className="form-label fw-bold">Fecha de inicio</label>
                  <input
                    className="form-control mb-2"
                    type="datetime-local"
                    id="fechaInicio"
                    value={fecha_siniestro_inicio}
                    onChange={(e) => setFecha_siniestro_inicio(e.target.value)}
                  />
                  <label className="form-label fw-bold">Fecha fin</label>
                  <input
                    className="form-control"
                    type="datetime-local"
                    id="fechaFin"
                    value={fecha_siniestro_fin}
                    onChange={(e) => setFecha_siniestro_fin(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Estado de atenciones</strong>
                </div>
                <div className="card-body">
                  {Object.keys(estado_solicitud).map((key) => (
                    <div className="col" key={key}>
                      <div className="form-check form-check-inline" key={key}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={key}
                          data-type="estado"
                          name={key}
                          value={key}
                          checked={estado_solicitud[key] || false}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-secondary">
                <div className="card-header">
                  <strong>Entidades denuncia</strong>
                </div>
                <div className="card-body">
                  {Object.keys(entidad).map((key) => (
                    <div className="col" key={key}>
                      <div className="form-check form-check-inline" key={key}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={key}
                          data-type="entidad"
                          name={key}
                          value={key}
                          checked={entidad[key] || false}
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor={key}>
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row g-4 mt-3">
            <div className="col-md-4">
              <label htmlFor="rut_usuario" className="form-label fw-bold">
                Rut usuario
              </label>
              <input type="text" className="form-control" name="rut_usuario" />
            </div>
            <div className="col-md-4">
              <label htmlFor="rut_resp" className="form-label fw-bold">
                Rut responsable
              </label>
              <input type="text" className="form-control" name="rut_resp" />
            </div>
            <div className="col-md-4">
              <label htmlFor="rut_resp" className="form-label fw-bold">
                Sector grabaciones
              </label>
              <SelectSector
                selectedSector={selectedSector}
                setSelectedSector={setSelectedSector}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default StatisicsSoliImg;
