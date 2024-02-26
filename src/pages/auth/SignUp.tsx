import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { emailPattern } from "../../utils/emailValidation";
import { ChangeEvent, useState } from "react";
import { Link } from "react-router-dom";
import { SignUpData } from "../../types";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

export default function SignUp() {
  const { control, handleSubmit } = useForm<SignUpData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (data: SignUpData) => {
    setLoading(true);

    axios({
      method: "post",
      url: import.meta.env.VITE_SIGNUP,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    })
      .then((response) => {
        setLoading(false);
        console.log(response.data);
        enqueueSnackbar("Registration Successful!", { variant: "success" });
        // TODO: Redirect to the user dashboard, similar a cómo se maneja en el ejemplo de signIn
      })
      .catch((error) => {
        setLoading(false);
        let errorMsg = "An error occurred. Please try again.";
        if (error.response) {
          console.log(error.response.data);
          errorMsg = error.response.data.error
            ? error.response.data.error
            : errorMsg;
        } else if (error.request) {
          // La solicitud fue hecha pero no se recibió respuesta
          console.log(error.request);
        } else {
          // Algo ocurrió en la configuración de la solicitud que causó un error
          console.log("Error", error.message);
        }
        setError(errorMsg);
        enqueueSnackbar(errorMsg, { variant: "error" });
      });
  };

  const handleLettersInput =
    (onChange: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const onlyLetters = e.target.value.replace(/[^a-zA-Z]/g, "");
      if (onlyLetters.length <= 14) {
        onChange(onlyLetters);
      }
    };

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
          Sign up
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
                  required: "First name is required",
                  minLength: {
                    value: 3,
                    message: "First name must be at least 3 characters",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    required
                    fullWidth
                    label="First Name"
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
                  required: "Last name is required",
                  minLength: {
                    value: 3,
                    message: "Last name must be at least 3 characters",
                  },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    required
                    fullWidth
                    label="Last Name"
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
                name="phoneNumber"
                control={control}
                defaultValue=""
                rules={{
                  required: "Phone number required",
                  minLength: { value: 9, message: "Must be exactly 9 digits" },
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <TextField
                    required
                    fullWidth
                    label="Phone Number"
                    autoComplete="tel"
                    error={!!error}
                    helperText={error ? error.message : ""}
                    value={value}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                      if (onlyNums.length <= 9) {
                        onChange(onlyNums);
                      }
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
                  required: "Email required",
                  pattern: emailPattern,
                }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label="Email Address"
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
                  required: "Password required",
                  minLength: {
                    value: 4,
                    message: "Password must be at least 4 characters",
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
            disabled={loading}
          >
            Sign Up
          </Button>
          {error && (
            <Typography component={"p"} sx={{ color: "red", pb: "1rem" }}>
              {error}
            </Typography>
          )}
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/signin">Already have an account? Sign in</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
