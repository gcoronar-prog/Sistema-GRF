import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeCentral from "./components/HomeCentral";
import FormCentral from "./components/Central_Muni/FormCentral";
import ReportList from "./components/ReportList";

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
import SearchForm from "./components/SearchForm";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearchExpediente from "./components/Inspeccion/SearchExpediente";
import GaleriaInspeccion from "./components/Inspeccion/GaleriaInspeccion";
import StatisticsInspect from "./components/Estadisticas/StatisticsInspect";
import HomeAdmin from "./components/HomeAdmin";
import Layout from "./components/Layout";
import HomeInspeccion from "./components/Inspeccion/HomeInspeccion";
import ListUser from "./components/Admin/ListUser";
import ChangePassword from "./components/Login/ChangePassword";
import HomeSGC from "./components/Seg_ciudadana/HomeSGC";
import StatisticsSGC from "./components/Estadisticas/StatisticsSGC";
import StatisicsSoliImg from "./components/Estadisticas/StatisticsSoliImg";
import HomeGRD from "./components/GRD/HomeGRD";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sgf/v1/login/" element={<LoginSGF />} />
        <Route path="/sgf/reset-password/:token" element={<ChangePassword />} />

        <Route element={<Layout />}>
          <Route path="/sgf/get/users/" element={<ListUser />} />
          <Route path="/home/admin" element={<HomeAdmin />} />
          <Route path="/home/central" element={<HomeCentral />} />
          <Route path="/home/inspeccion" element={<HomeInspeccion />} />
          <Route path="/home/segciudadana" element={<HomeSGC />} />
          <Route path="/home/grd" element={<HomeGRD />} />

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

          <Route path="/sgc/imagenes/new" element={<FormSolicitud />} />
          <Route path="/sgc/imagenes/:id" element={<FormSolicitud />} />

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

          <Route
            path="/statistics/inspeccion/v1"
            element={<StatisticsInspect />}
          />

          <Route path="/statistics/seguridad/v1" element={<StatisticsSGC />} />

          <Route
            path="/statistics/seguridad/imagenes/v1"
            element={<StatisicsSoliImg />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
