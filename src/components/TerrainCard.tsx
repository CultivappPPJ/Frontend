import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import "../styles/styles.css";
import { TerrainResponse } from "../types";

interface TerrainCardProps {
  terrain: TerrainResponse;
}

const TerrainCard: React.FC<TerrainCardProps> = ({ terrain }) => {
  return (
    <>
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            className="card-title"
          >{`Cultivo de ${terrain.name}`}</Typography>
          <CardMedia
            component="img"
            alt={terrain.name}
            image={terrain.photo}
            className="img"
          />
          <Typography>
            <span>Agricultor:</span> {terrain.fullName}
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
