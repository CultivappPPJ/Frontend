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
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import TerrainCard from "../components/TerrainCard";
import "../styles/styles.css";
import axios from 'axios';

interface Terrain {
  id: number;
  area: string;
  soilType: string;
  plantType: string;
  photo: string;
  email: string;
  remainingDays: number;
  forSale: boolean;
  fullName: string;
}

const ITEMS_PER_PAGE = 3;

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1);
  const [terrainsData, setTerrainsData] = useState<Terrain[]>([]);
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realizar la solicitud axios al back end
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/v1/terrain/all");
        const data = response.data;
        setTerrainsData(data.content); // Actualizar el estado con los datos obtenidos de la API
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    };
  
    fetchData();
  }, []); // El array vacío asegura que la solicitud se realice solo una vez al montar el componente

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
  const filteredTerrains = terrainsData.filter((terrain) => terrain.forSale);
  const paginatedTerrains = filteredTerrains.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        {loading ? (
          // Muestra el spinner de carga mientras se cargan los datos
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <CircularProgress color="primary" />
          </div>
        ) : (
          // El resto del contenido cuando los datos están cargados
          <>
            <Typography variant="h6" className="welcome-message">
              {paginatedTerrains.length > 0
                ? "¡Bienvenido a CultivApp! Cultivos disponibles para ventas:"
                : "¡Bienvenido a CultivApp! Aún no hay cultivos a la venta"}
            </Typography>
            {paginatedTerrains.length === 0 ? (
              <div className="no-crops-message">
                <img
                  src="https://w0.peakpx.com/wallpaper/374/819/HD-wallpaper-green-field-sunset-clouds-countryside-farming-agriculture-landscape.jpg"
                  alt="No hay cultivos disponibles"
                  className="no-crops-image"
                />
              </div>
            ) : (
              <Grid
                container
                spacing={2}
                justifyContent={
                  paginatedTerrains.length === 1 ||
                  paginatedTerrains.length === 2
                    ? "center"
                    : "flex-start"
                }
                alignItems="stretch"
              >
                {paginatedTerrains.map((terrain) => (
                  <Grid item key={terrain.id} xs={12} md={6} lg={4}>
                    <Card
                      onClick={() => handleCardClick(terrain)}
                      className="terrain-card"
                    >
                      <TerrainCard terrain={terrain} />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
            {paginatedTerrains.length > 0 && (
              <Pagination
                count={Math.ceil(filteredTerrains.length / ITEMS_PER_PAGE)}
                page={currentPage}
                onChange={handleChangePage}
                color="primary"
                size="large"
                className="pagination"
              />
            )}

            {/* Modal */}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
              <DialogTitle className="dialog-title">{`Cultivo n° ${selectedTerrain?.id} (${selectedTerrain?.plantType})`}</DialogTitle>
              <DialogContent>
                <CardMedia
                  component="img"
                  alt={selectedTerrain?.plantType}
                  height="200px"
                  image={selectedTerrain?.photo}
                  className="card-media"
                />
                <DialogContentText>
                  <span>Área de cultivo:</span> {selectedTerrain?.area}
                  <br />
                  <span>Tipo de suelo:</span> {selectedTerrain?.soilType}
                  <br />
                  <span>Días restantes:</span>{" "}
                  {selectedTerrain?.remainingDays === 0 ? (
                    <span className="ready-for-sale">
                      0 (listo para la venta)
                    </span>
                  ) : (
                    <span id="remaining-days">
                      {selectedTerrain?.remainingDays}
                    </span>
                  )}
                  <br />
                  <br />
                  <span>Nombre del agricultor:</span>{" "}
                  {selectedTerrain?.fullName}
                  <br />
                  <span>Email de contacto:</span> {selectedTerrain?.email}
                </DialogContentText>
              </DialogContent>
              <DialogActions className="dialog-actions">
                <Button onClick={handleCloseModal} color="primary">
                  Cerrar
                </Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Container>
    </>
  );
}
