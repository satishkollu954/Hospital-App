import { useCookies } from "react-cookie";
import { Navigate } from "react-router-dom";

export function ProtectRoute({ children }) {
  //console.log(children);
  const [cookies] = useCookies(["email"]);
  const isAuthenticated = cookies.email !== undefined;

  return isAuthenticated ? children : <Navigate to="/adminlogin" />;
}
