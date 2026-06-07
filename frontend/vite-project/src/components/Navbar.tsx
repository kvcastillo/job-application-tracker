const Navbar = () => {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  return (
    <nav>
      <ul>
        {token ? (
          <li>Welcome Back, ${username}</li>
        ) : (
          <li>
            <button>Login</button>
          </li>
        )}
        <li></li>
      </ul>
    </nav>
  );
};

export default Navbar;
