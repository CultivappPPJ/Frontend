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

interface ModalDeleteProps {
  openDialog: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  terrainName: string;
}

const ModalDelete: React.FC<ModalDeleteProps> = ({
  openDialog,
  handleClose,
  handleDelete,
  terrainName,
}) => {
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
          ¿Estás seguro de que quieres eliminar "{terrainName}"?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleDelete} autoFocus color="error">
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default ModalDelete;
