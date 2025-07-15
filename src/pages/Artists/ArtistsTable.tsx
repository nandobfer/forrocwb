import React, { useEffect, useState } from "react"
import { Box, LinearProgress, Paper, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { Artist } from "../../types/server/class/Artist"
import { DataGrid, Toolbar, type GridColDef } from "@mui/x-data-grid"
import { CellAvatar } from "../../components/CellAvatar"
import { DataGridToolbar, toolbar_style } from "../../components/DataGridToolbar"
import { useFormModal } from "../../hooks/useFormModal"
import { GridActionsCellItem } from "@mui/x-data-grid"
import { useUser } from "../../hooks/useUser"
import { useConfirmDialog } from "burgos-confirm"
import { Delete, Edit, Visibility } from "@mui/icons-material"

interface ArtistsTableProps {}

export const ArtistsTable: React.FC<ArtistsTableProps> = (props) => {
    const formContext = useFormModal()
    const { adminApi } = useUser()
    const { confirm } = useConfirmDialog()

    const [loading, setLoading] = useState(false)

    const { data, isFetching, refetch } = useQuery<Artist[]>({
        initialData: [],
        queryKey: ["artistsData"],
        queryFn: async () => (await api.get("/artist")).data,
    })

    const columns: (GridColDef & { field: keyof Artist | "actions" })[] = [
        {
            field: "image",
            width: 80,
            align: "center",
            headerName: "Foto",

            renderCell(params) {
                return <CellAvatar source={params.value} />
            },
            display: "flex",
        },
        {
            field: "name",
            headerName: "Nome",
            flex: 0.3,
            display: "flex",
            renderCell(params) {
                const artist = params.row as Artist
                const ig_base_url = "https://instagram.com/"
                const splitted_ig = artist.instagram?.split(ig_base_url)
                let ig_user = ""

                if (splitted_ig && splitted_ig.length === 2) {
                    ig_user = splitted_ig[1]
                }

                return (
                    <Box sx={{ flexDirection: "column", gap: 0 }}>
                        <Typography variant="subtitle2">{artist.name}</Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                WebkitLineClamp: 3,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: 200,
                            }}
                        >
                            {artist.description}
                        </Typography>
                        <Typography
                            variant="subtitle2"
                            color={ig_user ? "primary" : undefined}
                            sx={{ textDecoration: "underline", width: "min-content" }}
                            className="link"
                            onClick={() => (artist.instagram ? window.open(artist.instagram, "_new") : undefined)}
                        >
                            {ig_user ? `@${ig_user}` : artist.instagram}
                        </Typography>
                    </Box>
                )
            },
        },
        {
            field: "actions",
            type: "actions",
            flex: 0.1,
            headerName: "Ações",
            getActions(params) {
                return [
                    <GridActionsCellItem label="Visualizar" showInMenu onClick={() => onDeletePress(params.row.id)} disabled icon={<Visibility />} />,
                    <GridActionsCellItem label="Editar" showInMenu onClick={() => onEditPress(params.row)} icon={<Edit />} />,
                    <GridActionsCellItem label="Deletar" showInMenu onClick={() => onDeletePress(params.row.id)} icon={<Delete />} />,
                ]
            },
        },
    ]

    const onDeletePress = async (artist_id: string) => {
        confirm({
            title: "Tem certeza?",
            content: "Essa ação é irreversível",
            onConfirm: async () => {
                setLoading(true)
                try {
                    const response = await adminApi.delete("/artist", { params: { artist_id } })
                    refetch()
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            },
        })
    }

    const onEditPress = (artist: Artist) => {
        formContext.setArtist(artist)
        formContext.open("artist")
    }

    useEffect(() => {
        if (formContext.artist) {
            return () => {
                refetch()
            }
        }
    }, [formContext.artist])

    return (
        <Box sx={{ flexDirection: "column" }}>
            <DataGrid
                loading={isFetching || loading}
                rows={data}
                columns={columns}
                initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 10 } },
                    sorting: { sortModel: [{ field: "name", sort: "asc" }] },
                }}
                pageSizeOptions={[10, 20, 50]}
                sx={{ border: 0 }}
                rowHeight={200}
                showToolbar
                hideFooterPagination
                // autoPageSize
                density="compact"
                slotProps={{ loadingOverlay: { sx: { height: 9999 } } }}
                slots={{
                    baseLinearProgress: () => <LinearProgress sx={{ marginTop: -5 }} />,
                    toolbar: () => (
                        <Toolbar style={toolbar_style}>
                            <DataGridToolbar
                                refresh={refetch}
                                loading={isFetching || loading}
                                title="Artistas"
                                add={() => formContext.open("artist")}
                            />
                        </Toolbar>
                    ),
                }}
            />
        </Box>
    )
}
