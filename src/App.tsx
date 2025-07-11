import { BrowserRouter } from "react-router-dom"
import "./App.css"
import { Providers } from "./Providers"
import { Router } from "./Router"

function App() {
    return (
        <BrowserRouter>
            <Providers>
                <Router />
            </Providers>
        </BrowserRouter>
    )
}

export default App
