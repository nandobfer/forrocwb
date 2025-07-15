import React from "react"
import { Route, Routes } from "react-router-dom"
import { Bands } from "./pages/Bands/Bands"
import { Events } from "./pages/Events/Events"
import { useUser } from "./hooks/useUser"
import { ArtistsTable } from "./pages/Artists/ArtistsTable"
import { NotFound } from "./pages/NotFound"
import { BandsTable } from "./pages/Bands/BandsTable"

export interface RouteItem {
    path: string
    index?: boolean
    element: React.ReactNode
    label: string
    id: string
}
interface RouterProps {}

export const routes: RouteItem[] = [
    { path: "/", index: true, element: <Events />, label: "Eventos", id: "event" },
    { element: <Bands />, label: "Bandas", path: "/bandas", id: "band" },
    { element: <Bands />, label: "Artistas", path: "/artistas", id: "artist" },
]

export const adminRoutes: RouteItem[] = [
    { element: <ArtistsTable />, label: "Artistas", path: "/admin/artistas", id: "artist" },
    { element: <BandsTable />, label: "Bandas", path: "/admin/bandas", id: "band" },
]

export const Router: React.FC<RouterProps> = (props) => {
    const { user } = useUser()

    return (
        <Routes>
            {routes.map((route) => (
                <Route key={route.path} path={route.path} index={route.index} element={route.element} />
            ))}
            {user?.admin && adminRoutes.map((route) => <Route key={route.path} path={route.path} index={route.index} element={route.element} />)}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}
