import { Card, CardContent, Typography, Container, Grid } from "@mui/material";
import Navbar from "../components/Navbar";
import CultivoCard from "../components/CultivoCard";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";

const cultivosData = [
  {
    id: 1,
    area: 64,
    tipo_suelo: "Calizo",
    tipo_vegetal: "Zanahorias",
    foto: "Zanahorias.jpg",
    nombre_agricultor: "Marcial Díaz",
    email_contacto: "marcial.diaz@gestorverde.cl",
  },
  {
    id: 2,
    area: 50,
    tipo_suelo: "Arenoso",
    tipo_vegetal: "Papas",
    foto: "https://proain.com/cdn/shop/articles/la_humedad_del_suelo_en_la_produccion_de_papa_800x.jpg?v=1603389050",
    nombre_agricultor: "Eduardo Torres",
    email_contacto: "eduardo.torres@gestorverde.cl",
  },
  {
    id: 3,
    area: 74,
    tipo_suelo: "Arenoso",
    tipo_vegetal: "Lechugas",
    foto: "https://cdn.wikifarmer.com/wp-content/uploads/2019/07/Como-Cultivar-Lechuga-%E2%80%93-Guia-Completa-de-Cultivo-de-la-Lechuga-desde-la-Siembra-hasta-la-Cosecha.jpg",
    nombre_agricultor: "Sebastián Neira",
    email_contacto: "sebastian.neira@gestorverde.cl",
  },
  {
    id: 4,
    area: 35,
    tipo_suelo: "Calizo",
    tipo_vegetal: "Olivos",
    foto: "https://img.interempresas.net/A/A875/1915524.webp",
    nombre_agricultor: "Marcial Díaz",
    email_contacto: "marcial.diaz@gestorverde.cl",
  },
];

const ITEMS_PER_PAGE = 3;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCultivos = cultivosData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          style={{
            marginTop: "50px",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          Cultivos disponibles para ventas
        </Typography>
        <Grid container spacing={2}>
          {paginatedCultivos.map((cultivo) => (
            <Grid item key={cultivo.id} xs={12} md={6} lg={4}>
              <CultivoCard cultivo={cultivo} />
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={Math.ceil(cultivosData.length / ITEMS_PER_PAGE)}
          page={currentPage}
          onChange={handleChangePage}
          color="primary"
          size="large"
          style={{
            marginTop: "40px",
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Container>
    </>
  );
}
