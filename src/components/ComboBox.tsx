import { useState, useEffect } from "react";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { SeedType } from "../types";

export default function ComboBox() {
  const [plantTypes, setPlantTypes] = useState<SeedType[]>([]);
  const { token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/seed-types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const plants: SeedType[] = response.data.map(
          (pt: { name: string; id: number }) => ({
            id: pt.id,
            name: pt.name,
          })
        );
        setPlantTypes(plants);
      })
      .catch((error) => console.error("There was an error!", error));
  }, []);

  return (
    <Autocomplete
      disablePortal
      id="plant-type-combo-box"
      options={plantTypes}
      getOptionLabel={(option: SeedType) => option.name}
      sx={{ width: 300 }}
      renderInput={(params) => (
        <TextField {...params} label="Tipo de Semilla" />
      )}
    />
  );
}
