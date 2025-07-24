import { useEffect } from "react";
import AsyncSelect from "react-select/async";

function SelectUsers({ selectedUser, setSelectedUser }) {
  const loadUsers = async () => {
    const servidor = import.meta.env.VITE_SERVER_ROUTE_BACK;
    try {
      const res = await fetch(`${servidor}/usersgie`);

      const data = await res.json();

      return data.map((item) => ({
        label: item.nombre + " " + item.apellido,
        value: item.user_name,
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
