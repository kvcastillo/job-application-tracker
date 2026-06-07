import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-zinc-900 text-white">
      {/* LEFT */}
      <div>
        <Link to="/" className="font-bold text-xl">
          Job Tracker
        </Link>
      </div>

      {/* CENTER */}
      <ul className="flex items-center gap-6">
        <li>
          <Link to="/">Dashboard</Link>
        </li>

        <li>
          <Link to="/applications">Applications</Link>
        </li>
      </ul>

      {/* RIGHT */}
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <p className="text-sm">Hi, {user.username}</p>

            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="bg-amber-500 text-black px-3 py-1 rounded font-bold"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
