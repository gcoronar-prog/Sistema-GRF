import { useState, useRef, useEffect } from "react";

function MultiSelectDropdown({
  opciones,
  placeholder = "Seleccionar opciones",
  onChange,
}) {
  const [abierto, setAbierto] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const cerrarSiClickAfuera = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener("mousedown", cerrarSiClickAfuera);
    return () => document.removeEventListener("mousedown", cerrarSiClickAfuera);
  }, []);

  const toggleOpcion = (opcion) => {
    const nuevos = seleccionados.includes(opcion)
      ? seleccionados.filter((o) => o !== opcion)
      : [...seleccionados, opcion];
    setSeleccionados(nuevos);
    onChange?.(nuevos);
  };

  return (
    <div className="dropdown" ref={ref}>
      <button
        type="button"
        className="form-select text-start"
        onClick={() => setAbierto(!abierto)}
      >
        {seleccionados.length ? seleccionados.join(", ") : placeholder}
      </button>
      {abierto && (
        <ul
          className="dropdown-menu show w-100 p-2"
          style={{ maxHeight: 250, overflowY: "auto" }}
        >
          {opciones.map((op) => {
            const activo = seleccionados.includes(op);
            return (
              <li key={op}>
                <button
                  type="button"
                  className={`dropdown-item dropdown-item-btn d-flex justify-content-between align-items-center ${activo ? "active" : ""}`}
                  onClick={() => toggleOpcion(op)}
                >
                  {op}
                  {activo && <i className="bi bi-check-lg"></i>}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
