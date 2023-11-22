import { Component } from "react"
import Stats from "./pages/home/home"
import { BrowserRouter, Routes, Route } from "react-router-dom"

class App extends Component {

    render() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path={'/stats'} element={<Stats/>}/>
                </Routes>
            </BrowserRouter>
        )
    }
}

export default App