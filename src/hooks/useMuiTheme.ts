import { createTheme } from "@mui/material"
import { useMemo } from "react"
import { ptBR } from "@mui/x-data-grid/locales"
import { colors } from "../style/colors"

export const useMuiTheme = () => {
    const THEME = useMemo(
        () =>
            createTheme(
                {
                    typography: {
                        fontFamily: "Poppins",
                    },
                    palette: {
                        mode: "dark",

                        primary: {
                            main: colors.primary,
                        },
                        secondary: {
                            main: colors.secondary,
                        },

                        background: {
                            default: colors.background,
                            // paper: colors.paper,
                        },
                        // text: {primary: colors.primary}
                    },
                    components: {
                        MuiMenuList: { defaultProps: { sx: { backgroundColor: colors.background } } },
                        MuiList: { defaultProps: { sx: { backgroundColor: colors.background } } },
                        MuiDataGrid: {
                            styleOverrides: {
                                columnHeader: {
                                    color: colors.secondary,
                                },
                            },
                        },
                        MuiAutocomplete: {
                            styleOverrides: {
                                listbox: { width: "100%", backgroundColor: colors.background },
                            },
                        },
                        MuiButton: { styleOverrides: { contained: { color: colors.secondary } } },
                        MuiCircularProgress: { defaultProps: { size: "1.5rem", color: "secondary" } },
                        MuiTooltip: { defaultProps: { arrow: true } },
                    },
                },
                ptBR
            ),
        [colors]
    )

    return THEME
}
