import {
  Card,
  CardContent,
  Typography,
  Container,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CardMedia,
} from "@mui/material";
import Navbar from "../components/Navbar";
import CultivoCard from "../components/CultivoCard";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";

interface Cultivo {
  id: number;
  area: number;
  tipo_suelo: string;
  tipo_vegetal: string;
  foto: string;
  nombre_agricultor: string;
  email_contacto: string;
  dias_restantes: number;
}

const cultivosData = [
  {
    id: 1,
    area: 64,
    tipo_suelo: "Calizo",
    tipo_vegetal: "Zanahorias",
    foto: "Zanahorias.jpg",
    nombre_agricultor: "Marcial Díaz",
    email_contacto: "marcial.diaz@gestorverde.cl",
    dias_restantes: 14,
  },
  {
    id: 2,
    area: 50,
    tipo_suelo: "Arenoso",
    tipo_vegetal: "Papas",
    foto: "https://proain.com/cdn/shop/articles/la_humedad_del_suelo_en_la_produccion_de_papa_800x.jpg?v=1603389050",
    nombre_agricultor: "Eduardo Torres",
    email_contacto: "eduardo.torres@gestorverde.cl",
    dias_restantes: 25,
  },
  {
    id: 3,
    area: 74,
    tipo_suelo: "Arenoso",
    tipo_vegetal: "Lechugas",
    foto: "https://cdn.wikifarmer.com/wp-content/uploads/2019/07/Como-Cultivar-Lechuga-%E2%80%93-Guia-Completa-de-Cultivo-de-la-Lechuga-desde-la-Siembra-hasta-la-Cosecha.jpg",
    nombre_agricultor: "Sebastián Neira",
    email_contacto: "sebastian.neira@gestorverde.cl",
    dias_restantes: 0,
  },
  {
    id: 4,
    area: 35,
    tipo_suelo: "Calizo",
    tipo_vegetal: "Olivos",
    foto: "https://img.interempresas.net/A/A875/1915524.webp",
    nombre_agricultor: "Marcial Díaz",
    email_contacto: "marcial.diaz@gestorverde.cl",
    dias_restantes: 41,
  },
];

const ITEMS_PER_PAGE = 3;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCultivo, setSelectedCultivo] = useState<Cultivo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleCardClick = (cultivo: Cultivo) => {
    setSelectedCultivo(cultivo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
            marginTop: "40px",
            marginBottom: "35px",
            textAlign: "center",
          }}
        >
          Cultivos disponibles para ventas
        </Typography>
        <Grid container spacing={2}>
          {paginatedCultivos.map((cultivo) => (
            <Grid item key={cultivo.id} xs={12} md={6} lg={4}>
              <Card onClick={() => handleCardClick(cultivo)} style={{ cursor: "pointer" }}>
                <CultivoCard cultivo={cultivo} />
              </Card>
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
            marginTop: "30px",
            display: "flex",
            justifyContent: "center",
          }}
        />

        {/* Modal */}
        <Dialog open={isModalOpen} onClose={handleCloseModal}>
          <DialogTitle style={{ textAlign: "center" }}>{`Cultivo n° ${selectedCultivo?.id} (${selectedCultivo?.tipo_vegetal})`}</DialogTitle>
          <DialogContent>
            <CardMedia
              component="img"
              alt={selectedCultivo?.tipo_vegetal}
              height="200px"
              image={selectedCultivo?.foto}
              style={{ marginBottom: "30px", marginTop: "10px" }}
            />
            <DialogContentText>
              <span style={{ fontWeight: "bold" }}>Área de cultivo:</span>{" "}
              {selectedCultivo?.area}
              {" hectáreas"}
              <br />
              <span style={{ fontWeight: "bold" }}>Tipo de suelo:</span>{" "}
              {selectedCultivo?.tipo_suelo}
              <br />
              <span style={{ fontWeight: "bold" }}>Días restantes:</span>{" "}
              {selectedCultivo?.dias_restantes}
              <br />
              <br />
              <span style={{ fontWeight: "bold" }}>
                Nombre del agricultor:
              </span>{" "}
              {selectedCultivo?.nombre_agricultor}
              <br />
              <span style={{ fontWeight: "bold" }}>
                Email de contacto:
              </span>{" "}
              {selectedCultivo?.email_contacto}
            </DialogContentText>
          </DialogContent>
          <DialogActions style={{ justifyContent: "center", marginTop: "-10px" }}>
            <Button onClick={handleCloseModal} color="primary" style={{ cursor: "pointer" }}>
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
