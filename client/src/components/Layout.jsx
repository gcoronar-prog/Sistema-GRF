import { Outlet } from "react-router-dom";
import NavbarSGF from "./NavbarSGF";

export default function Layout() {
  return (
    <>
      <NavbarSGF />
      <div className="container-fluid mt-4 w-100">
        <Outlet />
      </div>
    </>
  );
}
