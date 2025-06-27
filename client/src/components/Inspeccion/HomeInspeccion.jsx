import React from "react";
import { useTokenSession } from "../useTokenSession";
import ListExpe from "./ListExpe";
import { rolesGrupo } from "../../../../server/src/middlewares/groupRole";
function HomeInspeccion() {
  const userData = useTokenSession();

  return (
    <>
      {userData.user_rol ? (
        rolesGrupo.inspeccion.includes(userData.user_rol) ||
        rolesGrupo.noinspeccion.includes(userData.user_rol) ? (
          <ListExpe />
        ) : (
          "No hay datos para mostrar sin el token"
        )
      ) : (
        <p>cargando la pagina</p>
      )}
    </>
  );
}

export default HomeInspeccion;
