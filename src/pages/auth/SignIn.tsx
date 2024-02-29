import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { emailPattern } from "../../utils/emailValidation";
import { SignInData } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { clearError, signIn } from "../../features/auth/authSlice";
import { RootState, AppDispatch } from "../../store";
import { useEffect } from "react";

export default function SignIn() {
  const { control, handleSubmit } = useForm<SignInData>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const {
    token,
    status,
    error: authError,
  } = useSelector((state: RootState) => state.auth);

  const onSubmit = (data: SignInData) => {
    dispatch(signIn(data));
    dispatch(clearError());
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
          Iniciar Sesión
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
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
                margin="normal"
                required
                fullWidth
                label="Email"
                autoComplete="email"
                autoFocus
                error={!!error}
                helperText={error ? error.message : ""}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "Password es requerido",
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Iniciando Sesión..." : "Iniciar Sesión"}
          </Button>
          {authError && (
            <Typography component={"p"} sx={{ color: "red", pb: "1rem" }}>
              {authError}
            </Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Button component={Link} to="/signup">
                ¿No tienes una cuenta? Creala aquí!
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
