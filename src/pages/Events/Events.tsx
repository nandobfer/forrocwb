import React, { useEffect, useState } from "react"
import { Box, LinearProgress, Typography } from "@mui/material"
import { useQuery } from "@tanstack/react-query"
import { Event } from "../../types/server/class/Event"
import { api } from "../../backend/api"
import { getWeekNumber } from "../../tools/getWeekNumber"
import { WeekNavigation } from "./WeekNavigation"

interface EventListProps {}

export const Events: React.FC<EventListProps> = (props) => {
    const [week, setWeek] = useState(getWeekNumber(new Date().getTime()))

    const { data, isFetching } = useQuery<Event[]>({
        initialData: [],
        queryKey: ["eventsData", week],
        queryFn: async () => (await api.get("/event", { params: { week } })).data,
    })

    return (
        <Box sx={{ flexDirection: "column" }}>
            <WeekNavigation selectedWeek={week} setSelectedWeek={setWeek} />
            {isFetching ? (
                <LinearProgress variant="indeterminate" />
            ) : data.length > 0 ? (
                data.map((event) => <Typography key={event.id}>{event.title}</Typography>)
            ) : (
                <Typography color="textPrimary">Nenhum forró cadastrado essa semana</Typography>
            )}
        </Box>
    )
}
