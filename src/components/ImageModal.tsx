import { Dialog, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ImageModal = ({ open, onClose, imageUrl }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="image-dialog"
      fullWidth
      maxWidth="md"
    >
      <DialogContent>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "black",
          }}
        >
          <CloseIcon />
        </IconButton>
        <img
          src={imageUrl}
          alt="Selected"
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "75vh",
            objectFit: "contain",
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ImageModal;
