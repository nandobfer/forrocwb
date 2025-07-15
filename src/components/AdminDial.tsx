import React, { useContext } from "react"
import { Box, SpeedDial, SpeedDialAction, SpeedDialIcon } from "@mui/material"
import { useUser } from "../hooks/useUser"
import { Edit, EditOff, Event as EventIcon, Groups, Person } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import type { MuiIcon } from "../types/MuiIcon"
import { adminRoutes } from "../Router"
import { useDisclosure } from "@mantine/hooks"
import FormModalContext from "../contexts/FormModalContext"
import { ArtistFormModal } from "../pages/Artists/ArtistFormModal"

interface AdminDialProps {}

export type AdminTarget = "event" | "band" | "artist"
export interface AdminActionItem {
    label: string
    target: AdminTarget
    icon: MuiIcon
}

const actions: AdminActionItem[] = [
    { label: "Evento", target: "event", icon: EventIcon },
    { label: "Banda", target: "band", icon: Groups },
    { label: "Artista", target: "artist", icon: Person },
]

export const AdminDial: React.FC<AdminDialProps> = (props) => {
    const { user } = useUser()
    const navigate = useNavigate()
    const formModalContext = useContext(FormModalContext)

    const [createOpened, createHandlers] = useDisclosure(false)
    const [editOpened, editHandlers] = useDisclosure(false)

    const handleCreateClick = (target: AdminTarget) => {
        formModalContext.open(target)
        createHandlers.close()
    }

    const handleEditClick = (target: AdminTarget) => {
        const route = adminRoutes.find((item) => item.id === target)
        if (route) {
            navigate(route.path)
            editHandlers.close()
        }
    }

    return (
        <>
            {/* <SpeedDial
                open={createOpened}
                onClose={createHandlers.close}
                onOpen={createHandlers.open}
                hidden={!user?.admin}
                ariaLabel="admin create actions"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.label}
                        icon={<action.icon />}
                        slotProps={{ tooltip: { title: action.label, arrow: true } }}
                        onClick={() => handleCreateClick(action.target)}
                    />
                ))}
            </SpeedDial> */}
            <SpeedDial
                open={editOpened}
                onClose={editHandlers.close}
                onOpen={editHandlers.open}
                hidden={!user?.admin}
                ariaLabel="admin create actions"
                sx={{ position: "fixed", bottom: 16, right: 16 }}
                icon={<SpeedDialIcon icon={<Edit />} openIcon={<EditOff sx={{ rotate: "90deg" }} />} />}
            >
                {actions.map((action) => (
                    <SpeedDialAction
                        key={action.label}
                        icon={<action.icon />}
                        slotProps={{ tooltip: { title: action.label, arrow: true } }}
                        onClick={() => handleEditClick(action.target)}
                    />
                ))}
            </SpeedDial>

            <ArtistFormModal />
        </>
    )
}
