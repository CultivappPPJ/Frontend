import React from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";

interface CultivoCardProps {
    cultivo: {
      id: number;
      tipo_vegetal: string;
      foto: string;
      nombre_agricultor: string;
      email_contacto: string;
    };
  }
  
  const CultivoCard: React.FC<CultivoCardProps> = ({ cultivo }) => {
    return (
      <>
      <Card style={{ marginTop: "20px" }}>
        <CardContent>
          <Typography variant="h6" style={{ marginBottom: "20px" }}>{`Cultivo n° ${cultivo.id} (${cultivo.tipo_vegetal})`}</Typography>
          <CardMedia
            component="img"
            alt={cultivo.tipo_vegetal}
            height="200px"
            image={cultivo.foto}
            style={{ marginBottom: "20px" }}
          />
          <Typography>
            <span style={{ fontWeight: "bold" }}>Agricultor:</span> {cultivo.nombre_agricultor}
          </Typography>
          <Typography>
            <span style={{ fontWeight: "bold" }}>Contacto:</span> {cultivo.email_contacto}
          </Typography>
        </CardContent>
      </Card>
      </>
    );
  };

export default CultivoCard;
