import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import "../styles/styles.css";

interface TerrainCardProps {
    terrain: {
      id: number;
      plantType: string;
      photo: string;
      fullName: string;
      email: string;
    };
  }
  
  const TerrainCard: React.FC<TerrainCardProps> = ({ terrain }) => {
    return (
      <>
      <Card>
        <CardContent>
          <Typography variant="h6" className="card-title">{`Cultivo de ${terrain.plantType}`}</Typography>
          <CardMedia
            component="img"
            alt={terrain.plantType}
            image={terrain.photo}
            className="img"
          />
          <Typography>
            <span>Agricultor:</span> {terrain.plantType}
          </Typography>
          <Typography>
            <span>Contacto:</span> {terrain.email}
          </Typography>
        </CardContent>
      </Card>
      </>
    );
  };

export default TerrainCard;
