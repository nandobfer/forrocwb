import React from "react"
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import { useUser } from "../hooks/useUser"
import { Edit, EditOff, Event as EventIcon, Groups, Person } from "@mui/icons-material"

interface AdminDialProps {}

const actions = [
    { label: "Evento", target: "event", icon: <EventIcon /> },
    { label: "Banda", target: "band", icon: <Groups /> },
    { label: "Artista", target: "artist", icon: <Person /> },
]

export const AdminDial: React.FC<AdminDialProps> = (props) => {
    const { user } = useUser()

    return (
        <>
            <SpeedDial
                hidden={!user?.admin}
                ariaLabel="admin create actions"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction key={action.label} icon={action.icon} slotProps={{ tooltip: { title: action.label, open: true, arrow: true } }} />
                ))}
            </SpeedDial>
            <SpeedDial
                hidden={!user?.admin}
                ariaLabel="admin create actions"
                sx={{ position: "fixed", bottom: 16, right: 86 }}
                icon={<SpeedDialIcon icon={<Edit />} openIcon={<EditOff />} />}
            >
                {actions.map((action) => (
                    <SpeedDialAction key={action.label} icon={action.icon} slotProps={{ tooltip: { title: action.label, open: true, arrow: true } }} />
                ))}
            </SpeedDial>
        </>
    )
}
