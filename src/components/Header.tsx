import React from 'react'
import { AppBar, Box, Toolbar, Typography } from "@mui/material"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = (props) => {
    return (
        <AppBar enableColorOnDark>
            <Toolbar>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Forró CWB
                </Typography>
            </Toolbar>
        </AppBar>
    )
}