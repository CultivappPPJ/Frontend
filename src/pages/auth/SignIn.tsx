import {
  Box,
  Button,
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
import { signIn } from "../../features/auth/authSlice";
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
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

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
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing In..." : "Sign In"}
          </Button>
          {authError && (
            <Typography component={"p"} sx={{ color: "red", pb: "1rem" }}>
              {authError}
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
