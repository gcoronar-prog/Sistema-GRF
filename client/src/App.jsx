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
import SelectTripulantes from "./components/SelectTripulantes";
import SelectVehiculo from "./components/SelectVehiculo";
import StatisticsCentral from "./components/Estadisticas/StatisticsCentral";
import LoginSGF from "./components/Login/LoginSGF";
import NavbarSGF from "./components/NavbarSGF";
import SearchForm from "./components/SearchForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchExpediente from "./components/Inspeccion/SearchExpediente";
import GaleriaInspeccion from "./components/Inspeccion/GaleriaInspeccion";

function App() {
  return (
    <BrowserRouter>
      <Container>
        <Routes>
          <Route path="/sgf/v1/login/" element={<LoginSGF />} />

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

          <Route path="/selectv" element={<SelectVehiculo />} />
          <Route path="/selecttripu" element={<SelectTripulantes />} />

          <Route
            path="/statistics/central/v1"
            element={<StatisticsCentral />}
          />

          <Route path="/search/informe" element={<SearchForm />} />
          <Route path="/search/expediente" element={<SearchExpediente />} />
          <Route path="/galeriaImgExp" element={<GaleriaInspeccion />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;
