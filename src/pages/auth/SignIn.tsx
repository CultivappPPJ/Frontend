import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { emailPattern } from "../../utils/emailValidation";
import { SignInData, SignInResponse } from "../../types";
import { useState } from "react";

export default function SignIn() {
  const { control, handleSubmit } = useForm<SignInData>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (data: SignInData) => {
    fetch(import.meta.env.VITE_SIGNIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        setLoading(false);
        const responseData = await response.json();
        if (!response.ok) {
          switch (responseData.errorCode) {
            case "EMAIL_NOT_FOUND":
              setError("Email is not registered.");
              break;
            case "INVALID_CREDENTIALS":
              setError("Credentials are incorrect.");
              break;
            default:
              setError("Authentication error.");
          }
        }
        return responseData;
      })
      .then((data: SignInResponse) => {
        console.log(data);
        // TODO: Redirect to the user dashboard
      })
      .catch((error: Error) => {
        console.error("Error:", error.message);
        setError(error.message);
      });
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
          Sign in
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
              required: "Email required",
              pattern: emailPattern,
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Email Address"
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
              required: "Password required",
              minLength: {
                value: 4,
                message: "Password must be at least 4 characters",
              },
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
            disabled={loading}
          >
            Sign In
          </Button>
          {error && (
            <Typography component={"p"} sx={{ color: "red" }}>
              {error}
            </Typography>
          )}
          <Grid container>
            <Grid item>
              <Link to="/signup">{"Don't have an account? Sign Up"}</Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
