import React from "react";
import { Typography, Container, Card, CardContent, Grid } from "@mui/material";
import "../styles/styles.css";
import logoImage from "../img/favicon.png";

export default function Landing() {
  return (
    <Container className="about-us-container">
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={6}>
          <Card className="custom-card">
            <CardContent>
              <Typography variant="h5" className="about-us-title">
                ¿Quiénes somos?
              </Typography>
              <Typography variant="body1" className="about-us-text">
                Gestor Verde es un equipo apasionado de innovadores y
                profesionales dedicados que han unido fuerzas para dar vida a
                CultivApp. Nuestra diversidad de habilidades y experiencias
                converge en la creación de una plataforma revolucionaria para el
                sector agrícola.
              </Typography>
              <Typography variant="body1" className="about-us-text">
                Con un trasfondo en desarrollo de software, diseño de
                experiencia de usuario, y conocimientos profundos en la gestión
                agrícola, nos esforzamos por ofrecer una solución tecnológica
                que transforme la manera en que los agricultores administran y
                supervisan sus cultivos. Estamos comprometidos con la
                excelencia, la sostenibilidad y el impacto positivo en la
                industria, y nos enorgullece presentar CultivApp como la
                culminación de nuestra dedicación y visión compartida.{" "}
              </Typography>
              <Typography variant="body1" className="about-us-text">
                ¡Bienvenidos a la comunidad de CultivApp, donde la tecnología se
                encuentra con la agricultura de manera innovadora!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <img
            src={logoImage}
            alt="Logo de la empresa"
            className="logo-image"
          />
        </Grid>
      </Grid>
    </Container>
  );
}
