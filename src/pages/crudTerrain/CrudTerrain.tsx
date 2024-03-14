import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Container,
  Grid,
  MenuItem,
  Typography,
  TableContainer,
  Table,
  TableHead,
  Paper,
  TableRow,
  TableCell,
  TableBody,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ModalDelete from "../../components/ModalDelete";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { IFormInput, TokenPayload } from "../../types";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface IFormInput {
  fullName: string;
  area: number;
  soilType: "Arenoso" | "Mixto" | "Ácido" | "Calizo" | "Supresivo";
  plantType: string;
  photo: string;
  harvestDate: string;
  forSale: boolean;
}

const CenteredTableCell: React.FC<
  React.HTMLAttributes<HTMLTableCellElement>
> = (props) => <TableCell {...props} sx={{ textAlign: "center" }} />;

export default function CrudTerrain() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
  } = useForm<IFormInput>();
  const [terrain, setTerrain] = useState<IFormInput | null>(null);
  const [selectedSquares, setSelectedSquares] = useState<Set<number>>(
    new Set()
  );
  const [formLocked, setFormLocked] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTerrainName, setSelectedTerrainName] = useState<string>("");
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const { token, status } = useSelector((state: RootState) => state.auth);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

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
      harvestDate: selectedDate || '', // Ensure we don't submit null for harvestDate
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_CREATE}`,
        terrainData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      setSnackbarMessage("Agregado con éxito");
      setSnackbarOpen(true);
      setTerrain(null);
      reset();
      setFormLocked(false);
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
      setValue("seedTypeIds", terrain.seedTypeIds);
      setValue("photo", terrain.photo);
      setValue("harvestDate", terrain.harvestDate);
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
    <Container maxWidth="xl" sx={{ mb: "4rem" }}>
      <Typography variant="h5" sx={{ py: "1rem", textAlign: "center" }}>
        Agregar Terreno
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{
                required: "Nombre es requerido",
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  disabled={formLocked}
                  margin="normal"
                  required
                  variant="outlined"
                  fullWidth
                  label="Nombre del terreno"
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>
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
            <ComboBox />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Controller
              name="photo"
              control={control}
              defaultValue=""
              rules={{
                required: "URL de la imagen es requerido",
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  disabled={formLocked}
                  margin="normal"
                  required
                  variant="outlined"
                  fullWidth
                  label="URL de la imagen"
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
  <TextField
    disabled={formLocked}
    size="small"
    label="Fecha de cosecha"
    type="date"
    variant="outlined"
    fullWidth
    {...register("harvestDate", {
      required: "Este campo es obligatorio",
      validate: {
        futureDate: (value) => {
          const currentDate = new Date().toISOString().split('T')[0];
          return value > currentDate || "La fecha de cosecha debe ser posterior a la fecha actual";
        },
      },
    })}
    error={!!errors.harvestDate}
    helperText={errors.harvestDate?.message}
    InputLabelProps={{ shrink: true }}
    placeholder=""
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
                    <CenteredTableCell>Fecha de Cosecha</CenteredTableCell>
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
                    <CenteredTableCell>{terrain.harvestDate}</CenteredTableCell>
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
                          Agregar Terreno
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
      </Box>
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
