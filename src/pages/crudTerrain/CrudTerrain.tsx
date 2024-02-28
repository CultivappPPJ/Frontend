import React, { useState } from "react";
import {
  Button,
  Select,
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
} from "@mui/material";

const CenteredTableCell = (props) => (
  <TableCell {...props} sx={{ textAlign: "center" }} />
);

export default function CrudTerrain() {
  const [terrains, setTerrains] = useState([]);
  const [newTerrain, setNewTerrain] = useState({
    name: "",
    area: "",
    soilType: "",
  });
  const [selectedSquares, setSelectedSquares] = useState(new Set());
  const [editingIndex, setEditingIndex] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Validar que el valor en el campo de área no sea negativo
    if (name === "area" && parseFloat(value) < 0) {
      return; // No actualizamos el estado si el valor es negativo
    }

    setNewTerrain({ ...newTerrain, [name]: value });
  };

  const handleSquareClick = (index) => {
    const updatedSelection = new Set(selectedSquares);

    if (updatedSelection.has(index)) {
      updatedSelection.delete(index);
    } else {
      updatedSelection.add(index);
    }

    setSelectedSquares(updatedSelection);
  };

  const handleAddTerrain = () => {
    // Validar que los campos requeridos no estén vacíos y el área no sea negativa
    if (
      !newTerrain.name ||
      !newTerrain.area ||
      parseFloat(newTerrain.area) < 0 ||
      !newTerrain.soilType
    ) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
    }

    if (editingIndex !== null) {
      // Modificar terreno existente
      const updatedTerrains = [...terrains];
      updatedTerrains[editingIndex] = newTerrain;
      setTerrains(updatedTerrains);
      setEditingIndex(null);
    } else {
      // Agregar nuevo terreno
      setTerrains([...terrains, newTerrain]);
    }
    setNewTerrain({ name: "", area: "", soilType: "" }); // Reiniciar los campos después de agregar/modificar un terreno
    setSelectedSquares(new Set()); // Desmarcar todos los cuadrados seleccionados
  };

  const handleDeleteTerrain = (index) => {
    const updatedTerrains = [...terrains];
    updatedTerrains.splice(index, 1);
    setTerrains(updatedTerrains);
    setEditingIndex(null);
    setSelectedSquares(new Set()); // Desmarcar todos los cuadrados seleccionados
  };

  const handleEditTerrain = (index) => {
    // Activar la edición y cargar los datos del terreno a editar
    setEditingIndex(index);
    setNewTerrain(terrains[index]);
    setSelectedSquares(new Set()); // Desmarcar todos los cuadrados seleccionados
  };

  const handleSaveTerrains = () => {
    // Aquí puedes implementar la lógica para guardar los terrenos en tu backend o realizar cualquier acción necesaria
    console.log("Terrains to save:", terrains);
  };

  const generateVisualGrid = (area, selectedSquares, handleSquareClick) => {
    const squares = Array.from({ length: area }, (_, index) => (
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
        Selección de Terrenos
      </h2>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "16px",
          marginTop: "8px",
        }}
      >
        <TextField
          label="Nombre"
          name="name"
          value={newTerrain.name}
          onChange={handleInputChange}
          sx={{ marginRight: "8px" }}
        />
        <TextField
          label="Área"
          name="area"
          type="number"
          value={newTerrain.area}
          onChange={handleInputChange}
          sx={{ marginRight: "8px" }}
        />
        <Select
          label="Tipo de Suelo"
          name="soilType"
          value={newTerrain.soilType}
          onChange={handleInputChange}
          sx={{ minWidth: "120px", marginRight: "8px" }}
        >
          <MenuItem value="Arenoso">Arenoso</MenuItem>
          <MenuItem value="Mixto">Mixto</MenuItem>
          <MenuItem value="Ácido">Ácido</MenuItem>
          <MenuItem value="Calizo">Calizo</MenuItem>
          <MenuItem value="Supresivo">Supresivo</MenuItem>
        </Select>
        <Button
          variant="contained"
          onClick={handleAddTerrain}
          style={{ marginLeft: "8px" }}
        >
          {editingIndex !== null ? "Modificar Terreno" : "Agregar Terreno"}
        </Button>
      </div>

      <TableContainer
        component={Paper}
        sx={{ maxWidth: "800px", margin: "center" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <CenteredTableCell>Nombre</CenteredTableCell>
              <CenteredTableCell>Área</CenteredTableCell>
              <CenteredTableCell>Tipo de Suelo</CenteredTableCell>
              <CenteredTableCell>Representación Visual</CenteredTableCell>
              <CenteredTableCell>Acciones</CenteredTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {terrains.map((terrain, index) => (
              <TableRow key={index}>
                <CenteredTableCell>{terrain.name}</CenteredTableCell>
                <CenteredTableCell>{terrain.area}</CenteredTableCell>
                <CenteredTableCell>{terrain.soilType}</CenteredTableCell>
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
                    color="secondary"
                    style={{
                      marginBottom: "8px",
                      marginRight: "8px",
                      width: "100px",
                    }}
                    onClick={() => handleDeleteTerrain(index)}
                  >
                    Eliminar
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    style={{
                      marginBottom: "8px",
                      marginRight: "8px",
                      width: "100px",
                    }}
                    onClick={() => handleEditTerrain(index)}
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
  );
}
