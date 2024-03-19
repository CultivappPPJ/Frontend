import { ChangeEvent, useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import axios from "axios";
import { IFormCrop, SeedType } from "../../types";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom";

export default function AddCrops() {
  const { id } = useParams();
  const { handleSubmit, reset, control } = useForm<IFormCrop>();
  const navigate = useNavigate();
  const { token, status } = useSelector((state: RootState) => state.auth);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [seedType, setSeedType] = useState<SeedType[]>([]);

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleNumericInput =
    (onChange: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
      onChange(onlyNums);
    };

  const onSubmit: SubmitHandler<IFormCrop> = async (data) => {
    const terrainData = {
      ...data,
      terrainId: id,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ADD_CROPS}`,
        terrainData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setSnackbarMessage("Agregado con éxito");
      setSnackbarOpen(true);
      reset({
        seedTypeId: "",
        area: 1,
        photo: "",
        harvestDate: "",
        forSale: true,
      });
    } catch (error) {
      console.error("Ocurrió un error al agregar un cultivo: ", error);
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/seed-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSeedType(response.data);
      })
      .catch((error) => console.error("There was an error!", error));
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
          Agregar Cultivo
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
                name="seedTypeId"
                control={control}
                defaultValue={""}
                rules={{ required: "El tipo de semilla es obligatorio" }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    select
                    label="Tipo de Semilla"
                    fullWidth
                    margin="normal"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  >
                    {seedType.map((type) => (
                      <MenuItem key={type.id} value={type.id}>
                        {type.name}
                      </MenuItem>
                    ))}
                  </TextField>
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
                name="harvestDate"
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
                render={({ field }) => (
                  <FormControl component="fieldset" margin="normal">
                    <FormLabel component="legend">
                      Disponible para la Venta
                    </FormLabel>
                    <RadioGroup
                      {...field}
                      row
                      aria-label="forSale"
                      name="row-radio-buttons-group"
                      value={field.value ? "true" : "false"}
                      onChange={(e) =>
                        field.onChange(e.target.value === "true")
                      }
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Sí"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  </FormControl>
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
                to="/my/terrain"
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
              >
                Agregar
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
