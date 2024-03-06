import { useParams } from "react-router-dom";

export default function EditTerrain() {
  const { id } = useParams();
  return <div>EditTerrain {id}</div>;
}
