import { Outlet } from "react-router-dom";
import { AuthProvider } from "../../contexts/AuthContext";

export default function AdminRoot() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
