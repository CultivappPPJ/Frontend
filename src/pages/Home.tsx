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
import Pagination from "@mui/material/Pagination";
import { useEffect, useState } from "react";
import TerrainCard from "../components/TerrainCard";
import "../styles/styles.css";
import axios from "axios";
import { TerrainResponse } from "../types";

export default function Home() {
  const [terrainsData, setTerrainsData] = useState<TerrainResponse[]>([]);
  const [selectedTerrain, setSelectedTerrain] =
    useState<TerrainResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 1,
  });

  // Realizar la solicitud axios al back end
  const fetchData = async (pageNumber = 0) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/v1/terrain/all?page=${pageNumber}&size=6`
      );
      const data = response.data;
      setTerrainsData(data.content); // Actualizar el estado con los datos obtenidos de la API
      setPaginationInfo({
        currentPage: response.data?.pageNumber + 1,
        totalPages: response.data?.totalPages,
      });
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // El array vacío asegura que la solicitud se realice solo una vez al montar el componente

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    fetchData(newPage - 1);
  };

  const handleCardClick = (terrain: TerrainResponse) => {
    setSelectedTerrain(terrain);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
              {terrainsData.length > 0
                ? "¡Bienvenido a CultivApp! Cultivos disponibles para ventas:"
                : "¡Bienvenido a CultivApp! Aún no hay cultivos a la venta"}
            </Typography>
            {terrainsData.length === 0 ? (
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
                  terrainsData.length === 1 || terrainsData.length === 2
                    ? "center"
                    : "flex-start"
                }
                alignItems="stretch"
              >
                {terrainsData.map((terrain) => (
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
            {terrainsData.length > 0 && (
              <Pagination
                count={paginationInfo.totalPages}
                page={paginationInfo.currentPage}
                onChange={handleChangePage}
                color="primary"
                size="large"
                className="pagination"
              />
            )}

            {/* Modal */}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
              <DialogTitle className="dialog-title">{`Cultivo de ${selectedTerrain?.name}`}</DialogTitle>
              <DialogContent>
                <CardMedia
                  component="img"
                  alt={selectedTerrain?.name}
                  height="200px"
                  image={selectedTerrain?.photo}
                  className="card-media"
                />
                <DialogContentText>
                  <span>Área de cultivo:</span> {selectedTerrain?.area}{" "}
                  hectareas
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
                  <span>Tipo cultivos:</span>{" "}
                  {selectedTerrain?.seedTypes
                    .map((seed) => seed.name)
                    .join(" - ")}
                  <br />
                  <br />
                  <span>Nombre del agricultor:</span>{" "}
                  {selectedTerrain?.fullName}
                  <br />
                  <span>Email de contacto:</span> {selectedTerrain?.email}
                </DialogContentText>
              </DialogContent>
              <DialogActions className="dialog-actions">
                <Button onClick={handleCloseModal} color="error">
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
