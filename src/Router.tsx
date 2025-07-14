import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Bands } from "./pages/Bands/Bands"
import { Events } from "./pages/Events/Events"

export interface RouteItem {
    path: string
    index?: boolean
    element: React.ReactNode
    label: string
}
interface RouterProps {}

export const routes: RouteItem[] = [
    { path: "/", index: true, element: <Events />, label: "Eventos" },
    { element: <Bands />, label: "Bandas", path: "/bandas" },
    { element: <Bands />, label: "Artistas", path: "/artistas" },
]

export const Router: React.FC<RouterProps> = (props) => {
    return (
        <Routes>
            {routes.map((route) => (
                <Route key={route.path} path={route.path} index={route.index} element={route.element} />
            ))}
        </Routes>
    )
}