import React from "react"
import { Box, ThemeProvider } from "@mui/material"
import { useMuiTheme } from "./hooks/useMuiTheme"
import { ConfirmDialog, ConfirmDialogProvider } from "burgos-confirm"
import { Snackbar, SnackbarProvider } from "burgos-snackbar"
import { MantineProvider } from "@mantine/core"
import { Header } from "./components/Header"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { UserProvider } from "./contexts/UserContext"
import { AdminDial } from "./components/AdminDial"
import { FormModalProvider } from "./contexts/FormModalContext"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import "dayjs/locale/pt-br"
import { Footer } from "./components/Footer"

interface ProvidersProps {
    children?: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = (props) => {
    const theme = useMuiTheme()

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <MantineProvider>
                    <SnackbarProvider>
                        <ConfirmDialogProvider>
                            <QueryClientProvider client={new QueryClient()}>
                                <UserProvider>
                                    <FormModalProvider>
                                        <Header />
                                        <Box sx={{ flexDirection: "column", padding: 2, minHeight: "85vh" }}>{props.children}</Box>
                                        <Footer />
                                        <Snackbar />
                                        <ConfirmDialog />
                                        <AdminDial />
                                    </FormModalProvider>
                                </UserProvider>
                            </QueryClientProvider>
                        </ConfirmDialogProvider>
                    </SnackbarProvider>
                </MantineProvider>
            </LocalizationProvider>
        </ThemeProvider>
    )
}
