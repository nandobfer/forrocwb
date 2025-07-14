import React, { useEffect, useState } from "react"
import {
    AppBar,
    Avatar,
    Box,
    ClickAwayListener,
    Divider,
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Popper,
    Toolbar,
    Typography,
    useMediaQuery,
} from "@mui/material"
import { useUser } from "../hooks/useUser"
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material"
import { version } from "../version"
import { AccountMenu } from "./AccountMenu"
import { LoginFormMenu } from "./LoginFormMenu"

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = (props) => {
    const { user } = useUser()
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
        <AppBar enableColorOnDark>
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <IconButton>
                    <MenuIcon sx={{ color: "background.default" }} />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Forró CWB
                </Typography>
                <IconButton onClick={handleAccountMenuClick}>
                    {user ? (
                        <Avatar sx={{ color: "primary.main", bgcolor: "background.default", width: "1em", height: "1em" }}>
                            <Typography>{user?.name[0]}</Typography>
                        </Avatar>
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
