import { useEffect, useState } from "react";
import axios from "axios";

function Login() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Users from MongoDB</h1>
      <ul>
        {users.map((u, idx) => (
          <li key={idx}>
            {u.userName} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Login;
