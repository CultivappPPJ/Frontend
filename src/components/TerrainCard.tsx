import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

interface TerrainCardProps {
    terrain: {
      id: number;
      vegetable_type: string;
      photo: string;
      vegetable_producer: string;
      contact_email: string;
    };
  }
  
  const TerrainCard: React.FC<TerrainCardProps> = ({ terrain }) => {
    return (
      <>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6" style={{ marginTop: "-20px", marginBottom: "15px", textAlign: "center", fontWeight: "normal" }}>{`Cultivo n° ${terrain.id} (${terrain.vegetable_type})`}</Typography>
          <CardMedia
            component="img"
            alt={terrain.vegetable_type}
            height="270px"
            image={terrain.photo}
            style={{ marginBottom: "20px" }}
          />
          <Typography>
            <span style={{ fontWeight: "bold" }}>Agricultor:</span> {terrain.vegetable_producer}
          </Typography>
          <Typography>
            <span style={{ fontWeight: "bold" }}>Contacto:</span> {terrain.contact_email}
          </Typography>
        </CardContent>
      </Card>
      </>
    );
  };

export default TerrainCard;
