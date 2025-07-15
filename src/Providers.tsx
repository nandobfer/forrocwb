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

interface ProvidersProps {
    children?: React.ReactNode
}

export const Providers: React.FC<ProvidersProps> = (props) => {
    const theme = useMuiTheme()

    return (
        <ThemeProvider theme={theme}>
            <MantineProvider>
                <SnackbarProvider>
                    <ConfirmDialogProvider>
                        <QueryClientProvider client={new QueryClient()}>
                            <UserProvider>
                                <FormModalProvider>
                                    <Header />
                                    <Box sx={{ flexDirection: "column", overflowY: "auto", padding: 2 }}>{props.children}</Box>
                                    <Snackbar />
                                    <ConfirmDialog />
                                    <AdminDial />
                                </FormModalProvider>
                            </UserProvider>
                        </QueryClientProvider>
                    </ConfirmDialogProvider>
                </SnackbarProvider>
            </MantineProvider>
        </ThemeProvider>
    )
}
