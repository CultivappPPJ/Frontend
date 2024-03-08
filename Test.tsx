import React, { useState, useEffect } from "react";
import {
  Button,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  TextField,
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import { Terrain, TokenPayload } from "../../types";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useNavigate } from "react-router";

const CenteredTableCell: React.FC<
  React.HTMLAttributes<HTMLTableCellElement>
> = (props) => <TableCell {...props} sx={{ textAlign: "center" }} />;

export default function CrudTerrain() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [fullName, setFullName] = useState<string | null>(null);
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [newTerrain, setNewTerrain] = useState<Terrain>({
    id: 0,
    name: "",
    area: "",
    soilType: "",
    plantType: "",
    photo: "",
    email: "",
    remainingDays: 0,
    forSale: false,
    fullName: "",
  });
  const [selectedSquares, setSelectedSquares] = useState<Set<number>>(
    new Set()
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formLocked, setFormLocked] = useState<boolean>(false);
  const { token, status } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "area" && parseFloat(value) < 0) {
      return;
    }

    setNewTerrain((prevTerrain) => ({ ...prevTerrain, [name]: value }));
  };

  const handleSoilTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    if (formLocked) return;

    const value = event.target.value as string;
    setNewTerrain((prevTerrain) => ({ ...prevTerrain, soilType: value }));
  };

  const handleSaleTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    if (formLocked) return;

    const value = event.target.value as string;
    const isForSale = value === "En venta";
    setNewTerrain((prevTerrain) => ({ ...prevTerrain, forSale: isForSale }));
  };

  const handleSquareClick = (index: number) => {
    if (formLocked) return;

    const updatedSelection = new Set(selectedSquares);

    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }

    setSelectedSquares(updatedSelection);
  };

  const handleAddTerrain = async () => {
    if (
      !newTerrain.name ||
      !newTerrain.area ||
      !newTerrain.soilType ||
      !newTerrain.plantType ||
      !newTerrain.photo ||
      !newTerrain.remainingDays ||
      parseFloat(newTerrain.area) < 0
    ) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    // Asumiendo que no necesitas editar (porque no veo implementación completa para edición),
    // Vamos a simplificar y directamente añadir a la lista.
    const token = localStorage.getItem("token");

    const terrainData = {
      ...newTerrain,
      email: userEmail,
      fullName: fullName,
    };

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      await axios.post(
        "http://localhost:8080/api/v1/terrain/crud/create",
        terrainData,
        config
      );

      // Agregar el terreno a la lista de terrenos y resetear el formulario
      setTerrains((prevTerrains) => [
        ...prevTerrains,
        { ...newTerrain, id: Date.now() },
      ]); // Usamos Date.now() para simular un ID único.

      // Limpiar formulario
      setNewTerrain({
        id: 0,
        name: "",
        area: "",
        soilType: "",
        plantType: "",
        photo: "",
        email: "",
        remainingDays: 0,
        forSale: false,
        fullName: "",
      });
      setSelectedSquares(new Set());
      setEditingIndex(null); // Asumiendo que reseteamos también el índice de edición
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

  const handleSaveTerrains = () => {
    if (formLocked) return;
  };

  const generateVisualGrid = (
    area: string,
    selectedSquares: Set<number>,
    handleSquareClick: (index: number) => void
  ) => {
    const squares = Array.from({ length: parseFloat(area) }, (_, index) => (
      <Grid item key={index}>
        <div
          onClick={() => handleSquareClick(index)}
          style={{
            width: "35px",
            height: "35px",
            backgroundColor: selectedSquares.has(index)
              ? "lightcoral"
              : "lightblue",
            border: "1px solid #ccc",
          }}
        />
      </Grid>
    ));

    return (
      <Grid container spacing={1}>
        {squares}
      </Grid>
    );
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<TokenPayload>(token);
        setUserEmail(decoded.sub);
        setFullName(decoded.firstName + " " + decoded.lastName);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (token === null) {
      navigate("/");
    }
  }, [token, status, navigate]);

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
    <>
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundSize: "cover",
            height: "100vh",
            marginBottom: "2rem",
          }}
        >
          <h2 style={{ color: "white", textShadow: "2px 2px 2px black" }}>
            Administración de Terrenos
          </h2>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Nombre"
                name="name"
                value={newTerrain.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={formLocked}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Área"
                name="area"
                type="number"
                value={newTerrain.area}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={formLocked}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Tipo de Suelo"
                name="soilType"
                select
                value={newTerrain.soilType}
                onChange={(e) => handleSoilTypeChange(e)}
                fullWidth
                margin="normal"
                disabled={formLocked}
              >
                <MenuItem value="" disabled>
                  <em></em>
                </MenuItem>
                <MenuItem value="Arenoso">Arenoso</MenuItem>
                <MenuItem value="Mixto">Mixto</MenuItem>
                <MenuItem value="Ácido">Ácido</MenuItem>
                <MenuItem value="Calizo">Calizo</MenuItem>
                <MenuItem value="Supresivo">Supresivo</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Vegetal"
                name="plantType"
                value={newTerrain.plantType}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={formLocked}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="URL de la imagen"
                name="photo"
                value={newTerrain.photo}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={formLocked}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Días restantes para la cosecha"
                name="remainingDays"
                type="number"
                value={newTerrain.remainingDays}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={formLocked}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <TextField
                label="Tipo de Venta"
                name="forSale"
                select
                value={newTerrain.forSale ? "En venta" : "Personal"}
                onChange={(e) => handleSaleTypeChange(e)}
                fullWidth
                margin="normal"
                disabled={formLocked}
              >
                <MenuItem value="En venta">En venta</MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
              </TextField>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              className="button-container"
            >
              <Button
                variant="contained"
                onClick={handleAddTerrain}
                fullWidth
                disabled={formLocked}
                id="handle-add-terrain"
              >
                {editingIndex !== null
                  ? "Modificar Terreno"
                  : "Agregar Terreno"}
              </Button>
            </Grid>
          </Grid>
          {newTerrain.photo && (
            <Grid
              item
              xs={12}
              style={{
                margin: "16px 0",
                display: "flex",
                alignItems: "center",
              }}
            >
              Vista previa de la imagen:
              <img
                src={newTerrain.photo}
                alt="Vista previa de la imagen"
                style={{
                  width: "30%",
                  height: "auto",
                  marginBottom: "8px",
                  margin: "0 auto",
                  display: "block",
                }}
              />
            </Grid>
          )}
          {terrains.length > 0 && (
            <TableContainer
              component={Paper}
              sx={{ maxWidth: "1200px", margin: "auto", marginTop: "16px" }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <CenteredTableCell>Imagen</CenteredTableCell>
                    <CenteredTableCell>Nombre</CenteredTableCell>
                    <CenteredTableCell>Área</CenteredTableCell>
                    <CenteredTableCell>Tipo de Suelo</CenteredTableCell>
                    <CenteredTableCell>Tipo de Planta</CenteredTableCell>
                    <CenteredTableCell>Días Restantes</CenteredTableCell>
                    <CenteredTableCell>Tipo de Venta</CenteredTableCell>
                    <CenteredTableCell>Representación Visual</CenteredTableCell>
                    <CenteredTableCell>Acciones</CenteredTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {terrains.map((terrain, index) => (
                    <TableRow key={index}>
                      <CenteredTableCell>
                        {terrain.photo && (
                          <img
                            src={terrain.photo}
                            alt={`Imagen de ${terrain.name}`}
                            style={{ width: "200px", height: "200px" }}
                          />
                        )}
                      </CenteredTableCell>
                      <CenteredTableCell>{terrain.name}</CenteredTableCell>
                      <CenteredTableCell>{terrain.area}</CenteredTableCell>
                      <CenteredTableCell>{terrain.soilType}</CenteredTableCell>
                      <CenteredTableCell>{terrain.plantType}</CenteredTableCell>
                      <CenteredTableCell>
                        {terrain.remainingDays}
                      </CenteredTableCell>
                      <CenteredTableCell>
                        {terrain.forSale ? "En venta" : "Personal"}
                      </CenteredTableCell>
                      <CenteredTableCell>
                        {generateVisualGrid(
                          terrain.area,
                          selectedSquares,
                          (squareIndex) => handleSquareClick(squareIndex)
                        )}
                      </CenteredTableCell>
                      <CenteredTableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{
                            marginBottom: "8px",
                            marginRight: "8px",
                            width: "100px",
                          }}
                          onClick={handleSaveTerrains}
                          disabled={formLocked}
                        >
                          Guardar
                        </Button>
                      </CenteredTableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </Container>
    </>
  );
}
