import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeCentral from "./components/HomeCentral";
import FormCentral from "./components/Central_Muni/FormCentral";
import ReportList from "./components/ReportList";
import { Container } from "@mui/material";
import "../src/styles.css";
//import FormAcciones from "./components/FormAcciones";
import AttachFiles from "./components/AttachFiles";
import FormInspeccion from "./components/Inspeccion/FormInspeccion";
import FormAlfa from "./components/GRD/FormAlfa";
import FormInventario from "./components/GRD/InventarioGRD";
import FormSolicitud from "./components/Seg_ciudadana/FormSolicitud";
import FormAtencion from "./components/Seg_ciudadana/FormAtencion";

import FormReportes from "./components/Central_Muni/FormReportes";
import FormInformes from "./components/Central_Muni/FormInformes";
function App() {
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/" element={<HomeCentral />} />
          <Route path="/Reports/new" element={<FormCentral />} />
          <Route path="/Reports/:id/edit" element={<FormCentral />} />
          <Route path="/ListReports" element={<ReportList />} />
          <Route path="/ListReports/:id" element={<ReportList />} />

          <Route path="/archivo/:id" element={<AttachFiles />} />
          <Route path="/inspect/new" element={<FormInspeccion />} />
          <Route path="/inspect/:id/edit" element={<FormInspeccion />} />

          <Route path="/alfa/new" element={<FormAlfa />} />
          <Route path="/alfa/:id/edit" element={<FormAlfa />} />

          <Route path="/grd/inventario/new" element={<FormInventario />} />
          <Route path="/grd/inventario/:id/edit" element={<FormInventario />} />

          <Route path="/sc/imagenes/new" element={<FormSolicitud />} />
          <Route path="/sc/imagenes/:id" element={<FormSolicitud />} />

          <Route path="/sgc/atencion/new" element={<FormAtencion />} />
          <Route path="/sgc/atencion/:id" element={<FormAtencion />} />

          <Route path="/reporte/new" element={<FormReportes />} />
          <Route path="/reporte/:id" element={<FormReportes />} />

          <Route path="/informes/new" element={<FormInformes />} />
          <Route path="/informes/central/:id" element={<FormInformes />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
