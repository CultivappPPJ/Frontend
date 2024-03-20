import {
  Card,
  Typography,
  Container,
  Grid,
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
        currentPage: response.data?.pageable?.pageNumber + 1,
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
            <Typography variant="h5" className="welcome-message">
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
                    <Card className="terrain-card">
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
          </>
        )}
      </Container>
    </>
  );
}
