import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar.jsx";
import style from "./home.module.css";
import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const url = "http://localhost:3000/";

function MessageSee1({ message }) {
  if (!message) {
    return <h2>Seleccione un rango de edad</h2>;
  }
  if (message.error) {
    return <h2 key={message.id}>No hay juegos para este rango de edad</h2>;
  }

  return <h2 key={message.id}>{message.name}</h2>;
}

function MessageSee({ message }) {
  if (!message) {
    return <h2>No hay datos disponibles</h2>;
  }
  if (message.error) {
    return <h2 key={message.id}>No hay juegos para este rango de edad</h2>;
  }

  return <h2 key={message.id}>{message.name}</h2>;
}

const Home = () => {
  const [customerFr, setCustomerFr] = useState(null);
  const [gameMS, setGameMS] = useState(null);
  const [gameDS, setGameDS] = useState(null);
  const [dataRange, setDataRange] = useState();
  const [range, setRange] = useState(null);
  const handleChangeR = (event) => {
    setRange(event.target.value);
  };

  useEffect(() => {
    const ObtenerCliente = async () => {
      try {
        const response = await axios.get(`${url}customers/mostFrequent`);
        setCustomerFr(response.data);
      } catch (error) {
        console.error("Error al obtener el cliente mas frecuente", error);
      }
    };
    const ObtenerJuegoMC = async () => {
      try {
        const response = await axios.get(`${url}games/mostRented`);
        setGameMS(response.data);
      } catch (error) {
        console.error("Error al obtener el cliente mas frecuente", error);
      }
    };
    const ObtenerJuegos = async () => {
      try {
        const response = await axios.get(`${url}rentals/dailySales`);
        setGameDS(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener el cliente mas frecuente", error);
      }
    };
    ObtenerCliente();
    ObtenerJuegoMC();
    ObtenerJuegos();
  }, []);

  const handleSeeRange = async () => {
    try {
      const response = await axios.get(
        `${url}games/leastRentedGameByAgeGroup?minAge=${
          range - 10
        }&maxAge=${range}`
      );
      setDataRange(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener el juego mas vendido por rango", error);
    }
  };

  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.containerWrappers}>
        <div className={style.wrapper}>
          <h1>Cliente mas frecuente:</h1>
          <MessageSee message={customerFr} />
        </div>

        <div className={style.wrapper}>
          <h1>Juego mas vendido:</h1>
          <MessageSee message={gameMS} />
        </div>

        <div className={style.wrapper}>
          <h1>Juego mas vendido por rango de edad:</h1>

          <FormControl
            sx={{
              width: "100%",
              color: "white",
              height: "auto",
              textAlign: "center",
              zIndex: "1",
            }}
          >
            <InputLabel
              id="demo-simple-select-autowidth-label"
              sx={{ display: "inline", color: "white" }}
            >
              Filtrar por rango de edad
            </InputLabel>
            <Select
              labelId="demo-simple-select-autowidth-label"
              id="demo-simple-select-autowidth"
              value={range}
              onChange={handleChangeR}
              autoWidth
              label="Filtrar por"
              sx={{ color: "white", height: "40px" }}
            >
              <MenuItem value={10}>0-10</MenuItem>
              <MenuItem value={20}>10-20</MenuItem>
              <MenuItem value={30}>20-30</MenuItem>
              <MenuItem value={40}>30-40</MenuItem>
              <MenuItem value={50}>40-50</MenuItem>
              <MenuItem value={60}>50-60</MenuItem>
              <MenuItem value={70}>60-70</MenuItem>
            </Select>
          </FormControl>
          <MessageSee1 message={dataRange} />
          <button onClick={handleSeeRange} className={style.btnList}>
            Buscar
          </button>
        </div>
      </div>
      <div className={style.wrapper2}>
        {gameDS ? (
          <h1>Ventas de hoy: {gameDS.length}</h1>
        ) : (
          <h1>Ventas de hoy: </h1>
        )}
        {gameDS && (
          <div className={style.rentalList}>
            {gameDS.map((rental) => (
              <div key={rental.id} className={style.rentalItem}>
                <h3>ID de transaccion: {rental.id}</h3>
                <h3>Juego rentado: {rental.Game.name}</h3>
                <p>Cliente: {rental.customerName}</p>
              </div>
            ))}
          </div>
        )}
        {!gameDS && (
          <div className={style.rentalList}>
            <h2>No hay ventas el dia de hoy</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
