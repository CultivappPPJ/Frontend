import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { logout } from "../features/auth/authSlice";

export default function Home() {
  const { token } = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  return (
    <div>
      <h1>{JSON.stringify(token)}</h1>
      <Button variant="contained" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </div>
  );
}
