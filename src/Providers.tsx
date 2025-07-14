import React from "react"
import { Box, ThemeProvider } from "@mui/material"
import { useMuiTheme } from "./hooks/useMuiTheme"
import { ConfirmDialog, ConfirmDialogProvider } from "burgos-confirm"
import { Snackbar, SnackbarProvider } from "burgos-snackbar"
import { MantineProvider } from "@mantine/core"
import { Header } from "./components/Header"

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
                        <Box sx={{ height: 1, bgcolor: "background.default", flexDirection: "column", overflowY: "auto" }}>
                            <Header />
                            {props.children}
                            <Snackbar />
                            <ConfirmDialog />
                        </Box>
                    </ConfirmDialogProvider>
                </SnackbarProvider>
            </MantineProvider>
        </ThemeProvider>
    )
}
