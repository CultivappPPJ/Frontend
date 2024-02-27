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
import { ChangeEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SignUpData } from "../../types";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../features/auth/authSlice";
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
            disabled={status === "loading"}
          >
            {status === "loading" ? "Signing Up..." : "Sign Up"}
          </Button>
          {authError && (
            <Typography component={"p"} sx={{ color: "red", pb: "1rem" }}>
              {authError}
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
