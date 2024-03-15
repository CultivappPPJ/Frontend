import React, { useEffect, useState } from "react";
import {
  useForm,
  SubmitHandler,
  Controller,
  useFieldArray,
} from "react-hook-form";
import {
  Button,
  TextField,
  Container,
  Grid,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
} from "@mui/material";
import axios from "axios";
import { IFormInput, SeedType, TokenPayload } from "../../types";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import DeleteIcon from "@mui/icons-material/Delete";
import { jwtDecode } from "jwt-decode";

export default function EditTerrain() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const { token, status } = useSelector((state: RootState) => state.auth);
  const { handleSubmit, control, setValue } = useForm<IFormInput>();
  const [availableSeedTypes, setAvailableSeedTypes] = useState<SeedType[]>([]);
  const [seedTypeSelections, setSeedTypeSelections] = useState<SeedType[]>([]);
  const { fields, append, remove } = useFieldArray({
    control,
    name: "seedTypeIds",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/seed-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setAvailableSeedTypes(response.data);
        if (response.data.length > 0) {
          setSeedTypeSelections([response.data[0]]);
        }
      })
      .catch((error) => console.error("There was an error!", error));
  }, [token]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    // Mapear seedTypes para obtener solo los IDs
    const seedTypeIds = data.seedTypes.map((seedType) => seedType.id);

    const updatedTerrainData = {
      ...data,
      seedTypeIds, // Solo envía los IDs
      // No incluir seedTypes en la actualización si no es necesario
      email: userEmail,
      fullName: fullName,
    };

    // Eliminar propiedades que no son necesarias para la actualización
    delete updatedTerrainData.seedTypes;

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_UPDATE}/${id}`, // Asegúrate de incluir el ID del terreno en la URL
        updatedTerrainData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setSnackbarMessage("Actualizado con éxito");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/my/terrain");
      }, 1000);
    } catch (error) {
      console.error("Ocurrió un error al actualizar el terreno: ", error);
    }
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
          // Rellenar el formulario con los datos existentes
          Object.keys(data).forEach((key) => {
            if (key in data) {
              setValue(key as keyof IFormInput, data[key]);
            }
          });
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
    if (availableSeedTypes.length > 0 && seedTypeSelections.length === 0) {
      setSeedTypeSelections([availableSeedTypes[0]]);
    }
  }, [availableSeedTypes, seedTypeSelections]);

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

  useEffect(() => {
    if (availableSeedTypes.length > 0 && fields.length === 0) {
      append({ id: availableSeedTypes[0].id });
    }
  }, [append, availableSeedTypes, fields.length]);

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

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <Container maxWidth="lg" sx={{ my: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Actualizar Terreno
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid
          container
          spacing={3}
          justifyContent="center"
          alignItems="center"
          direction="column"
        >
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              defaultValue=""
              rules={{ required: "Nombre es requerido" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
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
            <Controller
              name="area"
              control={control}
              defaultValue={1}
              rules={{
                required: "Este campo es obligatorio",
                min: {
                  value: 1,
                  message: "El valor debe ser un número positivo",
                },
                max: {
                  value: 50,
                  message: "El valor debe ser menor a 50",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  variant="outlined"
                  fullWidth
                  label="Área en hectáreas"
                  type="number"
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="soilType"
              control={control}
              defaultValue="Mixto"
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  label="Tipo de Suelo"
                  error={!!error}
                  helperText={error ? error.message : null}
                >
                  <MenuItem value="Arenoso">Arenoso</MenuItem>
                  <MenuItem value="Mixto">Mixto</MenuItem>
                  <MenuItem value="Ácido">Ácido</MenuItem>
                  <MenuItem value="Calizo">Calizo</MenuItem>
                  <MenuItem value="Supresivo">Supresivo</MenuItem>
                </TextField>
              )}
            />
            {fields.map((item, index) => (
              <Grid item xs={12} md={6} key={item.id}>
                <Controller
                  name={`seedTypeIds.${index}.id`}
                  control={control}
                  defaultValue={item.id}
                  render={({ field }) => (
                    <Box display="flex" alignItems="center">
                      <TextField
                        {...field}
                        select
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        label="Tipo de Cultivo"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value)}
                      >
                        {availableSeedTypes.map((seedType) => (
                          <MenuItem key={seedType.id} value={seedType.id}>
                            {seedType.name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <IconButton
                        aria-label="delete"
                        onClick={() => remove(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  )}
                />
              </Grid>
            ))}
            {fields.length > 0 && (
              <Button
                variant="contained"
                onClick={() =>
                  append({ id: availableSeedTypes[0]?.id || null })
                }
              >
                + Añadir Cultivo
              </Button>
            )}

            <Controller
              name="photo"
              control={control}
              defaultValue=""
              rules={{ required: "URL de la imagen es requerido" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
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
            <Controller
              name="remainingDays"
              control={control}
              rules={{
                required: "Este campo es obligatorio",
                validate: {
                  isFutureDate: (value) =>
                    value >= getCurrentDate() ||
                    "La fecha de cosecha no puede ser un día anterior a la fecha actual.",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="date"
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  label="Fecha de cosecha"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!error}
                  helperText={error ? error.message : null}
                />
              )}
            />
            <Controller
              name="forSale"
              control={control}
              defaultValue={true}
              rules={{ required: "Este campo es obligatorio" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  select
                  margin="normal"
                  variant="outlined"
                  fullWidth
                  label="En Venta"
                  error={!!error}
                  helperText={error ? error.message : null}
                >
                  <MenuItem value="true">Sí</MenuItem>
                  <MenuItem value="false">No</MenuItem>
                </TextField>
              )}
            />
            <Controller
              name="location"
              control={control}
              defaultValue=""
              rules={{ required: "Ubicación es requerido" }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  margin="normal"
                  required
                  variant="outlined"
                  fullWidth
                  label="Ubicación del terreno"
                  error={!!error}
                  helperText={error ? error.message : ""}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Actualizar Terreno
            </Button>
          </Grid>
        </Grid>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}
