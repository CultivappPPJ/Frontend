import React from "react";
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
import EmailIcon from "@mui/icons-material/Email";

interface TerrainCardProps {
  terrain: TerrainResponse;
}

const TerrainCard: React.FC<TerrainCardProps> = ({ terrain, onCardClick }) => {
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
          />
          <Typography>
            <span>Área de cultivo:</span> {terrain.area} en hectáreas
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Typography>
              <span>Contacto: </span>
            </Typography>
            <Button
              startIcon={<EmailIcon />}
              href={`mailto:${terrain.email}?subject=${encodeURIComponent(
                `Consulta sobre el terreno "${terrain.name}"`
              )}&body=${encodeURIComponent(
                `Buenos días señor/a ${terrain.fullName}, quiero cotizar los cultivos del terreno "${terrain.name}".`
              )}`}
              variant="text"
              color="primary"
              className="email-button"
            >
              Enviar Correo
            </Button>
          </Box>
          <Button
            onClick={() => onCardClick(terrain)}
            variant="contained"
            size="small"
            className="info-button"
          >
            Más información
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default TerrainCard;
