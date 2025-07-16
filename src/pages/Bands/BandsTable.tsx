import React, { useEffect, useState } from "react"
import { Avatar, Box, Chip, LinearProgress, Paper, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { Artist } from "../../types/server/class/Artist"
import { DataGrid, Toolbar, type GridColDef } from "@mui/x-data-grid"
import { CellAvatar } from "../../components/CellAvatar"
import { DataGridToolbar, toolbar_style } from "../../components/DataGridToolbar"
import { useFormModal } from "../../hooks/useFormModal"
import type { Band } from "../../types/server/class/Band"
import { BandTableCell } from "./BandTableCell"

interface BandsTableProps {}

export const BandsTable: React.FC<BandsTableProps> = (props) => {
    const formContext = useFormModal()

    const [loading, setLoading] = useState(false)

    const { data, isFetching, refetch } = useQuery<Band[]>({
        initialData: [],
        queryKey: ["bandsData"],
        queryFn: async () => (await api.get("/band")).data,
    })

    const columns: (GridColDef & { field: keyof Band | "actions" })[] = [
        {
            field: "name",
            headerName: "Nome",
            flex: 1,
            display: "flex",
            renderCell(params) {
                return <BandTableCell band={params.row} loading={loading} refetch={refetch} setLoading={setLoading} />
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
        <Box sx={{ flexDirection: "column", height: data.length * 470 }}>
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
                rowHeight={470}
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
