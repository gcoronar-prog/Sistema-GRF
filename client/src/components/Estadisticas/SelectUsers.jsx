import AsyncSelect from "react-select/async";

function SelectUsers({ selectedUser, setSelectedUser, estadistica, tipo }) {
  const loadUsers = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      let url;
      if (tipo === "central") {
        url = `${servidor}/users_gie_central`;
      } else if (tipo === "inspect") {
        url = `${servidor}/users_gie_inspect`;
      }
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Error al cargar los usuarios");
      }
      const data = await res.json();

      return data.map((item) => ({
        value: item.user_name,
        label: item.nombre + " " + item.apellido,
      }));
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  return (
    <div>
      <AsyncSelect
        cacheOptions
        defaultOptions
        isClearable
        loadOptions={loadUsers}
        onChange={(select) => {
          setSelectedUser(select);
        }}
        value={selectedUser}
        styles={{
          control: (base) => ({
            ...base,
            borderColor:
              !selectedUser && !estadistica ? "red" : base.borderColor,
          }),
        }}
      />
    </div>
  );
}

export default SelectUsers;
