import React, { useState, useEffect } from "react";
import NavbarU from "../navbarU/navbarU.jsx";
import style from "./user.module.css";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";

const url = "http://localhost:3000/";

const User = () => {
  const [games, setGames] = useState(null);

  const ObtenerJuegos = async () => {
    try {
      const response = await axios.get(
        `${url}rentals/customerRentals/${parseInt(
          document.getElementById("idCustomer").value
        )}`
      );
      setGames(response.data);
    } catch (error) {
      console.error("Error al obtener juegos del cliente", error);
    }
  };

  return (
    <div className={style.container}>
      <NavbarU />
      <div className={style.containerInfo}>
        <div className={style.containerInput}>
          <h1>Digite el ID de usuario:</h1>
          <input
            type="text"
            placeholder="Escribir ID usuario"
            id="idCustomer"
          />
          <button onClick={ObtenerJuegos} className={style.btnList}>
            <SearchIcon />
          </button>
        </div>
        <div className={style.wrapper2}>
          <h1>Juegos rentados por el cliente:</h1>
          {!games && (
            <>
              <h2>Porfavor digite el ID del cliente a buscar</h2>
            </>
          )}
          {games && (
            <div className={style.rentalList}>
              {games.map((rental) => (
                <div key={rental.id} className={style.rentalItem}>
                  <h3>Nombre del juego: {rental.title}</h3>
                  <p>
                    Fecha de inicio de la renta:{" "}
                    {new Date(rental.rentalDate).toLocaleDateString()}
                  </p>
                  <p>
                    Fecha final de la renta:{" "}
                    {new Date(rental.dueDate).toLocaleDateString()}
                  </p>
                  <p>Precio del juego rentado: ${rental.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
