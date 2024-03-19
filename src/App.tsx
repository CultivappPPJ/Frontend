import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { setToken } from "./features/auth/authSlice";
import CrudTerrain from "./pages/crudTerrain/CrudTerrain";
import MyTerrains from "./pages/crudTerrain/MyTerrains";
import Layout from "./pages/Layout";
import EditTerrain from "./pages/crudTerrain/EditTerrain";
import Landing from "./pages/Landing";
import AddCrops from "./pages/crudTerrain/AddCrops";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(setToken(token));
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/crud" element={<CrudTerrain />} />
          <Route path="/my/terrain" element={<MyTerrains />} />
          <Route path="/update/:id" element={<EditTerrain />} />
          <Route path="/add/crops/:id" element={<AddCrops />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
