import React, { useEffect, useState } from "react"
import { Box, LinearProgress, Paper, Typography, useMediaQuery } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { DataGrid, Toolbar, type GridColDef } from "@mui/x-data-grid"
import { CellAvatar } from "../../components/CellAvatar"
import { DataGridToolbar, toolbar_style } from "../../components/DataGridToolbar"
import { useFormModal } from "../../hooks/useFormModal"
import { GridActionsCellItem } from "@mui/x-data-grid"
import { useUser } from "../../hooks/useUser"
import { useConfirmDialog } from "burgos-confirm"
import { Delete, Edit, Instagram, TextFormat, Visibility } from "@mui/icons-material"
import { PendingInfoChip } from "../../components/PendingInfoChip"
import { DescriptionText } from "../../components/DescriptionText"
import type { Artist } from "../../types/server/class/Artist"
import { InstagramRender } from "../../components/InstagramRender"

interface ArtistsTableProps {}

export const ArtistsTable: React.FC<ArtistsTableProps> = (props) => {
    const isMobile = useMediaQuery("(orientation: portrait)")
    const formContext = useFormModal()
    const { adminApi } = useUser()
    const { confirm } = useConfirmDialog()

    const [loading, setLoading] = useState(false)

    const { data, isFetching, refetch } = useQuery<Artist[]>({
        initialData: [],
        queryKey: ["artistsData"],
        queryFn: async () => (await api.get("/artist")).data,
    })

    const actionColumn: GridColDef & { field: "actions" } = {
        field: "actions",
        type: "actions",
        flex: 0.1,
        headerName: "Ações",
        getActions(params) {
            return [
                // <GridActionsCellItem label="Visualizar" showInMenu onClick={() => onDeletePress(params.row.id)} disabled icon={<Visibility />} />,
                <GridActionsCellItem label="Editar" showInMenu onClick={() => onEditPress(params.row)} icon={<Edit />} />,
                <GridActionsCellItem label="Deletar" showInMenu onClick={() => onDeletePress(params.row.id)} icon={<Delete />} />,
            ]
        },
    }

    const imageColumn: GridColDef & { field: keyof Artist } = {
        field: "image",
        width: 80,
        align: "center",
        headerName: "Foto",

        renderCell(params) {
            return <CellAvatar source={params.value} />
        },
        display: "flex",
    }

    const columns: (GridColDef & { field: keyof Artist | "actions" })[] = isMobile
        ? [
              imageColumn,
              {
                  field: "name",
                  headerName: "Nome",
                  flex: 1,
                  display: "flex",
                  valueFormatter: (_, row: Artist) => row.name + "\n" + row.description + "\n" + row.instagram,
                  renderCell(params) {
                      const artist = params.row as Artist

                      return (
                          <Box sx={{ flexDirection: "column", gap: 0 }}>
                              <Typography variant="subtitle2">{artist.name}</Typography>
                              <DescriptionText text={artist.description} />
                              <InstagramRender instagram_url={artist.instagram} />
                          </Box>
                      )
                  },
              },
              actionColumn,
          ]
        : [
              imageColumn,
              { field: "name", headerName: "Nome", flex: 0.2 },
              {
                  field: "description",
                  headerName: "Descrição",
                  flex: 0.5,
                  display: "flex",
                  renderCell(params) {
                      return <DescriptionText text={params.value} />
                  },
              },
              {
                  field: "instagram",
                  headerName: "Instagram",
                  flex: 0.2,
                  display: "flex",
                  renderCell(params) {
                      return <InstagramRender instagram_url={params.value} />
                  },
              },
              actionColumn,
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
                    pagination: { paginationModel: { page: 0, pageSize: 100 } },
                    sorting: { sortModel: [{ field: "name", sort: "asc" }] },
                }}
                pageSizeOptions={[10, 20, 50]}
                sx={{ border: 0 }}
                rowHeight={isMobile ? 200 : 150}
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
