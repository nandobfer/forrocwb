import React, { useEffect, useState } from "react"
import { Avatar, Box, Chip, LinearProgress, useMediaQuery } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { DataGrid, GridActionsCellItem, Toolbar, type GridColDef } from "@mui/x-data-grid"
import { DataGridToolbar, toolbar_style } from "../../components/DataGridToolbar"
import { useFormModal } from "../../hooks/useFormModal"
import type { Band } from "../../types/server/class/Band"
import { BandTableCell } from "./BandTableCell"
import { CellAvatar } from "../../components/CellAvatar"
import { DescriptionText } from "../../components/DescriptionText"
import { InstagramRender } from "../../components/InstagramRender"
import { useConfirmDialog } from "burgos-confirm"
import { useUser } from "../../hooks/useUser"
import { Delete, Edit, Groups } from "@mui/icons-material"
import { PendingInfoChip } from "../../components/PendingInfoChip"

interface BandsTableProps {}

export const BandsTable: React.FC<BandsTableProps> = (props) => {
    const formContext = useFormModal()
    const { confirm } = useConfirmDialog()
    const { adminApi } = useUser()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [loading, setLoading] = useState(false)

    const { data, isFetching, refetch } = useQuery<Band[]>({
        initialData: [],
        queryKey: ["bandsData"],
        queryFn: async () => (await api.get("/band")).data,
    })

    const onDeletePress = async (band_id: string) => {
        confirm({
            title: "Tem certeza?",
            content: "Essa ação é irreversível",
            onConfirm: async () => {
                setLoading(true)
                try {
                    const response = await adminApi.delete("/band", { params: { band_id } })
                    refetch()
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            },
        })
    }

    const onEditPress = (band: Band) => {
        formContext.setBand(band)
        formContext.open("band")
    }

    const columns: (GridColDef & { field: keyof Band | "actions" })[] = [
        {
            field: "name",
            headerName: "Nome",
            flex: 1,
            display: "flex",
            valueFormatter: (_, row: Band) =>
                row.name + "\n" + row.description + "\n" + row.instagram + "\n" + row.artists.map((item) => item.name).join("\n"),
            renderCell(params) {
                return (
                    <BandTableCell
                        band={params.row}
                        loading={loading}
                        refetch={refetch}
                        setLoading={setLoading}
                        onDeletePress={onDeletePress}
                        onEditPress={onEditPress}
                    />
                )
            },
        },
    ]

    const desktopColumns: (GridColDef & { field: keyof Band | "actions" })[] = [
        {
            field: "image",
            width: 300,
            align: "center",
            headerName: "Foto",

            renderCell(params) {
                return (
                    <Avatar
                        src={params.value || undefined}
                        sx={{ width: 1, height: 150, bgcolor: "background.default", color: "primary.main" }}
                        variant="rounded"
                    >
                        <Groups sx={{ width: 1, height: 1 }} />
                    </Avatar>
                )
            },
            display: "flex",
        },
        { field: "name", headerName: "Nome", flex: 0.2 },
        {
            field: "description",
            headerName: "Descrição",
            flex: 0.4,
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
        {
            field: "artists",
            headerName: "Artistas",
            display: "flex",
            flex: 0.3,
            renderCell(params) {
                const band = params.row as Band
                return (
                    <Box sx={{ gap: 1, flexWrap: "wrap", maxWidth: 1 }}>
                        {band.artists.map((artist) => (
                            <Chip size="small" label={artist.name} key={artist.id} color="primary" />
                        ))}
                        {band.artists.length === 0 && <PendingInfoChip text="nenhum integrante selecionado" icon={Groups} />}
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
                    // <GridActionsCellItem label="Visualizar" showInMenu onClick={() => onDeletePress(params.row.id)} disabled icon={<Visibility />} />,
                    <GridActionsCellItem label="Editar" showInMenu onClick={() => onEditPress(params.row)} icon={<Edit />} />,
                    <GridActionsCellItem label="Deletar" showInMenu onClick={() => onDeletePress(params.row.id)} icon={<Delete />} />,
                ]
            },
        },
    ]

    useEffect(() => {
        if (formContext.band) {
            return () => {
                refetch()
            }
        }
    }, [formContext.band])

    return (
        <Box sx={{ flexDirection: "column" }}>
            <DataGrid
                loading={isFetching || loading}
                rows={data}
                columns={isMobile ? columns : desktopColumns}
                initialState={{
                    pagination: { paginationModel: { page: 0, pageSize: 100 } },
                    sorting: { sortModel: [{ field: "name", sort: "asc" }] },
                }}
                pageSizeOptions={[10, 20, 50]}
                sx={{ border: 0 }}
                rowHeight={isMobile ? 470 : 250}
                showToolbar
                hideFooterPagination
                // autoPageSize
                density="compact"
                slotProps={{ loadingOverlay: { sx: { height: 9999 } } }}
                slots={{
                    baseLinearProgress: () => <LinearProgress sx={{ marginTop: -5 }} />,
                    toolbar: () => (
                        <Toolbar style={toolbar_style}>
                            <DataGridToolbar refresh={refetch} loading={isFetching || loading} title="Bandas" add={() => formContext.open("band")} />
                        </Toolbar>
                    ),
                }}
            />
        </Box>
    )
}
