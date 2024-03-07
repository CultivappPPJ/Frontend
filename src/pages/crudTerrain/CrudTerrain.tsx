import React, { useState, useEffect, useRef } from "react";
import { useDropzone } from "react-dropzone";
import type { Accept } from "react-dropzone";

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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Navbar from "../../components/Navbar";
import { Terrain } from "../../types";
import axios from "axios";
import { NatRounded } from "@mui/icons-material";

const CenteredTableCell: React.FC<
  React.HTMLAttributes<HTMLTableCellElement>
> = (props) => <TableCell {...props} sx={{ textAlign: "center" }} />;

export default function CrudTerrain() {

  const lastCreatedTerrainId = useRef(null);
  const email = "email falso";
  const fullName = "nombre falso";
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [newTerrain, setNewTerrain] = useState<Terrain>({
    /* name: "",
    area: "",
    soilType: "",
    saleType: "",
    image: undefined, */
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formLocked) return;

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

    // Obtener el token de localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token no disponible. Inicia sesión primero.");
      // Puedes redirigir al usuario a la página de inicio de sesión o realizar alguna acción
      return;
    }

    // Construir el objeto de datos para el body de la solicitud
    const terrainData = {
      name: newTerrain.name,
      area: newTerrain.area,
      soilType: newTerrain.soilType,
      plantType: newTerrain.plantType,
      photo: newTerrain.photo,
      email: email,
      remainingDays: newTerrain.remainingDays,
      forSale: newTerrain.forSale,
      fullName: fullName,
    };

    // Configuración del encabezado con el token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      // Realizar la solicitud POST con el encabezado
      const response = await axios.post(
        "http://localhost:8080/api/v1/terrain/crud/create",
        terrainData,
        config
      );

      /* // Manejar la respuesta según sea necesario
      console.log("Respuesta del servidor:", response.data);

      // Obtener el ID del terreno creado
      const createdTerrainId = response.data.id;

      // Almacenar el ID utilizando la referencia
      lastCreatedTerrainId.current = createdTerrainId; */

      /* // Actualizar el estado del nuevo terreno con el ID
      setNewTerrain((prevTerrain) => ({
        ...prevTerrain,
        id: createdTerrainId,
      })); */

      /* console.log("ID del terreno creado:", createdTerrainId);
      console.log("Nuevo id:", newTerrain.id);
      console.log("New terrain", newTerrain); */

      // Descomentar la siguiente línea si deseas bloquear el formulario después de agregar
      // setFormLocked(true);

      // Limpiar el estado del nuevo terreno y las selecciones
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
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      // Manejar el error según sea necesario
    }

    if (editingIndex !== null) {
      const updatedTerrains = [...terrains];
      updatedTerrains[editingIndex] = newTerrain;
      setTerrains(updatedTerrains);
      setEditingIndex(null);
    } else {
      setTerrains([...terrains, newTerrain]);
    }

    // Descomentar la siguiente línea si deseas bloquear el formulario después de agregar
    // setFormLocked(true);

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
  };

  const handleDeleteTerrain = async (index: number) => {
    if (formLocked) return;

    const terrainToDelete = terrains[index];

    // Agrega console.log para mostrar la lista completa de terrenos y el terreno específico
    console.log("Lista completa de terrenos:", terrains);
    console.log("Terreno a eliminar:", terrainToDelete);

    // Obtener el token de localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token no disponible. Inicia sesión primero.");
      // Puedes redirigir al usuario a la página de inicio de sesión o realizar alguna acción
      return;
    }

    // Configuración del encabezado con el token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      console.log("ID del terreno a eliminar:", terrainToDelete.id);
      // Realizar la solicitud DELETE con el encabezado
      await axios.delete(
        `http://localhost:8080/api/v1/terrain/crud/delete/${terrainToDelete.name}`,
        config
      );

      // Eliminar el terreno del estado local
      const updatedTerrains = [...terrains];
      updatedTerrains.splice(index, 1);
      setTerrains(updatedTerrains);
      setEditingIndex(null);
      setSelectedSquares(new Set());

      console.log("Terreno eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el terreno:", error);
      // Manejar el error según sea necesario
    }
  };

  const handleEditTerrain = async (index: number) => {
    if (formLocked) return;
  
    const terrainToUpdate = terrains[index];
  
    // Prepare the terrain data to update
    const terrainData = {
      id: terrainToUpdate.id,
      name: terrainToUpdate.name,
      area: terrainToUpdate.area,
      soilType: terrainToUpdate.soilType,
      plantType: terrainToUpdate.plantType,
      photo: terrainToUpdate.photo, // Assuming photo is a URL
      email: email, // Assuming email is a constant
      remainingDays: terrainToUpdate.remainingDays,
      forSale: terrainToUpdate.forSale,
      fullName: fullName, // Assuming fullName is a constant
    };
  
    // Get the token from localStorage
    const token = localStorage.getItem('token');
  
    if (!token) {
      alert('Token no disponible. Inicia sesión primero.');
      return;
    }
  
    // Set the Authorization header with the token
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      // Make a PUT request to the update endpoint with the terrain data
      const response = await axios.put(
        'http://localhost:8080/api/v1/terrain/crud/update/',
        terrainData,
        config
      );
  
      console.log('Terrain updated successfully:', response.data);
  
      // Update the local state with the updated terrain
      const updatedTerrains = [...terrains];
      updatedTerrains[index] = terrainToUpdate;
      setTerrains(updatedTerrains);
  
      setEditingIndex(null);
      setSelectedSquares(new Set());
    } catch (error) {
      console.error('Error updating terrain:', error);
      // Handle the error appropriately
    }
  };

  const handleSaveTerrains = () => {
    if (formLocked) return;

    console.log("Terrains to save:", terrains);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (formLocked) return;

    const image = acceptedFiles[0];

    setNewTerrain((prevTerrain: Terrain) => ({
      ...prevTerrain,
      image: image !== undefined ? image : (undefined as any),
    }));
  };

  /* const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*" as unknown as Accept,
  }); */

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

  return (
    <>
      <Navbar />
      <Container maxWidth="xl">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundImage: 'url("")',
            backgroundSize: "cover",
            height: "100vh",
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

          {/* <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4} lg={3} {...getRootProps()}>
              <input {...getInputProps()} />
              <Button
                variant="outlined"
                color="primary"
                startIcon={<CloudUploadIcon />}
                fullWidth
                disabled={formLocked}
              >
                Subir Imagen
              </Button>
            </Grid>
          </Grid> */}

          {/* {newTerrain.image && (
            <Grid item xs={12} style={{ margin: "16px 0" }}>
              <img
                src={URL.createObjectURL(newTerrain.image)}
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
          )} */}

          {newTerrain.photo && (
            <Grid item xs={12} style={{ margin: "16px 0" }}>
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
                      {/* {terrain.photo && (
                        <img
                          src={URL.createObjectURL(terrain.photo)}
                          alt={`Imagen de ${terrain.name}`}
                          style={{ width: "200px", height: "200px" }}
                        />
                      )} */}
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
                        variant="outlined"
                        color="error"
                        style={{
                          marginBottom: "8px",
                          marginRight: "8px",
                          width: "100px",
                        }}
                        onClick={() => handleDeleteTerrain(index)}
                        disabled={formLocked}
                      >
                        Eliminar
                      </Button>
                      <Button
                        variant="outlined"
                        color="warning"
                        style={{
                          marginBottom: "8px",
                          marginRight: "8px",
                          width: "100px",
                        }}
                        onClick={() => handleEditTerrain(index)}
                        disabled={formLocked}
                      >
                        Modificar
                      </Button>
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
        </div>
      </Container>
    </>
  );
}
