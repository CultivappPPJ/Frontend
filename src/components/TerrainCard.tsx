import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

interface TerrainCardProps {
    terrain: {
      id: number;
      plantType: string;
      photo: string;
      fullName: string;
      contactEmail: string;
    };
  }
  
  const TerrainCard: React.FC<TerrainCardProps> = ({ terrain }) => {
    return (
      <>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6" style={{ marginTop: "-20px", marginBottom: "15px", textAlign: "center", fontWeight: "normal" }}>{`Cultivo n° ${terrain.id} (${terrain.plantType})`}</Typography>
          <CardMedia
            component="img"
            alt={terrain.plantType}
            height="270px"
            image={terrain.photo}
            style={{ marginBottom: "20px" }}
          />
          <Typography>
            <span style={{ fontWeight: "bold" }}>Agricultor:</span> {terrain.plantType}
          </Typography>
          <Typography>
            <span style={{ fontWeight: "bold" }}>Contacto:</span> {terrain.contactEmail}
          </Typography>
        </CardContent>
      </Card>
      </>
    );
  };

export default TerrainCard;
