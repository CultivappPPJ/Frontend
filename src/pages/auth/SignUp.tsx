import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { emailPattern } from "../../utils/emailValidation";
import { ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpData } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { clearError, signUp } from "../../features/auth/authSlice";
import { AppDispatch, RootState } from "../../store";

export default function SignUp() {
  const { control, handleSubmit } = useForm<SignUpData>();
  const dispatch: AppDispatch = useDispatch();
  const {
    token,
    status,
    error: authError,
  } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const onSubmit = (data: SignUpData) => {
    dispatch(signUp(data));
    dispatch(clearError());
  };

  const handleLettersInput =
    (onChange: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, "");
      if (onlyLetters.length <= 14) {
        onChange(onlyLetters);
      }
    };

  useEffect(() => {
    if (token && status !== "loading") {
      navigate("/");
    }
  }, [token, status, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  if (token && status !== "loading") {
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
    <Container
      component="main"
      maxWidth="xs"
      sx={{ display: "flex", alignItems: "center", height: "100vh" }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
        }}
      >
        <Typography component="h1" variant="h5">
          Crear Cuenta
        </Typography>
        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="firstName"
                control={control}
                defaultValue=""
                rules={{
                  required: "El nombre es requerido",
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
                    label="Nombre"
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
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="lastName"
                control={control}
                defaultValue=""
                rules={{
                  required: "El apellido es requerido",
                  minLength: {
                    value: 3,
                    message: "El apellido debe tener al menos 3 caracteres.",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    required
                    fullWidth
                    label="Apellido"
                    autoComplete="family-name"
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
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="email"
                control={control}
                defaultValue=""
                rules={{
                  required: "Email es requerido",
                  pattern: emailPattern,
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Email"
                    autoComplete="email"
                    error={!!error}
                    helperText={error ? error.message : ""}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{
                  required: "Password es requerido",
                  minLength: {
                    value: 4,
                    message: "Password debe tener al menos 4 caracteres.",
                  },
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    error={!!error}
                    helperText={error ? error.message : ""}
                    inputProps={{
                      maxLength: 14,
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Creando la cuenta..." : "Crear Cuenta"}
          </Button>
          {authError && (
            <Typography component={"p"} sx={{ color: "red", pb: "1rem" }}>
              {authError}
            </Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button component={Link} to="/signin">
                ¿Ya tienes una cuenta? Inicia sesión
              </Button>
            </Grid>
            <Grid item>
              <Button component={Link} to="/">
                Volver al inicio
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
