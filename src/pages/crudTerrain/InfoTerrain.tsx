import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { RootState } from "../../store";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { TerrainResponse, TokenPayload } from "../../types";
import { jwtDecode } from "jwt-decode";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ImageModal from "../../components/ImageModal";
import ModalDelete from "../../components/ModalDelete";

export default function InfoTerrain() {
  const { id } = useParams();
  const [terrain, setTerrain] = useState<TerrainResponse | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { token } = useSelector((state: RootState) => state.auth);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDialogDelete, setOpenDialogDelete] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedCropId, setSelectedCropId] = useState<number | null>(null);
  const [selectedCropName, setSelectedCropName] = useState<string>("");

  const handleClickOpenDelete = (cropId: number, cropName: string) => {
    setOpenDialogDelete(true);
    setSelectedCropId(cropId);
    setSelectedCropName(cropName);
  };

  const handleCloseDelete = () => {
    setOpenDialogDelete(false);
  };

  const handleClickOpen = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const fetchTerrainData = async () => {
    try {
      const response = await axios.get<TerrainResponse>(
        `${import.meta.env.VITE_TERRAIN}/${id}`
      );
      setTerrain(response.data);
    } catch (error) {
      console.error("Error al cargar los datos del terreno:", error);
    }
  };

  useEffect(() => {
    fetchTerrainData();
  }, [id]);

  const handleDelete = async () => {
    if (!selectedCropId) return;
    const deleteUrl = `${import.meta.env.VITE_DELETE_CROP}/${selectedCropId}`;

    try {
      await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOpenDialogDelete(false);
      fetchTerrainData();
    } catch (err) {
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

  if (!terrain) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <CircularProgress color="primary" />
      </div>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ my: 3 }}>
      <Grid
        container
        spacing={2}
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid item xs={12} sm={8} md={6}>
          <Paper style={{ padding: "20px" }} elevation={3}>
            <Card>
              <CardMedia
                component="img"
                image={terrain.photo}
                alt="Terrain"
                style={{ height: "350px", width: "100%", objectFit: "cover" }}
                onClick={() => handleClickOpen(terrain.photo)}
              />
            </Card>
            <Typography variant="h5" component="h1" sx={{ my: 1 }}>
              Nombre del Terreno: {terrain.name}
            </Typography>
            <Typography variant="body1">
              <strong>Nombre del agricultor:</strong> {terrain.fullName}
            </Typography>
            <Typography variant="body1">
              <strong>Área de Cultivo:</strong> {terrain.area}{" "}
              {terrain.area === "1" ? "Hectárea" : "Hectáreas"}
            </Typography>
            <Typography variant="body1">
              <strong>Tipo de suelo:</strong> {terrain.soilType}
            </Typography>
            <Typography variant="body1">
              <strong>Ubicación:</strong> {terrain.location}
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong> {terrain.email}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <Typography>
                <span>Contacto: </span>
              </Typography>
              <Button
                startIcon={<EmailIcon />}
                href={`mailto:${terrain.email}?subject=${encodeURIComponent(
                  `Consulta sobre el terreno "${terrain.name}"`
                )}&body=${encodeURIComponent(
                  `Buenos días señor/a ${terrain.fullName}, quiero cotizar los cultivos del terreno "${terrain.name}".`
                )}`}
                variant="text"
                color="primary"
                className="email-button"
              >
                Enviar Correo
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        {terrain.crops.map((crop) => (
          <Grid item xs={12} sm={6} md={4} key={crop.id}>
            <Card elevation={3}>
              <CardMedia
                component="img"
                height="250"
                image={crop.photo}
                alt={`Crop ${crop.seedType.name}`}
                onClick={() => handleClickOpen(crop.photo)}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="h3">
                  {crop.seedType.name}
                </Typography>
                <Typography variant="body1" color="textPrimary" component="p">
                  Área de Cultivo: {crop.area}{" "}
                  {crop.area === "1" ? "Hectárea" : "Hectáreas"}
                </Typography>
                <Typography variant="body1" color="textPrimary" component="p">
                  Fecha de Cosecha:{" "}
                  {crop.harvestDate.split("-").reverse().join("/")}
                </Typography>
                <Typography
                  variant="body1"
                  color="textPrimary"
                  component="p"
                  sx={{
                    color: crop.forSale ? "green" : "red",
                  }}
                >
                  <strong>
                    {crop.forSale
                      ? "Disponible para venta"
                      : "No disponible para venta"}
                  </strong>
                </Typography>
                {terrain.email === userEmail && (
                  <Grid
                    container
                    spacing={2}
                    justifyContent="flex-end"
                    sx={{ mt: 2 }}
                  >
                    <Grid item>
                      <Button
                        component={Link}
                        to={`/update/crop/${crop.id}`}
                        variant="outlined"
                        color="warning"
                        startIcon={<EditIcon />}
                      >
                        Editar
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          handleClickOpenDelete(crop.id, crop.seedType.name)
                        }
                        startIcon={<DeleteIcon />}
                      >
                        Eliminar
                      </Button>
                    </Grid>
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <ImageModal
        open={openDialog}
        onClose={handleClose}
        imageUrl={selectedImage}
      />
      <ModalDelete
        openDialog={openDialogDelete}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
        terrainName={selectedCropName}
      />
    </Container>
  );
}
