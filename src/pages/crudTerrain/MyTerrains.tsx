import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useEffect, useState } from "react";
import { Root, TerrainResponse } from "../../types";
import ModalDelete from "../../components/ModalDelete";
import { Link } from "react-router-dom";

export default function MyTerrains() {
  const [terrains, setTerrains] = useState<TerrainResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTerrainId, setSelectedTerrainId] = useState<number | null>(
    null
  );
  const [selectedTerrainName, setSelectedTerrainName] = useState<string>("");
  const token = localStorage.getItem("token");

  const handleClickOpen = (terrainId: number, terrainName: string) => {
    setOpenDialog(true);
    setSelectedTerrainId(terrainId);
    setSelectedTerrainName(terrainName);
  };

  const handleClose = () => {
    setOpenDialog(false);
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

  const fetchData = async () => {
    if (!token) return;
    const userEmail = "berryfarmer@example.com";
    try {
      const response = await axios.get<Root>(
        `${import.meta.env.VITE_MYTERRAINS}`,
        {
          params: {
            email: userEmail,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTerrains(response.data?.content);
    } catch (err) {
      setError("Error fetching data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

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
        {terrains.map((terrain) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={terrain.id}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  style={{ marginBottom: "20px" }}
                >{`Cultivo n° ${terrain.id} (${terrain.plantType})`}</Typography>
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
        ))}
      </Grid>
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
