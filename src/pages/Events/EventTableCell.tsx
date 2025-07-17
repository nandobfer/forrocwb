import React, { useState } from "react"
import { Avatar, Box, Button, Chip, IconButton, Menu, Typography } from "@mui/material"
import type { Event } from "../../types/server/class/Event"
import { useUser } from "../../hooks/useUser"
import { useConfirmDialog } from "burgos-confirm"
import { useFormModal } from "../../hooks/useFormModal"
import { AddPhotoAlternate, BrokenImage, Delete, Edit, Groups, Link, MoreVert, Person, Reply, Visibility } from "@mui/icons-material"
import { GridActionsCellItem } from "@mui/x-data-grid"
import dayjs from "dayjs"
import { DescriptionText } from "../../components/DescriptionText"
import { currencyMask } from "../../tools/numberMask"
import { PendingInfoChip } from "../../components/PendingInfoChip"
import { formatDate } from "../../tools/formatDate"

interface EventTableCellProps {
    event: Event
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    refetch: () => void
}

export const EventTableCell: React.FC<EventTableCellProps> = (props) => {
    const { adminApi } = useUser()
    const { confirm } = useConfirmDialog()
    const formContext = useFormModal()

    const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)

    const event = props.event

    const closeMenu = () => {
        setMenuAnchor(null)
    }

    const onDeletePress = async (event_id: string) => {
        closeMenu()
        confirm({
            title: "Tem certeza?",
            content: "Essa ação é irreversível",
            onConfirm: async () => {
                props.setLoading(true)
                try {
                    const response = await adminApi.delete("/event", { params: { event_id } })
                    props.refetch()
                } catch (error) {
                    console.log(error)
                } finally {
                    props.setLoading(false)
                }
            },
        })
    }

    const onEditPress = (event: Event) => {
        closeMenu()
        formContext.setEvent(event)
        formContext.open("event")
    }

    return (
        <Box sx={{ flexDirection: "column", gap: 1, width: 1 }}>
            <Box sx={{ alignItems: "center", justifyContent: "space-between", marginBottom: -1 }}>
                <Box sx={{ flexDirection: "column" }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                        {event.title}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }} color="info">
                        {formatDate(event.datetime)}
                    </Typography>
                </Box>
                <IconButton size="small" onClick={(ev) => setMenuAnchor(ev.currentTarget)} sx={{ margin: 1, marginRight: 0 }}>
                    <MoreVert />
                </IconButton>
            </Box>

            <Avatar
                src={event.image || undefined}
                sx={{ width: 1, height: 150, bgcolor: "background.paper", color: "primary.main" }}
                variant="rounded"
            >
                <BrokenImage sx={{ width: 1, height: 1 }} />
            </Avatar>
            <DescriptionText text={event.description} />

            <Box sx={{ gap: 1, maxWidth: 1, overflowX: "auto" }}>
                {event.bands.length === 0 ? <PendingInfoChip text="nenhuma banda presente" icon={Groups} /> : <Groups />}
                {event.bands.map((band) => (
                    <Chip size="small" label={band.name} key={band.id} color="primary" />
                ))}
            </Box>
            <Box sx={{ gap: 1, maxWidth: 1, overflowX: "auto" }}>
                {event.artists.length === 0 ? <PendingInfoChip text="nenhum artista avulso presente" icon={Person} /> : <Person />}
                {event.artists.map((artist) => (
                    <Chip size="small" label={artist.name} key={artist.id} color="primary" />
                ))}
            </Box>

            <Box sx={{ justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body1" color="success" sx={{ fontWeight: "bold" }}>
                    {event.price ? currencyMask(event.price) : "GRÁTIS"}
                </Typography>

                {event.ticketUrl ? (
                    <Button
                        size="small"
                        onClick={() => window.open(event.ticketUrl!, "_new")}
                        sx={{ borderBottom: "1px solid", borderRadius: 0 }}
                        endIcon={<Reply sx={{ rotate: "180deg", transform: "scale(1, -1)" }} />}
                    >
                        Ingresso
                    </Button>
                ) : (
                    <PendingInfoChip text="Link de ingresso pendente" icon={Link} />
                )}
            </Box>

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={closeMenu}>
                <GridActionsCellItem label="Visualizar" showInMenu disabled icon={<Visibility />} />
                <GridActionsCellItem label="Editar" showInMenu icon={<Edit />} onClick={() => onEditPress(event)} />
                <GridActionsCellItem label="Deletar" showInMenu icon={<Delete />} onClick={() => onDeletePress(event.id)} />
            </Menu>
        </Box>
    )
}
