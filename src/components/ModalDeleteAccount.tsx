import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

interface ModalDeleteAccountProps {
  openDialog: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  email: string;
}

const ModalDeleteAccount: React.FC<ModalDeleteAccountProps> = ({
  openDialog,
  handleClose,
  email,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_DELETE_USER}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          data: {
            token,
            email,
          },
        }
      );

      console.log("Respuesta de eliminación de cuenta:", response.data);
      window.alert("Tu cuenta ha sido eliminada exitosamente.");
      dispatch(logout());
      navigate("/signin");
      handleClose();
    } catch (error) {
      console.error("Error al eliminar la cuenta:", error);
      handleClose();
    }
  };

  return (
    <Dialog
      open={openDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {"Confirmar eliminación"}
      </DialogTitle>
      <Box display="flex" justifyContent="center" alignItems="center">
        <DeleteIcon sx={{ fontSize: 60 }} />
      </Box>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          ¿Estás seguro de que quieres eliminar tu cuenta (efecto permanente)?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDelete} autoFocus color="error">
          Eliminar mi cuenta
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalDeleteAccount;
