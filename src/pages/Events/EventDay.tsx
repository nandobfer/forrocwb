import React from "react"
import { Box, Paper, Typography } from "@mui/material"
import type { Event } from "../../types/server/class/Event"
import { useMuiTheme } from "../../hooks/useMuiTheme"
import { EventContainer } from "./EventContainer"
import { MoodBad } from "@mui/icons-material"

interface EventDayProps {
    day: WeekDay
    index: number
}

export interface WeekDay {
    name: string
    events: Event[]
}

export const EventDay: React.FC<EventDayProps> = ({ day, index }) => {
    const theme = useMuiTheme()
    const today = new Date().getDay()
    const isToday = index === 6 ? today === 0 : index === today - 1
    return (
        <Paper sx={{ flexDirection: "column", borderTopRightRadius: 50, borderTopLeftRadius: 50, overflow: "hidden" }}>
            <Paper
                sx={{
                    flexDirection: "column",
                    padding: 1,
                    borderTopRightRadius: 50,
                    borderTopLeftRadius: 50,
                    bgcolor: isToday ? "primary.main" : theme.palette.divider,
                }}
            >
                <Typography variant="h6" sx={{ alignSelf: "center" }}>
                    {day.name}
                </Typography>
            </Paper>
            <Paper sx={{ flexDirection: "column", padding: 2 }}>
                {day.events
                    .sort((a, b) => Number(a) - Number(b))
                    .map((event, index) => (
                        <EventContainer key={event.id} event={event} divider={index !== day.events.length - 1} />
                    ))}
                {day.events.length === 0 && (
                    <Box sx={{ flexDirection: "column", alignItems: "center" }}>
                        <Typography variant="subtitle2">Sem forró nesse dia</Typography>
                        <MoodBad />
                    </Box>
                )}
            </Paper>
        </Paper>
    )
}
