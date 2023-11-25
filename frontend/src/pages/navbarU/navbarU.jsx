import React, { Component } from "react";
import logo from "../../assets/montaña.svg";
import style from'./navbarU.module.css'  


class Navbar extends Component {
  render() {
    return (
        <header>
          <div className={style.logo}>
            <img src={logo} alt="Logo" />
            <h2>Mountain Games</h2>
          </div>
        </header>
    );
  }
}


export default Navbar;
