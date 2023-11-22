import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar.jsx";
import style from "./home.module.css";
import axios from "axios";

const url = "http://localhost:3000/";

const Home = () => {
  const [customerFr, setCustomerFr] = useState(null);
  const [gameMS, setGameMS] = useState(null);
  const [gameDS, setGameDS] = useState(null);

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

  console.log(customerFr);
  return (
    <div className={style.container}>
      <Navbar />
      <div className={style.containerWrappers}>
        {customerFr && (
          <div className={style.wrapper}>
            <h1>Cliente mas frecuente:</h1>
            <h2>{customerFr.name}</h2>
          </div>
        )}
        {gameMS && (
          <div className={style.wrapper}>
            <h1>Juego mas vendido:</h1>
            <h2>{gameMS.name}</h2>
          </div>
        )}
      </div>
      <div className={style.wrapper2}>
        <h1>Ventas de hoy: </h1>
        {gameDS && (
          <div className={style.rentalList}>
            {gameDS.map((rental) => (
              <div key={rental.id} className={style.rentalItem}>
                <h3>Juego rentado: {rental.Game.name}</h3>
                <p>Cliente: {rental.customerName}</p>
                <button className={style.btnList}>Ver mas</button>
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
