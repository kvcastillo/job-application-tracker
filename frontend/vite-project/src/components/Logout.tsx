import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };
  return (
    <button onClick={handleLogout} className="bg-red-400 text-white">
      Logout
    </button>
  );
};

export default Logout;
