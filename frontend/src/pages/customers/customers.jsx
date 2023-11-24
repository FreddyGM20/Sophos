import React, { useState, useEffect } from "react";
import Navbar from "../navbar/navbar";
import style from "./customers.module.css";
import axios from "axios";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import Modal from "@mui/material/Modal";

const url = "http://localhost:3000/";

function TablaClientes({ clientes }) {
  if (!clientes) {
    return (
      <tr>
        <td colSpan="6" className={style.errorMessage}>
          <h1>Error al cargar la lista de clientes</h1>
        </td>
      </tr>
    );
  }

  return clientes.map((cliente) => (
    <tr key={cliente.id}>
      <td className={style.customerItem}>{cliente.id}</td>
      <td className={style.customerItem}>{cliente.name}</td>
      <td className={style.customerItem}>{cliente.identity}</td>
      <td className={style.customerItem}>{cliente.email}</td>
      <td className={style.customerItem}>{cliente.age}</td>
      <td className={style.customerItem}>{cliente.rentalsCount}</td>
    </tr>
  ));
}

const Customers = () => {
  const [customers, setCustomers] = useState(null);
  const [searchedCustomers, setSearchedCustomers] = useState(null);

  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  useEffect(() => {
    const obtenerClientes = async () => {
      try {
        const response = await axios.get(`${url}customers`);
        setCustomers(response.data);
      } catch (error) {
        console.error("Error al obtener la lista de clientes", error);
      }
    };
    obtenerClientes();
  }, []);

  const handleSaveNewCustomer = async () => {
    try {
      const response = await axios.post(`${url}customers`, {
        name: `${document.getElementById("nameCustomer").value} ${document.getElementById("lastNameCustomer").value}`,
        email: document.getElementById("emailCustomer").value,
        identity: document.getElementById("identityCustomer").value,
        age: parseInt(document.getElementById("ageCustomer").value),
      });

      setCustomers(response.data);
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Error al guardar el cliente", error);
    }
  };

  const handleSearchByCedula = (cedula) => {
    // Filtra los clientes por cédula que contiene el dígito ingresado
    const filteredCustomers = customers.filter(
      (cliente) => cliente.identity.includes(cedula)
    );
    setSearchedCustomers(filteredCustomers);
  };

  const handleSearchInputChange = () => {
    const cedula = document.getElementById("inputID").value;
    if (cedula) {
      handleSearchByCedula(cedula);
    } else {
      // Si el campo de búsqueda está vacío, muestra todos los clientes
      setSearchedCustomers(null);
    }
  };

  return (
    <div className={style.main}>
      <Navbar />
      <div className={style.container}>
        <h1>Clientes de la tienda: </h1>
        <div className={style.headerInput}>
          <button onClick={handleOpenModal} className={style.btnEdit}>
            Añadir cliente
          </button>
          <div className={style.contain}>
            <p>Buscar por Cédula: </p>
            <input
              type="text"
              id="inputID"
              placeholder="Buscar por Cédula"
              onChange={handleSearchInputChange}
            />
            <button className={style.btnEdit}>
              <SearchIcon />
            </button>
          </div>
        </div>

        <div className={style.wrapper}>
          {searchedCustomers ? (
            // Muestra los resultados de la búsqueda
            <table className={style.customerTable}>
              <thead className={style.tableHeader}>
                <tr>
                  <th className={style.customerItemC}>ID único</th>
                  <th className={style.customerItemC}>Nombre del cliente</th>
                  <th className={style.customerItemC}>Cédula</th>
                  <th className={style.customerItemC}>Email</th>
                  <th className={style.customerItemC}>Edad</th>
                  <th className={style.customerItemC}>
                    Total de juegos rentados
                  </th>
                </tr>
              </thead>
              <tbody>
                <TablaClientes clientes={searchedCustomers} />
              </tbody>
            </table>
          ) : (
            // Muestra todos los clientes si no hay búsqueda
            <table className={style.customerTable}>
              <thead className={style.tableHeader}>
                <tr>
                  <th className={style.customerItemC}>ID único</th>
                  <th className={style.customerItemC}>Nombre del cliente</th>
                  <th className={style.customerItemC}>Cédula</th>
                  <th className={style.customerItemC}>Email</th>
                  <th className={style.customerItemC}>Edad</th>
                  <th className={style.customerItemC}>
                    Total de juegos rentados
                  </th>
                </tr>
              </thead>
              <tbody>
                <TablaClientes clientes={customers} />
              </tbody>
            </table>
          )}
        </div>
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          sx={{ backdropFilter: "blur(1px)" }}
        >
          <div className={style.boxModalG}>
            <div className={style.buttonCl}>
              <button onClick={handleCloseModal} className={style.btnEdit}>
                <CloseIcon />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveNewCustomer();
              }}
            >
              <div className={style.sectionForm}>
                <div className={style.divider}>
                  <h2>Nombres del cliente: </h2>
                  <input
                    id="nameCustomer"
                    type="text"
                    placeholder="Nombres del cliente"
                  />
                  <h2>Apellidos del cliente: </h2>
                  <input
                    id="lastNameCustomer"
                    type="text"
                    placeholder="Apellidos del cliente"
                  />
                </div>
              </div>
              <div className={style.sectionForm}>
                <h2>Cédula del cliente: </h2>
                <input
                  id="identityCustomer"
                  type="text"
                  placeholder="Cédula del cliente"
                />
              </div>
              <div className={style.sectionForm}>
                <div className={style.divider}>
                  <h2>Email del cliente: </h2>
                  <input
                    id="emailCustomer"
                    type="text"
                    placeholder="Email del cliente"
                  />
                  <h2>Edad del cliente: </h2>
                  <input
                    id="ageCustomer"
                    type="text"
                    placeholder="Edad del cliente"
                  />
                </div>
              </div>
              <div className={style.buttonForm}>
                <button
                  type="submit"
                  onClick={handleSaveNewCustomer}
                  className={style.btnEdit}
                >
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Customers;
