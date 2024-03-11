import React from "react";
import { Card, CardContent, Typography, CardMedia, Button } from "@mui/material";
import "../styles/styles.css";

interface TerrainCardProps {
  terrain: {
    id: number;
    area: string;
    plantType: string;
    photo: string;
    fullName: string;
    email: string;
  };
  onCardClick: (terrain: any) => void;
}

const TerrainCard: React.FC<TerrainCardProps> = ({ terrain, onCardClick }) => {
  return (
    <>
      <Card>
        <CardContent>
          <Typography variant="h6" className="card-title">
            {terrain.plantType}
          </Typography>
          <CardMedia
            component="img"
            alt={terrain.plantType}
            image={terrain.photo}
            className="img"
          />
          <Typography>
            <span>Área de cultivo:</span> {terrain.area}
          </Typography>
          <Typography>
            <span>Contacto:</span> {terrain.email}
          </Typography>
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
