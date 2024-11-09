import { Outlet } from "react-router";
import NavBar from "./NavBar";

export default function Layout() {
  return (
    <div className="h-screen flex flex-col ">
      <NavBar />
      <main className="flex-grow  ">
        <Outlet />
      </main>
    </div>
  );
}
