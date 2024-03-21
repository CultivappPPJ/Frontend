import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  TextField,
  Container,
  Grid,
  MenuItem,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import axios from "axios";
import { IFormInput, TokenPayload } from "../../types";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export default function EditTerrain() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const fileInputRef = useRef(null);
  const { handleSubmit, control, setValue, reset } = useForm<IFormInput>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);

  const handleLettersInput =
    (onChange: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, "");
      if (onlyLetters.length <= 14) {
        onChange(onlyLetters);
      }
    };

  const handleNumericInput =
    (onChange: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
      onChange(onlyNums);
    };

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    setIsSubmitting(true);
    let imageUrl = "";

    if (data.photo) {
      const formData = new FormData();
      formData.append("file", data.photo);
      formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
      formData.append("cloud_name", import.meta.env.VITE_CLOUD_NAME);

      try {
        const uploadResponse = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUD_NAME
          }/image/upload`,
          formData
        );
        imageUrl = uploadResponse.data.secure_url;
      } catch (error) {
        console.error("Error al cargar la imagen a Cloudinary:", error);
        setSnackbarMessage("Error al cargar la imagen");
        setSnackbarOpen(true);
        return;
      }
    }

    const terrainData = {
      ...data,
      email: userEmail,
      fullName: fullName,
      photo: imageUrl,
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
      console.log(response);
      setSnackbarMessage("Actualizado con éxito");
      setSnackbarOpen(true);
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setTimeout(() => {
        navigate("/my/terrain");
      }, 2000);
    } catch (error) {
      console.error("Ocurrió un error al agregar el terreno: ", error);
      setSnackbarMessage("Error al agregar el terreno");
      setSnackbarOpen(true);
    } finally {
      setIsSubmitting(false);
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

  return (
    <Container component="main" maxWidth="sm" sx={{ my: 5 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h5" align="left" sx={{ mb: 2 }}>
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
                rules={{
                  required: "Nombre es requerido",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres.",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    required
                    fullWidth
                    label="Nombre del terreno"
                    autoComplete="given-name"
                    autoFocus
                    error={!!error}
                    helperText={error ? error.message : ""}
                    value={value}
                    onChange={handleLettersInput(onChange)}
                    inputProps={{
                      maxLength: 14,
                    }}
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
                    message: "El valor debe ser menor o igual a 50",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Área en hectáreas"
                    placeholder="Ej: 10"
                    type="text"
                    InputProps={{ inputMode: "numeric" }}
                    error={!!error}
                    helperText={error ? error.message : null}
                    value={value}
                    onChange={handleNumericInput(onChange)}
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
                    <MenuItem value="Mixto">Mixto</MenuItem>
                    <MenuItem value="Arenoso">Arenoso</MenuItem>
                    <MenuItem value="Ácido">Ácido</MenuItem>
                    <MenuItem value="Calizo">Calizo</MenuItem>
                    <MenuItem value="Supresivo">Supresivo</MenuItem>
                  </TextField>
                )}
              />
              <Controller
                name="photo"
                control={control}
                defaultValue=""
                rules={{ required: "La imagen es obligatoria" }}
                render={({
                  field: { onChange, onBlur, name },
                  fieldState: { error },
                }) => (
                  <TextField
                    onBlur={onBlur}
                    onChange={(e) => onChange(e.target.files[0])}
                    inputRef={fileInputRef}
                    name={name}
                    type="file"
                    error={!!error}
                    helperText={error ? error.message : null}
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Cargar imagen"
                  />
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                pl: "24px",
                pt: "24px",
              }}
            >
              <Button
                component={Link}
                to="/"
                variant="text"
                color="error"
                size="large"
                startIcon={<CloseIcon />}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                startIcon={<AddIcon />}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Actualizando..." : "Actualizar"}
              </Button>
            </Box>
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
      </Box>
    </Container>
  );
}
