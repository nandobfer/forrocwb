import React, { useEffect, useState } from "react"
import { Box, LinearProgress } from "@mui/material"
import { useFormModal } from "../../hooks/useFormModal"
import { useQuery } from "@tanstack/react-query"
import { api } from "../../backend/api"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import type { Event } from "../../types/server/class/Event"
import { Toolbar } from "@mui/x-data-grid"
import { DataGridToolbar, toolbar_style } from "../../components/DataGridToolbar"
import { EventTableCell } from "./EventTableCell"
import { formatDate } from "../../tools/formatDate"
import { getWeekNumber } from "../../tools/getWeekNumber"
import { WeekNavigation } from "./WeekNavigation"

interface EventsTableProps {}

export const EventsTable: React.FC<EventsTableProps> = (props) => {
    const formContext = useFormModal()

    const [week, setWeek] = useState(getWeekNumber(new Date().getTime()))
    const [loading, setLoading] = useState(false)

    const { data, isFetching, refetch } = useQuery<Event[]>({
        initialData: [],
        queryKey: ["eventsData", week],
        queryFn: async () => (await api.get("/event", { params: { week } })).data,
    })

    const columns: (GridColDef & { field: keyof Event | "actions" })[] = [
        {
            field: "title",
            headerName: "Nome",
            flex: 1,
            display: "flex",
            renderCell(params) {
                return <EventTableCell event={params.row} loading={loading} refetch={refetch} setLoading={setLoading} />
            },
            valueFormatter: (_, row: Event) =>
                row.title +
                "\n" +
                row.description +
                "\n" +
                formatDate(row.datetime) +
                "\n" +
                row.artists.map((item) => item.name).join("\n") +
                "\n" +
                row.bands.map((item) => item.name).join("\n") +
                "\n" +
                (row.price || "gratis") +
                "\n" +
                row.ticketUrl,
        },
    ]

    useEffect(() => {
        if (formContext.event) {
            return () => {
                refetch()
            }
        }
    }, [formContext.event])

    return (
        <Box
            sx={{
                flexDirection: "column",
                minHeight: 200,
                height: data.length * 550 + 100,
            }}
        >
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
                rowHeight={550}
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
                                title="Eventos"
                                add={() => formContext.open("event")}
                            />
                        </Toolbar>
                    ),
                    columnHeaders: () => (
                        <Box sx={{ flexDirection: "column", marginBottom: -2 }}>
                            <WeekNavigation selectedWeek={week} setSelectedWeek={setWeek} />
                        </Box>
                    ),
                }}
            />
        </Box>
    )
}
