import React, { Component } from "react";
import logo from "../../assets/montaña.svg";
import style from'./navbar.module.css'  


class Navbar extends Component {
  render() {
    return (
        <header>
          <div className={style.logo}>
            <img src={logo} alt="Logo" />
            <h2>Mountain</h2>
          </div>
          <nav className={style.navigation}>
            <a href="">Stats</a>
            <a href="">Games</a>
            <a href="">Clients</a>
            <a href="">Contact</a>
          </nav>
        </header>
    );
  }
}


export default Navbar;
