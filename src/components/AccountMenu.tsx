import React from "react"
import { Box, Divider, MenuItem, Typography } from "@mui/material"
import type { User } from "../types/server/class/User"
import { useUser } from "../hooks/useUser"
import { version } from "../version"

interface AccountMenuProps {
    user: User
}

export const AccountMenu: React.FC<AccountMenuProps> = (props) => {
    const { logout } = useUser()

    return (
        <>
            <Box sx={{ flexDirection: "column", padding: "0.5vw 16px", }}>
                <Typography variant="caption">{props.user.name}</Typography>
                <Typography variant="caption">{props.user.email}</Typography>
            </Box>
            <Divider sx={{ margin: "8px 16px" }} />
            <MenuItem dense onClick={logout}>Sair</MenuItem>
        </>
    )
}
