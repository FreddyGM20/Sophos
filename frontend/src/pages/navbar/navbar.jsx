import React, { Component } from "react";
import logo from "../../assets/montaña.svg";
import style from'./navbar.module.css'  


class Navbar extends Component {
  render() {
    return (
        <header>
          <div className={style.logo}>
            <img src={logo} alt="Logo" />
            <h2>Mountain Games</h2>
          </div>
          <nav className={style.navigation}>
            <a href="/stats">Estadisticas</a>
            <a href="/games">Juegos</a>
            <a href="/customers">Clientes</a>
            <a href="">Rentar</a>
          </nav>
        </header>
    );
  }
}


export default Navbar;
