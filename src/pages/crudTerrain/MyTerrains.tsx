import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Box,
  Pagination,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { Root, TerrainResponse, TokenPayload } from "../../types";
import ModalDelete from "../../components/ModalDelete";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { jwtDecode } from "jwt-decode";

export default function MyTerrains() {
  const [terrains, setTerrains] = useState<TerrainResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: 0,
    totalPages: 1,
  });
  const [selectedTerrainId, setSelectedTerrainId] = useState<number | null>(
    null
  );
  const [selectedTerrainName, setSelectedTerrainName] = useState<string>("");
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { token, status } = useSelector((state: RootState) => state.auth);

  const handleClickOpen = (terrainId: number, terrainName: string) => {
    setOpenDialog(true);
    setSelectedTerrainId(terrainId);
    setSelectedTerrainName(terrainName);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleChangePage = (
    event: React.ChangeEvent<unknown>,
    newPage: number
  ) => {
    fetchData(newPage - 1);
  };

  const handleDelete = async () => {
    if (!selectedTerrainId) return;
    const deleteUrl = `${import.meta.env.VITE_DELETE}/${selectedTerrainId}`;

    try {
      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenDialog(false);
      fetchData();
    } catch (err) {
      setError("Error al eliminar el terreno");
      console.error(err);
    }
  };

  const fetchData = async (pageNumber = 0) => {
    if (!token) return;
    try {
      const response = await axios.get<Root>(
        `${import.meta.env.VITE_MYTERRAINS}?page=${pageNumber}&size=6`,
        {
          params: {
            email: userEmail,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTerrains(response.data.content);
      setPaginationInfo({
        currentPage: response.data.pageable.pageNumber + 1,
        totalPages: response.data.totalPages,
      });
    } catch (err) {
      setError("Error fetching data");
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUserEmail(decoded.sub);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (userEmail) {
      fetchData();
    }
  }, [userEmail]);

  useEffect(() => {
    if (token === null) {
      navigate("/signin");
    }
  }, [token, navigate]);

  if (status !== "idle") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Grid
        container
        spacing={2}
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          marginY: "2rem",
        }}
      >
        {terrains.length === 0 ? (
          <Typography
            variant="h4"
            sx={{ textAlign: "center", marginTop: "2rem" }}
          >
            No hay terrenos disponibles
          </Typography>
        ) : (
          terrains.map((terrain) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={terrain.id}>
              <Card>
                <CardContent>
                  <Typography
                    variant="h6"
                    style={{ marginBottom: "20px" }}
                  >{`Cultivo de ${terrain.plantType}`}</Typography>
                  <CardMedia
                    component="img"
                    alt={terrain.plantType}
                    height="200px"
                    image={terrain.photo}
                    style={{ marginBottom: "20px" }}
                  />
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Agricultor:</span>{" "}
                    {terrain.fullName}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Contacto:</span>{" "}
                    {terrain.email}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Area de Cultivo:</span>{" "}
                    {terrain.area} hectareas
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>Tipo de Cultivo:</span>{" "}
                    {terrain.plantType}
                  </Typography>
                  <Typography>
                    <span style={{ fontWeight: "bold" }}>En Venta:</span>{" "}
                    {terrain.forSale ? "Sí" : "No"}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "10px",
                    }}
                  >
                    <Button
                      variant="contained"
                      color="warning"
                      sx={{ color: "white" }}
                      component={Link}
                      to={`/update/${terrain.id}`}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() =>
                        handleClickOpen(terrain.id, terrain.plantType)
                      }
                      startIcon={<DeleteIcon />}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          marginY: "1rem",
        }}
      >
        <Pagination
          count={paginationInfo.totalPages}
          page={paginationInfo.currentPage}
          onChange={handleChangePage}
          color="primary"
          size="large"
          className="pagination"
        />
      </Box>
      <ModalDelete
        openDialog={openDialog}
        handleClose={handleClose}
        handleDelete={handleDelete}
        terrainName={selectedTerrainName}
      />
      {error && <p>{error}</p>}
    </Container>
  );
}
