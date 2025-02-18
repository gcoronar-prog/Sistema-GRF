import React from "react";
import SelectOrigin from "../SelectOrigin";
import SelectSector from "../SelectSector";
import SelectVehiculo from "../SelectVehiculo";
import SelectTipo from "../SelectTipo";

function StatisticsCentral() {
  return (
    <div>
      <div className="rangoFecha">
        <label htmlFor="">Fecha de inicio</label>
        <input type="datetime-local" name="" id="" />
        <label htmlFor="">Fecha de termino</label>
        <input type="datetime-local" name="" id="" />
      </div>

      <div className="estadoInforme">
        <label htmlFor="atendido">Atendido</label>
        <input
          type="radio"
          name="estado_informe"
          id="atendido"
          value={"atendido"}
        />
        <label htmlFor="progreso">En progreso</label>
        <input
          type="radio"
          name="estado_informe"
          id="progreso"
          value={"progreso"}
        />
        <label htmlFor="pendiente">Pendiente</label>
        <input
          type="radio"
          name="estado_informe"
          id="pendiente"
          value={"pendiente"}
        />
      </div>

      <div className="clasiInforme">
        <label htmlFor="clasificacion">Clasificación</label>
        <select name="clasificacion_informe" id="clasificacion">
          <option value="">Seleccione informe</option>
          <option value="Emergencia">Emergencia</option>
          <option value="Incidente">Incidente</option>
          <option value="Factor de riesgo">Factor de riesgo</option>
          <option value="Novedad">Novedad</option>
        </select>
      </div>

      <div className="capturaInforme">
        <label htmlFor="radios">Radio</label>
        <input
          type="radio"
          name="captura_informe"
          id="radios"
          value={"radios"}
        />
        <label htmlFor="telefono">Teléfono</label>
        <input
          type="radio"
          name="captura_informe"
          id="telefono"
          value={"telefono"}
        />
        <label htmlFor="rrss">RRSS</label>
        <input type="radio" name="captura_informe" id="rrss" value={"rrss"} />
        <label htmlFor="presencial">Presencial</label>
        <input
          type="radio"
          name="captura_informe"
          id="presencial"
          value={"presencial"}
        />
        <label htmlFor="email">E-mail</label>
        <input type="radio" name="captura_informe" id="email" value={"email"} />
      </div>

      <div className="origenInforme">
        <SelectOrigin />
      </div>

      <div className="recursosInforme">
        {/*select multiple de recursos con checkbox */}
      </div>

      <div className="sectorInforme">
        <label htmlFor="">Sector:</label>
        <SelectSector />
      </div>

      <div className="vechiculoInforme">
        <label htmlFor="">Vehículos:</label>
        <SelectVehiculo />
      </div>

      <div className="operadorInforme">
        {/*select con centralistas usar react-select */}
      </div>

      <div className="tipoReporte">
        <label htmlFor="">Tipo de informe:</label>
        <SelectTipo />
      </div>
    </div>
  );
}

export default StatisticsCentral;
