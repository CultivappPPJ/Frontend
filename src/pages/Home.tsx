import {
  Card,
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
import CultivoCard from "../components/TerrainCard";
import Pagination from "@mui/material/Pagination";
import { useState } from "react";
import TerrainCard from "../components/TerrainCard";

interface Terrain {
  id: number;
  area: number;
  soil_type: string;
  vegetable_type: string;
  photo: string;
  vegetable_producer: string;
  contact_email: string;
  remaining_days: number;
}

const terrainsData = [
  {
    id: 1,
    area: 64,
    soil_type: "Calizo",
    vegetable_type: "Zanahorias",
    photo: "https://www.cincovientos.com/wp-content/uploads/2022/04/zanahoria-4.jpg",
    vegetable_producer: "Marcial Díaz",
    contact_email: "marcial.diaz@gestorverde.cl",
    remaining_days: 14,
  },
  {
    id: 2,
    area: 50,
    soil_type: "Arenoso",
    vegetable_type: "Papas",
    photo: "https://proain.com/cdn/shop/articles/la_humedad_del_suelo_en_la_produccion_de_papa_800x.jpg?v=1603389050",
    vegetable_producer: "Eduardo Torres",
    contact_email: "eduardo.torres@gestorverde.cl",
    remaining_days: 25,
  },
  {
    id: 3,
    area: 74,
    soil_type: "Arenoso",
    vegetable_type: "Lechugas",
    photo: "https://cdn.wikifarmer.com/wp-content/uploads/2019/07/Como-Cultivar-Lechuga-%E2%80%93-Guia-Completa-de-Cultivo-de-la-Lechuga-desde-la-Siembra-hasta-la-Cosecha.jpg",
    vegetable_producer: "Sebastián Neira",
    contact_email: "sebastian.neira@gestorverde.cl",
    remaining_days: 0,
  },
  {
    id: 4,
    area: 35,
    soil_type: "Calizo",
    vegetable_type: "Olivos",
    photo: "https://img.interempresas.net/A/A875/1915524.webp",
    vegetable_producer: "Marcial Díaz",
    contact_email: "marcial.diaz@gestorverde.cl",
    remaining_days: 41,
  }  
];

const ITEMS_PER_PAGE = 3;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  const handleCardClick = (terrain: Terrain) => {
    setSelectedTerrain(terrain);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedTerrains = terrainsData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <Typography
          variant="h5"
          style={{
            marginTop: "40px",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          Cultivos disponibles para ventas
        </Typography>
        <Grid container spacing={2}>
          {paginatedTerrains.map((terrain) => (
            <Grid item key={terrain.id} xs={12} md={6} lg={4}>
              <Card onClick={() => handleCardClick(terrain)} style={{ cursor: "pointer" }}>
                <TerrainCard terrain={terrain} />
              </Card>
            </Grid>
          ))}
        </Grid>
        <Pagination
          count={Math.ceil(terrainsData.length / ITEMS_PER_PAGE)}
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
          <DialogTitle style={{ textAlign: "center" }}>{`Cultivo n° ${selectedTerrain?.id} (${selectedTerrain?.vegetable_type})`}</DialogTitle>
          <DialogContent>
            <CardMedia
              component="img"
              alt={selectedTerrain?.vegetable_type}
              height="200px"
              image={selectedTerrain?.photo}
              style={{ marginBottom: "30px", marginTop: "10px" }}
            />
            <DialogContentText>
              <span style={{ fontWeight: "bold" }}>Área de cultivo:</span>{" "}
              {selectedTerrain?.area}
              {" hectáreas"}
              <br />
              <span style={{ fontWeight: "bold" }}>Tipo de suelo:</span>{" "}
              {selectedTerrain?.soil_type}
              <br />
              <span style={{ fontWeight: "bold" }}>Días restantes:</span>{" "}
              {selectedTerrain?.remaining_days}
              <br />
              <br />
              <span style={{ fontWeight: "bold" }}>
                Nombre del agricultor:
              </span>{" "}
              {selectedTerrain?.vegetable_producer}
              <br />
              <span style={{ fontWeight: "bold" }}>
                Email de contacto:
              </span>{" "}
              {selectedTerrain?.contact_email}
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
