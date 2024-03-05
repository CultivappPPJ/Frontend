import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
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

const CenteredTableCell: React.FC<
  React.HTMLAttributes<HTMLTableCellElement>
> = (props) => <TableCell {...props} sx={{ textAlign: "center" }} />;

export default function CrudTerrain() {
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [newTerrain, setNewTerrain] = useState<Terrain>({
    name: "",
    area: "",
    soilType: "",
    saleType: "",
    image: null,
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
    setNewTerrain((prevTerrain) => ({ ...prevTerrain, saleType: value }));
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

  const handleAddTerrain = () => {
    if (
      !newTerrain.name ||
      !newTerrain.area ||
      parseFloat(newTerrain.area) < 0 ||
      !newTerrain.soilType ||
      !newTerrain.saleType
    ) {
      alert("Por favor, completa todos los campos correctamente.");
      return;
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
      name: "",
      area: "",
      soilType: "",
      saleType: "",
      image: null,
    });
    setSelectedSquares(new Set());
  };

  const handleDeleteTerrain = (index: number) => {
    if (formLocked) return;

    const updatedTerrains = [...terrains];
    updatedTerrains.splice(index, 1);
    setTerrains(updatedTerrains);
    setEditingIndex(null);
    setSelectedSquares(new Set());
  };

  const handleEditTerrain = (index: number) => {
    if (formLocked) return;

    setEditingIndex(index);
    setNewTerrain(terrains[index]);
    setSelectedSquares(new Set());
  };

  const handleSaveTerrains = () => {
    if (formLocked) return;

    console.log("Terrains to save:", terrains);
  };

  const onDrop = (acceptedFiles: File[]) => {
    if (formLocked) return;

    const image = acceptedFiles[0];
    setNewTerrain((prevTerrain) => ({ ...prevTerrain, image }));
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "image/*",
  });

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
            Selección de Terrenos
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
                label="Tipo de Venta"
                name="saleType"
                select
                value={newTerrain.saleType}
                onChange={(e) => handleSaleTypeChange(e)}
                fullWidth
                margin="normal"
                disabled={formLocked}
              >
                <MenuItem value="" disabled>
                  <em></em>
                </MenuItem>
                <MenuItem value="En venta">En venta</MenuItem>
                <MenuItem value="Personal">Personal</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Grid container spacing={2} alignItems="center">
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

            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Button
                variant="contained"
                onClick={handleAddTerrain}
                fullWidth
                disabled={formLocked}
              >
                {editingIndex !== null
                  ? "Modificar Terreno"
                  : "Agregar Terreno"}
              </Button>
            </Grid>
          </Grid>

          {newTerrain.image && (
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
                  <CenteredTableCell>Tipo de Venta</CenteredTableCell>
                  <CenteredTableCell>
                    Representación Visual
                  </CenteredTableCell>
                  <CenteredTableCell>Acciones</CenteredTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {terrains.map((terrain, index) => (
                  <TableRow key={index}>
                    <CenteredTableCell>
                      {terrain.image && (
                        <img
                          src={URL.createObjectURL(terrain.image)}
                          alt={`Imagen de ${terrain.name}`}
                          style={{ width: "200px", height: "200px" }}
                        />
                      )}
                    </CenteredTableCell>
                    <CenteredTableCell>{terrain.name}</CenteredTableCell>
                    <CenteredTableCell>{terrain.area}</CenteredTableCell>
                    <CenteredTableCell>{terrain.soilType}</CenteredTableCell>
                    <CenteredTableCell>{terrain.saleType}</CenteredTableCell>
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
