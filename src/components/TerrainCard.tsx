import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  Box,
} from "@mui/material";
import "../styles/styles.css";
import { TerrainResponse } from "../types";
import { Link } from "react-router-dom";
import ImageModal from "./ImageModal";

interface TerrainCardProps {
  terrain: TerrainResponse;
}

const TerrainCard: React.FC<TerrainCardProps> = ({ terrain }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleClickOpen = (imageUrl) => {
    setSelectedImage(imageUrl);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            className="card-title"
          >{`Nombre del Terreno: ${terrain.name}`}</Typography>
          <CardMedia
            component="img"
            alt={terrain.name}
            image={terrain.photo}
            className="img"
            onClick={() => handleClickOpen(terrain.photo)}
          />
          <Typography>
            <span>Área de cultivo:</span> {terrain.area}{" "}
            {terrain.area === "1" ? "Hectárea" : "Hectáreas"}
          </Typography>
          <Typography component="div">
            <strong>Cultivos:</strong>
            {terrain.crops.length > 0 ? (
              terrain.crops.map((crop, index) => (
                <Typography
                  component="span"
                  key={index}
                  style={{ fontWeight: "normal" }}
                >
                  {index > 0 ? " - " : " "}
                  {crop.seedType.name}
                </Typography>
              ))
            ) : (
              <Typography component="span" style={{ fontWeight: "normal" }}>
                {" "}
                No hay cultivos
              </Typography>
            )}
          </Typography>
          <Typography>
            <span>Ubicación:</span> {terrain.location}
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              component={Link}
              to={`/info/terrain/${terrain.id}`}
              variant="contained"
              size="small"
            >
              Más información
            </Button>
          </Box>
        </CardContent>
      </Card>
      <ImageModal
        open={openDialog}
        onClose={handleClose}
        imageUrl={selectedImage}
      />
    </>
  );
};

export default TerrainCard;
