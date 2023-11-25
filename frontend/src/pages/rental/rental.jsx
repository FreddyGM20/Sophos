import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";
import style from "./rental.module.css";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";
import jsPDF from "jspdf";
import logo from "../../assets/vecteezy_mountain-icon_1206198.png";

const url = "http://localhost:3000/";

const Rental = () => {
  const [rentals, setRentals] = useState(null);
  const [selectedRental, setSelectedRental] = useState(null);
  const [searchedID, setSearchedID] = useState(null); // Nuevo estado para el ID de búsqueda
  const [customer, setCustomer] = useState(null);
  const [game, setGame] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null); // Nuevo estado para el mensaje de error
  const [errorMessage1, setErrorMessage1] = useState(null); // Nuevo estado para el mensaje de error

  const [openModal1, setOpenModal1] = useState(false);
  const handleOpenModal1 = () => setOpenModal1(true);
  const handleCloseModal1 = () => setOpenModal1(false);

  const [openModal2, setOpenModal2] = useState(false);
  const handleOpenModal2 = () => setOpenModal2(true);
  const handleCloseModal2 = () => setOpenModal2(false);

  useEffect(() => {
    const ObtenerRentas = async () => {
      try {
        const response = await axios.get(`${url}rentals`);
        setRentals(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de rentas", error);
      }
    };
    ObtenerRentas();
  }, []);

  const handleIconClick = (rental) => {
    setSelectedRental(rental); // Almacena el juego seleccionado
    handleOpenModal1(); // Abre el modal
  };

  const handleClickSave = () => {
    handleSaveAsPDF(); // Almacena el juego seleccionado
    handleCloseModal1(); // Cierra el modal
  };

  const handleSaveAsPDF = () => {
    const {
      customerName,
      customerEmail,
      customerAge,
      gameName,
      gamePrice,
      customerIdentity,
      createdAt,
      dueDate,
    } = selectedRental;

    const pdf = new jsPDF();

    // Agregar marca de agua (logo) centrado en la línea
    const logoWidth = 50; // Ancho del logo en mm
    const logoHeight = 50; // Altura del logo en mm
    const logoX = pdf.internal.pageSize.getWidth() / 2 - logoWidth / 2; // Centrado horizontalmente
    const logoY = 20; // Alineado en la parte superior de la página
    pdf.addImage(logo, "PNG", logoX, logoY, logoWidth, logoHeight);

    // Título centrado debajo del logo
    pdf.text(
      "Comprobante de pago",
      pdf.internal.pageSize.getWidth() / 2,
      logoY + logoHeight + 10,
      { align: "center" }
    );

    // Salto de línea
    const contentY = logoY + logoHeight + 20;

    // Detalles del comprobante
    pdf.text(20, contentY + 10, `Nombre del cliente: ${customerName}`);
    pdf.text(20, contentY + 20, `Email del cliente: ${customerEmail}`);
    pdf.text(20, contentY + 30, `Edad del cliente: ${customerAge}`);
    pdf.text(20, contentY + 40, `Nombre del juego: ${gameName}`);
    pdf.text(20, contentY + 50, `Precio de renta: $${gamePrice}`);
    pdf.text(20, contentY + 60, `Cédula del cliente: ${customerIdentity}`);
    pdf.text(
      20,
      contentY + 70,
      `Fecha inicio de la renta: ${
        createdAt ? new Date(createdAt).toLocaleDateString() : ""
      }`
    );
    pdf.text(
      20,
      contentY + 80,
      `Fecha devolución de la renta: ${
        dueDate ? new Date(dueDate).toLocaleDateString() : ""
      }`
    );

    pdf.save("comprobante.pdf");
  };

  const handleSearchByID = (ID) => {
    // Filtra las rentas por ID que contiene el dígito ingresado
    const filteredRentals = rentals.filter((rental) =>
      rental.id.toString().includes(ID)
    );
    setSearchedID(filteredRentals);
  };

  const handleSearchInputChange = () => {
    const ID = document.getElementById("inputID").value;
    if (ID) {
      handleSearchByID(ID);
    } else {
      // Si el campo de búsqueda está vacío, muestra todos los clientes
      setSearchedID(null);
    }
  };

  const findCustomer = async () => {
    try {
      const response = await axios.get(
        `${url}customers/customerid/${parseInt(
          document.getElementById("idCustomer").value
        )}`
      );
      setCustomer(response.data);
      setErrorMessage(null); // Limpiar el mensaje de error en caso de éxito
    } catch (error) {
      console.error("Error al encontrar el cliente", error);
      setCustomer(null);
      setErrorMessage("Cliente no encontrado"); // Configurar el mensaje de error
    }
  };

  const findGame = async () => {
    try {
      const response = await axios.get(
        `${url}games/gameid/${parseInt(document.getElementById("idGame").value)}`
      );
      setGame(response.data);
      setErrorMessage1(null); // Limpiar el mensaje de error en caso de éxito
    } catch (error) {
      console.error("Error al encontrar el juego", error);
      setGame(null);
      setErrorMessage1("Juego no encontrado"); // Configurar el mensaje de error
    }
  };

  function handleCloseClick() {
    setCustomer(null);
    setGame(null);
    setErrorMessage(null); // Limpiar el mensaje de error al cerrar el modal
    handleCloseModal2();
  }

  const handleSaveNewRental = async () => {
    try {
      const response = await axios.post(`${url}rentals`, {
        customerId: parseInt(document.getElementById("idCustomer").value),
        gameId: parseInt(document.getElementById("idGame").value),
      });
      setRentals(response.data);
      handleCloseModal2();
      window.location.reload();
    } catch (error) {
      console.error("Error al crear la renta", error);
    }
  };
  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.container}>
        <h1>Rentas de la tienda: </h1>
        <div className={style.headerInput}>
          <button onClick={() => handleOpenModal2()} className={style.btnList}>
            Añadir renta
          </button>
          <div className={style.contain}>
            <p>Buscar por ID: </p>
            <input
              type="text"
              id="inputID"
              placeholder="Buscar por ID"
              onChange={handleSearchInputChange}
            />
          </div>
        </div>
        <div className={style.wrapper}>
          {!rentals && (
            <div className={style.rentalList}>
              <h2>No hay ventas realizadas</h2>
            </div>
          )}
          {searchedID !== null ? (
            <div className={style.rentalList}>
              {searchedID.map((rental) => (
                <div key={rental.id} className={style.rentalItem}>
                  <h3>ID de transaccion: {rental.id}</h3>
                  <h3>Juego rentado: {rental.gameName}</h3>
                  <p>Cliente: {rental.customerName}</p>
                  <button
                    onClick={() => handleIconClick(rental)}
                    className={style.btnList}
                  >
                    Ver mas
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className={style.rentalList}>
              {rentals !== null && rentals.length > 0 ? (
                rentals.map((rental) => (
                  <div key={rental.id} className={style.rentalItem}>
                    <h3>ID de transaccion: {rental.id}</h3>
                    <h3>Juego rentado: {rental.gameName}</h3>
                    <p>Cliente: {rental.customerName}</p>
                    <button
                      onClick={() => handleIconClick(rental)}
                      className={style.btnList}
                    >
                      Ver mas
                    </button>
                  </div>
                ))
              ) : (
                <h2>No hay ventas realizadas</h2>
              )}
            </div>
          )}
        </div>
        <Modal
          open={openModal1}
          onClose={handleCloseModal1}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ backdropFilter: "blur(1px)" }}
          id="modal-content"
        >
          <div className={style.boxModalG}>
            <div className={style.buttonCl}>
              <button onClick={handleCloseModal1} className={style.btnEdit}>
                <CloseIcon />
              </button>
            </div>

            <div className={style.containerLabels}>
              <div className={style.sectionForm}>
                <h2>Nombre del cliente: </h2>
                <input
                  value={selectedRental?.customerName}
                  type="text"
                  readOnly
                />
              </div>
              <div className={style.sectionForm}>
                <div className={style.divider}>
                  <h2>Email del cliente: </h2>
                  <input
                    value={selectedRental?.customerEmail}
                    type="text"
                    readOnly
                  />
                  <h2>Edad del cliente: </h2>
                  <input
                    value={selectedRental?.customerAge}
                    type="text"
                    readOnly
                  />
                </div>
              </div>
              <div className={style.sectionForm}>
                <div className={style.divider}>
                  <h2>Nombre del juego rentado: </h2>
                  <input
                    value={selectedRental?.gameName}
                    type="text"
                    readOnly
                  />
                  <h2>Precio del juego rentado: </h2>
                  <input
                    value={selectedRental?.gamePrice}
                    type="text"
                    readOnly
                  />
                </div>
              </div>
              <div className={style.sectionForm}>
                <h2>Cédula del cliente: </h2>
                <input
                  value={selectedRental?.customerIdentity}
                  type="text"
                  readOnly
                />
              </div>
              <div className={style.sectionForm}>
                <div className={style.divider}>
                  <h2>Fecha inicio de la renta: </h2>
                  <input
                    value={
                      selectedRental?.createdAt
                        ? new Date(
                            selectedRental?.createdAt
                          ).toLocaleDateString()
                        : ""
                    }
                    type="text"
                    readOnly
                  />
                  <h2>Fecha devolucion de la renta: </h2>
                  <input
                    value={
                      selectedRental?.createdAt
                        ? new Date(selectedRental?.dueDate).toLocaleDateString()
                        : ""
                    }
                    type="text"
                    readOnly
                  />
                </div>
              </div>
              <div className={style.buttonForm}>
                <button
                  onClick={() => handleClickSave()}
                  className={style.btnEdit}
                >
                  Guardar comprobante
                </button>
              </div>
            </div>
          </div>
        </Modal>
        <Modal
          open={openModal2}
          onClose={handleCloseModal2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ backdropFilter: "blur(1px)" }}
          id="modal-content"
        >
          <div className={style.boxModalG}>
            <div className={style.buttonCl}>
              <button onClick={handleCloseClick} className={style.btnEdit}>
                <CloseIcon />
              </button>
            </div>
            <div className={style.containerLabels}>
              {errorMessage && (
                <div className={style.errorMessage}>
                  <p>{errorMessage}</p>
                </div>
              )}
              <div className={style.sectionForm}>
                <h2>ID del cliente</h2>
                <input
                  type="text"
                  id="idCustomer"
                  placeholder="escribir el ID del cliente"
                />
                <button
                  onClick={() => findCustomer()}
                  className={style.btnList}
                >
                  <SearchIcon />
                </button>
              </div>

              <div className={style.sectionForm}>
                <div className={style.divider}>
                  <h2>Nombre del cliente: </h2>
                  <input value={customer?.name} type="text" readOnly />
                  <h2>Cédula del cliente: </h2>
                  <input value={customer?.identity} type="text" readOnly />
                </div>
              </div>
              <div className={style.sectionForm}>
                <div className={style.divider}>
                  <h2>Email del cliente: </h2>
                  <input value={customer?.email} type="text" readOnly />
                  <h2>Edad del cliente: </h2>
                  <input value={customer?.age} type="text" readOnly />
                </div>
              </div>
              {errorMessage1 && (
                <div className={style.errorMessage}>
                  <p>{errorMessage1}</p>
                </div>
              )}
              <div className={style.sectionForm}>
                <h2>ID del juego</h2>
                <input
                  type="text"
                  id="idGame"
                  placeholder="escribir el ID del juego"
                />
                <button onClick={() => findGame()} className={style.btnList}>
                  <SearchIcon />
                </button>
              </div>
              <div className={style.sectionForm}>
                <div className={style.divider}>
                  <h2>Nombre del juego rentado: </h2>
                  <input value={game?.name} type="text" readOnly />
                  <h2>Precio del juego rentado: </h2>
                  <input value={game?.rentalPrice} type="text" readOnly />
                </div>
              </div>
            </div>
            <div className={style.buttonForm}>
              <button
                className={style.btnList}
                onClick={handleSaveNewRental}
              >
                Crear renta
              </button>
            </div>
          </div>
          
        </Modal>
      </div>
    </div>
  );
};

export default Rental;
