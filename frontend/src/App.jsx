import { Component } from "react"
import Stats from "./pages/home/home"
import Games from './pages/games/game'
import Customers from './pages/Customers/customers'
import { BrowserRouter, Routes, Route } from "react-router-dom"

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={'/stats'} element={<Stats/>}/>
                    <Route path={'/games'} element={<Games/>}/>
                    <Route path={'/Customers'} element={<Customers/>}/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App