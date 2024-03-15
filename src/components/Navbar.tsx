import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";
import { TokenPayload } from "../types";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ModalDeleteAccount from "./ModalDeleteAccount";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";

const pages = [
  { title: "Mis Terrenos", path: "/my/terrain" },
  { title: "Agregar Terreno", path: "/crud" },
  { title: "¿Quiénes somos?", path: "/landing" },
];
const settings = [
  { title: "Cerrar Sesión", icon: <LogoutIcon /> },
  { title: "Eliminar mi cuenta", icon: <DeleteIcon /> },
];

function Navbar() {
  const [userEmail, setUserEmail] = React.useState<string | null>(null);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );
  const [openDeleteAccountModal, setOpenDeleteAccountModal] =
    React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const handleDeleteAccount = () => {
    setOpenDeleteAccountModal(true);
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUserEmail(decoded.sub);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, [openDeleteAccountModal]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          {/* TODO: agregar logo */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 7 }}>
            <Typography
              component={Link}
              to="/"
              variant="h5"
              sx={{
                color: "inherit",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
              }}
            >
              <HomeIcon sx={{ fontSize: "2rem", marginRight: "0.5rem" }} />{" "}
              {/* Espacio entre el texto y el icono */}
              Cultivapp
            </Typography>
          </Box>

          {userEmail !== null && (
            <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                    <Button
                      component={Link}
                      to={page.path}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Typography textAlign="center">{page.title}</Typography>
                    </Button>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          )}
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Cultivapp
          </Typography>
          {userEmail !== null ? (
            <>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", md: "flex" },
                }}
              >
                {pages.map((page) => (
                  <Button
                    key={page.title}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: "white", display: "block" }}
                    component={Link}
                    to={page.path}
                  >
                    {page.title}
                  </Button>
                ))}
              </Box>
              <Typography
                sx={{ pr: "1rem", display: { xs: "none", md: "block" } }}
              >
                Bienvenido! {userEmail}
              </Typography>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="" src="/static/images/avatar/2.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting, index) => (
                    <>
                      <MenuItem
                        key={setting.title}
                        onClick={() => {
                          if (setting.title === "Cerrar Sesión") {
                            handleLogout();
                          } else if (setting.title === "Eliminar mi cuenta") {
                            handleDeleteAccount();
                          }
                          handleCloseUserMenu();
                        }}
                      >
                        {setting.icon}
                        <Typography textAlign="center" sx={{ ml: 1 }}>
                          {setting.title}
                        </Typography>
                      </MenuItem>
                      {index < settings.length - 1 && <Divider />}
                    </>
                  ))}
                </Menu>
              </Box>
              {openDeleteAccountModal && (
                <ModalDeleteAccount
                  openDialog={openDeleteAccountModal}
                  handleClose={() => setOpenDeleteAccountModal(false)}
                  handleDelete={handleDeleteAccount}
                  email={userEmail || ""}
                />
              )}
            </>
          ) : (
            <Button
              component={Link}
              to="/signin"
              style={{
                color: "white",
                textDecoration: "none",
              }}
            >
              Iniciar Sesión
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
