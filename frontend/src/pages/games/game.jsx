import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";
import Style from "./game.module.css";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";

const url = "http://localhost:3000/";

function TablaJuegos({ juegos, handleIconClick }) {
  if (juegos.error) {
    return (
      <tr>
        <td colSpan="3" className={Style.errorMessage}>
          <h1>{juegos.error}</h1>
        </td>
      </tr>
    );
  }

  return juegos.map((game) => (
    <tr key={game.id}>
      <td className={Style.gameItem}>{game.name}</td>
      <td className={Style.gameItem}>{game.director}</td>
      <td className={Style.gameItem}>
        <div className={Style.gameItemPrice}>
          ${game.rentalPrice}
          <button
            onClick={() => handleIconClick(game)}
            className={Style.btnEdit}
          >
            <EditIcon />
          </button>
        </div>
      </td>
    </tr>
  ));
}

const Game = () => {
  const [games, setGames] = useState(null);
  const [filteredGames, setFilteredGames] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  
  const [plataform, setPlataform] = useState(null);
  const handleChangeP = (event) => {
    setPlataform(event.target.value);
  };

  const [openModal1, setOpenModal1] = useState(false);
  const handleOpenModal1 = () => setOpenModal1(true);
  const handleCloseModal1 = () => setOpenModal1(false);

  const [openModal2, setOpenModal2] = useState(false);
  const handleOpenModal2 = () => setOpenModal2(true);
  const handleCloseModal2 = () => setOpenModal2(false);

  const [filter, setFilter] = useState("");
  const handleChangeF = (event) => {
    setFilter(event.target.value);
  };

  const [newPrice, setNewPrice] = useState("");
  const handleNewPriceChange = (event) => {
    setNewPrice(event.target.value);
  };

  useEffect(() => {
    const obtenerVideojuegos = async () => {
      try {
        const response = await axios.get(`${url}games`);
        setGames(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de videojuegos", error);
      }
    };
    obtenerVideojuegos();
  }, []);

  useEffect(() => {
    const consultarJuegosFiltrados = async () => {
      try {
        if (filter && filter !== "Ninguno") {
          const filtro = document
            .getElementById("inputGame")
            .value.toUpperCase();
          const response = await axios.get(
            `${url}games/getGamesByCriteria?criteria=${filter}&value=${filtro}`
          );
          setFilteredGames(response.data);
        } else {
          setFilteredGames(null);
        }
      } catch (error) {
        console.error(
          "Error al obtener la lista de videojuegos filtrada",
          error
        );
      }
    };

    consultarJuegosFiltrados();
  }, [filter]);

  const filtrarTabla = async () => {
    try {
      if (filter && filter !== "Ninguno") {
        const filtro = document.getElementById("inputGame").value.toUpperCase();
        const response = await axios.get(
          `${url}games/getGamesByCriteria?criteria=${filter}&value=${filtro}`
        );
        setFilteredGames(response.data);
        console.log(response.data);
      } else {
        setFilteredGames(null);
      }
    } catch (error) {
      console.error("Error al obtener la lista de videojuegos filtrada", error);
    }
  };

  async function NewPriceGame() {
    try {
      const response = await axios.put(
        `${url}games/${selectedGame.id}/rentalPrice`,
        {
          rentalPrice: parseInt(newPrice),
        }
      );
      setGames(response.data);
      handleCloseModal1(); // Cierra el modal después de guardar los cambios
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar el precio del videojuego", error);
    }
  }

  const handleIconClick = (game) => {
    setSelectedGame(game); // Almacena el juego seleccionado
    handleOpenModal1(); // Abre el modal
  };

  const handleSaveNewGame = async () => {
    try {
      const response = await axios.post(`${url}games`, {
        name: document.getElementById("nameGame").value,
        year: parseInt(document.getElementById("yearGame").value),
        rentalPrice: parseInt(document.getElementById("priceGame").value),
        protagonists: document.getElementById("protagonistGame").value,
        director: document.getElementById("directorGame").value,
        platform: plataform,
        producer: document.getElementById("productorGame").value,
      });

      setGames(response.data);
      handleCloseModal2();
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar el juego", error);
    }
  };

  return (
    <div className={Style.main}>
      <Navbar />
      <div className={Style.container}>
        <h1>Videojuegos en renta: </h1>
        <div className={Style.headerInput}>
          <button onClick={() => handleOpenModal2()} className={Style.btnEdit}>
            Añadir juego
          </button>
          <div className={Style.contain}>
            <p>Filtrar por: </p>
            <FormControl
              sx={{
                width: "30%",
                color: "white",
                height: "auto",
                textAlign: "center",
              }}
            >
              <InputLabel
                id="demo-simple-select-autowidth-label"
                sx={{ display: "inline", color: "white" }}
              >
                Filtrar por
              </InputLabel>
              <Select
                labelId="demo-simple-select-autowidth-label"
                id="demo-simple-select-autowidth"
                value={filter}
                onChange={handleChangeF}
                autoWidth
                label="Filtrar por"
                sx={{ color: "white", height: "40px" }}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                <MenuItem value={"director"}>Director</MenuItem>
                <MenuItem value={"protagonist"}>Protagonista</MenuItem>
                <MenuItem value={"producer"}>Productor</MenuItem>
                <MenuItem value={"year"}>Año</MenuItem>
              </Select>
            </FormControl>
            <input type="text" id="inputGame" placeholder="Criterio a buscar" />
            <button className={Style.btnEdit} onClick={filtrarTabla}>
              <SearchIcon />
            </button>
          </div>
          <Modal
            open={openModal2}
            onClose={handleCloseModal2}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ backdropFilter: "blur(1px)" }}
          >
            <div className={Style.boxModalCG}>
              <div className={Style.buttonCl}>
                <button onClick={handleCloseModal2} className={Style.btnEdit}>
                  <CloseIcon />
                </button>
              </div>
              <form onSubmit={(e) => e.preventDefault()}>
                <h2>Nombre del juego: </h2>
                <input id="nameGame" type="text" />
                <div className={Style.sectionForm}>
                  <div className={Style.divider}>
                    <h2>Año de creacion del juego:</h2>
                    <input id="yearGame" type="text" />
                  </div>
                  <div className={Style.divider}>
                    <h2>Precio del juego <br />a rentar:</h2>
                    <input id="priceGame" type="text" />
                  </div>
                </div>

                <h2>Protagonistas: </h2>
                <input id="protagonistGame" type="text" />
                <h2>Director: </h2>
                <input id="directorGame" type="text" />
                <div className={Style.sectionForm}>
                  <div className={Style.divider}>
                    <h2>Plataforma: </h2>
                    <FormControl
                      sx={{
                        width: "30%",
                        color: "black",
                        height: "auto",
                        textAlign: "center",
                      }}
                    >
                      <InputLabel
                        id="demo-simple-select-autowidth-label"
                        sx={{ display: "inline", color: "black" }}
                      >
                        Plataforma
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-autowidth-label"
                        id="demo-simple-select-autowidth"
                        value={plataform}
                        onChange={handleChangeP}
                        autoWidth
                        label="Filtrar por"
                        sx={{ color: "black", height: "40px" }}
                      >
                        <MenuItem value={"playstation"}>Playstation</MenuItem>
                        <MenuItem value={"xbox"}>Xbox</MenuItem>
                        <MenuItem value={"nintendo"}>Nintendo</MenuItem>
                        <MenuItem value={"pc"}>PC</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className={Style.divider}>
                    <h2>Productor</h2>
                    <input id="productorGame" type="text" />
                  </div>
                </div>
                <div className={Style.buttonForm}>
                  <button onClick={handleSaveNewGame}>Guardar juego</button>
                </div>
              </form>
            </div>
          </Modal>
        </div>

        <div className={Style.wrapper}>
          {games && (
            <table className={Style.gameTable}>
              <thead className={Style.tableHeader}>
                <tr>
                  <th className={Style.gameItemC}>Nombre del Juego</th>
                  <th className={Style.gameItemC}>Director</th>
                  <th className={Style.gameItemC}>Precio del Juego</th>
                </tr>
              </thead>
              <tbody id="tablaCuerpo">
                <TablaJuegos
                  juegos={filteredGames || games}
                  handleIconClick={handleIconClick}
                />
              </tbody>
            </table>
          )}
          <Modal
            open={openModal1}
            onClose={handleCloseModal1}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            sx={{ backdropFilter: "blur(1px)" }}
          >
            <div className={Style.boxModalG}>
              <div className={Style.buttonCl}>
                <button onClick={handleCloseModal1} className={Style.btnEdit}>
                  <CloseIcon />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  NewPriceGame();
                }}
              >
                <div className={Style.sectionForm}>
                  <h2>Precio actual del juego: </h2>
                  <input
                    type="text"
                    value={selectedGame?.rentalPrice}
                    disabled
                  />
                </div>
                <div className={Style.sectionForm}>
                  <h2>Nuevo precio del juego: </h2>
                  <input
                    id="newPrice"
                    type="text"
                    placeholder="Nuevo precio"
                    value={newPrice}
                    onChange={handleNewPriceChange}
                  />
                </div>
                <div className={Style.buttonForm}>
                  <button type="submit" className={Style.btnEdit}>
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default Game;
