import React, { useEffect, useState } from "react"
import { AppBar, Avatar, Box, Button, IconButton, Menu, Toolbar, Typography, useMediaQuery } from "@mui/material"
import { useUser } from "../hooks/useUser"
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material"
import { AccountMenu } from "./AccountMenu"
import { LoginFormMenu } from "./LoginFormMenu"
import { Routes } from "./Routes"
import { useNavigate } from "react-router-dom"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = (props) => {
    const { user } = useUser()
    const navigate = useNavigate()
    const isMobile = useMediaQuery("(orientation: portrait)")

    const [accountMenuAnchor, setAccountMenuAnchor] = useState<null | HTMLElement>(null)

    const handleAccountMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAccountMenuAnchor(event.currentTarget)
    }
    const handleAccountMenuClose = () => {
        setAccountMenuAnchor(null)
    }

    useEffect(() => {
        setAccountMenuAnchor(null)
    }, [user])

    return (
        <AppBar enableColorOnDark position="sticky" color="default">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Box sx={{ gap: 0.5, alignItems: "center" }}>
                    <Avatar src="/logo.png" variant="square" />
                    <Button color="inherit" onClick={() => navigate("/")}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Forró CWB
                        </Typography>
                    </Button>
                    {/* <Routes /> */}
                </Box>
                <IconButton onClick={handleAccountMenuClick}>
                    {user ? (
                        <Avatar sx={{ color: "inherit", bgcolor: "primary.main" }}>{user?.name[0]}</Avatar>
                    ) : (
                        <AccountCircle sx={{ color: "background.default" }} />
                    )}
                </IconButton>
            </Toolbar>
            <Menu
                anchorEl={accountMenuAnchor}
                open={!!accountMenuAnchor}
                onClose={handleAccountMenuClose}
                disableEscapeKeyDown
                slotProps={{
                    paper: {
                        sx: { flexDirection: "column", bgcolor: "background.default", minWidth: isMobile ? "60vw" : "15vw", alignItems: "center" },
                    },
                }}
            >
                {user ? <AccountMenu user={user} /> : <LoginFormMenu />}
            </Menu>
            {/* <Popper open={!!accountMenuAnchor} anchorEl={accountMenuAnchor} placement="bottom-end">
                <ClickAwayListener onClickAway={handleAccountMenuClose}>
                    <Paper
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                        }}
                        elevation={8}
                    >
                        {user ? <AccountMenu user={user} /> : <LoginFormMenu />}
                    </Paper>
                </ClickAwayListener>
            </Popper> */}
        </AppBar>
    )
}
