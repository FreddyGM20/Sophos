import { Component } from "react";
import Stats from "./pages/home/home";
import Games from "./pages/games/game";
import Customers from "./pages/customers/customers";
import Rentals from "./pages/rental/rental";
import Users from "./pages/users/user";
import { BrowserRouter, Routes, Route } from "react-router-dom";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<Users />} />
          <Route path={"/stats"} element={<Stats />} />
          <Route path={"/games"} element={<Games />} />
          <Route path={"/customers"} element={<Customers />} />
          <Route path={"/rentals"} element={<Rentals />} />
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
