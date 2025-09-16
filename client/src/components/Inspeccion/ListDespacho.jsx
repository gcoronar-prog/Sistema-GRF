function ListDespacho({ expediente }) {
  return (
    <div className="mt-4">
      <h5 className="mb-3 text-secondary border-bottom pb-2">
        Resultados encontrados:
      </h5>
      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle text-center table-bordered table-sm">
          <thead className="table-dark">
            <tr>
              <th># Control</th>
              <th>Proceso</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {expediente.map((item, index) => (
              <tr key={index}>
                <td>{item.num_control}</td>
                <td>{item.tipo_proceso}</td>
                <td>{item.fecha_documento}</td>
                <td>{item.estado_exp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListDespacho;
