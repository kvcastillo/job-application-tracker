import { useNavigate } from "react-router-dom";

const Logout = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
  };
  return (
    <button onClick={handleLogout} className="bg-red-400">
      Logout
    </button>
  );
};

export default Logout;
