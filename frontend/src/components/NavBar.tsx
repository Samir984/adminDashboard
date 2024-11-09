import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthProvider";

export default function NavBar() {
  const { isLoggedIn, logout } = useAuth();

  console.log("nav bar render");
  return (
    <nav className="bg-zinc-900 text-white flex justify-between items-center p-4">
      {/* Logo */}
      <Link to={"/"} className="text-xl font-semibold">
        Admin
      </Link>

      {/* Navigation links */}
      <div className="flex space-x-4">
        {/* Login Button */}
        {!isLoggedIn ? (
          <Link to={"/login"}>
            <Button variant={"destructive"}>Login</Button>
          </Link>
        ) : (
          <Button variant={"destructive"} onClick={logout}>
            Logout
          </Button>
        )}
      </div>
    </nav>
  );
}
