import React, { useState } from "react"
import { Avatar, Box, Chip, IconButton, Menu, Typography } from "@mui/material"
import type { Band } from "../../types/server/class/Band"
import { Delete, Edit, Groups, Instagram, MoreVert, TextFormat, Visibility } from "@mui/icons-material"
import { GridActionsCellItem } from "@mui/x-data-grid"
import { useConfirmDialog } from "burgos-confirm"
import { useUser } from "../../hooks/useUser"
import { useFormModal } from "../../hooks/useFormModal"
import { PendingInfoChip } from "../../components/PendingInfoChip"

interface BandTableCellProps {
    band: Band
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    refetch: () => void
}

const containerWidth = "87.5vw"
export const BandTableCell: React.FC<BandTableCellProps> = (props) => {
    const { adminApi } = useUser()
    const { confirm } = useConfirmDialog()
    const formContext = useFormModal()

    const [menuAnchor, setMenuAnchor] = useState<HTMLButtonElement | null>(null)

    const band = props.band
    const ig_base_url = "https://instagram.com/"
    const splitted_ig = band.instagram?.split(ig_base_url)
    let ig_user = ""

    if (splitted_ig && splitted_ig.length === 2) {
        ig_user = splitted_ig[1]
    }

    const closeMenu = () => {
        setMenuAnchor(null)
    }

    const onDeletePress = async (band_id: string) => {
        closeMenu()
        confirm({
            title: "Tem certeza?",
            content: "Essa ação é irreversível",
            onConfirm: async () => {
                props.setLoading(true)
                try {
                    const response = await adminApi.delete("/band", { params: { band_id } })
                    props.refetch()
                } catch (error) {
                    console.log(error)
                } finally {
                    props.setLoading(false)
                }
            },
        })
    }

    const onEditPress = (band: Band) => {
        closeMenu()
        formContext.setBand(band)
        formContext.open("band")
    }

    return (
        <Box sx={{ flexDirection: "column", gap: 1, width: containerWidth }}>
            <Box sx={{ alignItems: "center", justifyContent: "space-between", marginBottom: -1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {band.name}
                </Typography>
                <IconButton size="small" onClick={(ev) => setMenuAnchor(ev.currentTarget)} sx={{ margin: 1, marginRight: 0 }}>
                    <MoreVert />
                </IconButton>
            </Box>
            <Avatar src={band.image || undefined} sx={{ width: 1, height: 150 }} variant="rounded"></Avatar>
            <Box sx={{ flexDirection: "column" }}>
                <Typography
                    variant="caption"
                    sx={{
                        display: "-webkit-box",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 3,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.5,
                        maxHeight: "4.5em",
                        whiteSpace: "break-spaces",
                    }}
                >
                    {band.description || <PendingInfoChip text="descrição pendente" icon={TextFormat} />}
                </Typography>
                <Typography
                    variant="subtitle2"
                    color={ig_user ? "primary" : undefined}
                    sx={{ textDecoration: "underline", width: "min-content" }}
                    className="link"
                    onClick={() => (band.instagram ? window.open(band.instagram, "_new") : undefined)}
                >
                    {ig_user ? `@${ig_user}` : band.instagram || <PendingInfoChip text="instagram pendente" icon={Instagram} />}
                </Typography>
            </Box>
            <Box sx={{ gap: 1, maxWidth: containerWidth, overflowX: "auto" }}>
                {band.artists.map((artist) => (
                    <Chip size="small" label={artist.name} key={artist.id} color="primary" />
                ))}
                {band.artists.length === 0 && <PendingInfoChip text="nenhum integrante selecionado" icon={Groups} />}
            </Box>

            <Menu open={!!menuAnchor} anchorEl={menuAnchor} onClose={closeMenu}>
                <GridActionsCellItem label="Visualizar" showInMenu disabled icon={<Visibility />} />
                <GridActionsCellItem label="Editar" showInMenu icon={<Edit />} onClick={() => onEditPress(band)} />
                <GridActionsCellItem label="Deletar" showInMenu icon={<Delete />} onClick={() => onDeletePress(band.id)} />
            </Menu>
        </Box>
    )
}
