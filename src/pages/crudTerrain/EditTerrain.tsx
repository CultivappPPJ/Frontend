import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "axios";
import ModalDelete from "../../components/ModalDelete";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "../../types";

interface IFormInput {
  fullName: string;
  area: number;
  soilType: "Arenoso" | "Mixto" | "Ácido" | "Calizo" | "Supresivo";
  plantType: string;
  photo: string;
  remainingDays: number;
  forSale: boolean;
}

const CenteredTableCell: React.FC<
  React.HTMLAttributes<HTMLTableCellElement>
> = (props) => <TableCell {...props} sx={{ textAlign: "center" }} />;

export default function EditTerrain() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { token, status } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IFormInput>({
    defaultValues: {
      fullName: "",
      area: 0,
      soilType: "Mixto",
      plantType: "Olivo",
      photo: "url",
      remainingDays: 0,
      forSale: true,
    },
  });
  const [terrain, setTerrain] = useState<IFormInput | null>(null);
  const [selectedSquares, setSelectedSquares] = useState<Set<number>>(
    new Set()
  );
  const [formLocked, setFormLocked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTerrainName, setSelectedTerrainName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClickOpen = (terrainName: string) => {
    setOpenDialog(true);
    setSelectedTerrainName(terrainName);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setTerrain(data);
    setFormLocked(true);
  };

  const handleAdd = async (data: IFormInput) => {
    const terrainData = {
      ...data,
      email: userEmail,
      fullName: fullName,
    };

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_UPDATE}/${id}`,
        terrainData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setSnackbarMessage("Actualizado con éxito");
      setSnackbarOpen(true);
      setTerrain(null);
      reset();
      setFormLocked(false);
      setTimeout(() => {
        navigate("/my/terrain");
      }, 2000);
    } catch (error) {
      console.error("Ocurrió un error al agregar el terreno: ", error);
    }
  };

  const handleModify = () => {
    if (terrain) {
      setFormLocked(false);
      setValue("fullName", terrain.fullName);
      setValue("area", terrain.area);
      setValue("soilType", terrain.soilType);
      setValue("plantType", terrain.plantType);
      setValue("photo", terrain.photo);
      setValue("remainingDays", terrain.remainingDays);
      setValue("forSale", terrain.forSale);
    }
  };

  const handleDelete = () => {
    setTerrain(null);
    reset();
    setFormLocked(false);
    setOpenDialog(false);
  };

  const handleSquareClick = (index: number) => {
    const updatedSelection = new Set(selectedSquares);

    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }

    setSelectedSquares(updatedSelection);
  };

  const generateVisualGrid = (
    area: number,
    selectedSquares: Set<number>,
    handleSquareClick: (index: number) => void
  ) => {
    const squares = Array.from({ length: area }, (_, index) => (
      <Grid item key={index}>
        <div
          onClick={() => handleSquareClick(index)}
          style={{
            width: "35px",
            height: "35px",
            backgroundColor: selectedSquares.has(index)
              ? "lightcoral"
              : "lightblue",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        />
      </Grid>
    ));

    return (
      <Grid container spacing={1}>
        {squares}
      </Grid>
    );
  };

  useEffect(() => {
    const fetchTerrainData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_GET_TERRAIN_BY_ID}/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
          setTerrain(data);
          // Rellenar el formulario con los datos existentes
          Object.keys(data).forEach((key) => {
            setValue(key, data[key]);
          });
          setFormLocked(true);
        } catch (error) {
          console.error(
            "Ocurrió un error al cargar los datos del terreno: ",
            error
          );
        }
      }
    };

    fetchTerrainData();
  }, [id, token, setValue]);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUserEmail(decoded.sub);
        setFullName(decoded.firstName + " " + decoded.lastName);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [token]);

  useEffect(() => {
    if (token === null) {
      navigate("/");
    }
  }, [token, status, navigate]);

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
    <Container maxWidth="xl" sx={{ mb: "4rem" }}>
      <Typography variant="h5" sx={{ py: "1rem", textAlign: "center" }}>
        Editar Terreno
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              disabled={formLocked}
              size="small"
              label="Área en hectáreas"
              type="number"
              variant="outlined"
              fullWidth
              {...register("area", {
                required: "Este campo es obligatorio",
                min: {
                  value: 1,
                  message: "El valor debe ser un número positivo",
                },
                max: {
                  value: 50,
                  message: "El valor debe ser menor a 50",
                },
              })}
              error={!!errors.area}
              helperText={errors.area?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              disabled={formLocked}
              size="small"
              label="Tipo de Suelo"
              select
              variant="outlined"
              fullWidth
              {...register("soilType", {
                required: "Este campo es obligatorio",
              })}
              error={!!errors.soilType}
              helperText={errors.soilType?.message}
            >
              <MenuItem value="Arenoso">Arenoso</MenuItem>
              <MenuItem value="Mixto">Mixto</MenuItem>
              <MenuItem value="Ácido">Ácido</MenuItem>
              <MenuItem value="Calizo">Calizo</MenuItem>
              <MenuItem value="Supresivo">Supresivo</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              disabled={formLocked}
              size="small"
              label="Vegetal"
              variant="outlined"
              fullWidth
              {...register("plantType", {
                required: "Este campo es obligatorio",
              })}
              error={!!errors.plantType}
              helperText={errors.plantType?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              disabled={formLocked}
              size="small"
              label="URL de la imagen"
              variant="outlined"
              fullWidth
              {...register("photo", { required: "Este campo es obligatorio" })}
              error={!!errors.photo}
              helperText={errors.photo?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              disabled={formLocked}
              size="small"
              label="Días restantes para la cosecha"
              type="number"
              variant="outlined"
              fullWidth
              {...register("remainingDays", {
                required: "Este campo es obligatorio",
                min: {
                  value: 1,
                  message: "El valor debe ser un número positivo",
                },
              })}
              error={!!errors.remainingDays}
              helperText={errors.remainingDays?.message}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <TextField
              disabled={formLocked}
              size="small"
              label="En Venta"
              select
              variant="outlined"
              fullWidth
              {...register("forSale", {
                required: "Este campo es obligatorio",
              })}
              error={!!errors.forSale}
              helperText={errors.forSale?.message}
            >
              <MenuItem value="true">Si</MenuItem>
              <MenuItem value="false">No</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              size="small"
              type="submit"
              variant="contained"
              color="primary"
              disabled={formLocked}
            >
              Agregar a la vista
            </Button>
          </Grid>
          {terrain && (
            <TableContainer
              component={Paper}
              sx={{ maxWidth: "xl", mt: "2rem", mx: "1rem", px: "1rem" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <CenteredTableCell>Imagen</CenteredTableCell>
                    <CenteredTableCell>Área en hectáreas</CenteredTableCell>
                    <CenteredTableCell>Tipo de Suelo</CenteredTableCell>
                    <CenteredTableCell>Tipo de Planta</CenteredTableCell>
                    <CenteredTableCell>Días Restantes</CenteredTableCell>
                    <CenteredTableCell>Tipo de Venta</CenteredTableCell>
                    <CenteredTableCell>Acción</CenteredTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <CenteredTableCell>
                      {terrain.photo && (
                        <img
                          src={terrain.photo}
                          alt={`Imagen de ${terrain.fullName}`}
                          style={{
                            width: "250px",
                            height: "200px",
                            borderRadius: "5px",
                          }}
                        />
                      )}
                    </CenteredTableCell>
                    <CenteredTableCell>{terrain.area}</CenteredTableCell>
                    <CenteredTableCell>{terrain.soilType}</CenteredTableCell>
                    <CenteredTableCell>{terrain.plantType}</CenteredTableCell>
                    <CenteredTableCell>
                      {terrain.remainingDays}
                    </CenteredTableCell>
                    <CenteredTableCell>{terrain.forSale}</CenteredTableCell>
                    <CenteredTableCell>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "1rem",
                        }}
                      >
                        <Button
                          size="small"
                          onClick={() => handleAdd(terrain)}
                          variant="outlined"
                          color="primary"
                        >
                          Guardar Terreno
                        </Button>
                        <Button
                          size="small"
                          onClick={handleModify}
                          variant="outlined"
                          color="warning"
                        >
                          Modificar Terreno
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleClickOpen(terrain.fullName)}
                          variant="outlined"
                          color="error"
                        >
                          Eliminar Terreno
                        </Button>
                      </Box>
                    </CenteredTableCell>
                  </TableRow>
                  <TableHead>
                    <CenteredTableCell>
                      Área en hectáreas a plantar
                    </CenteredTableCell>
                  </TableHead>
                  <TableRow>
                    <CenteredTableCell>
                      {generateVisualGrid(
                        terrain.area,
                        selectedSquares,
                        (squareIndex) => handleSquareClick(squareIndex)
                      )}
                    </CenteredTableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Grid>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <ModalDelete
        openDialog={openDialog}
        handleClose={handleClose}
        handleDelete={handleDelete}
        terrainName={selectedTerrainName}
      />
    </Container>
  );
}
