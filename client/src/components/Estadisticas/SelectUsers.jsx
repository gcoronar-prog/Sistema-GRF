import AsyncSelect from "react-select/async";

function SelectUsers({ selectedUser, setSelectedUser }) {
  const loadUsers = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const res = await fetch(`${servidor}/users_gie`);
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
      />
    </div>
  );
}

export default SelectUsers;
