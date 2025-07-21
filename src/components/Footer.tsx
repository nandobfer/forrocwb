import React from 'react'
import { AppBar, Box, Paper, Typography, useMediaQuery } from "@mui/material"
import { version } from "../version"

interface FooterProps {}

const Link: React.FC<{ children: React.ReactNode; link: string }> = (props) => (
    <Typography
        color="primary"
        variant="inherit"
        component={"span"}
        className="link"
        style={{ fontWeight: "bold" }}
        onClick={() => window.open(props.link, "_new")}
    >
        {props.children}
    </Typography>
)

export const Footer: React.FC<FooterProps> = ({}) => {
    const isMobile = useMediaQuery("(orientation: portrait)")

    return (
        <AppBar
            enableColorOnDark
            color="default"
            position="relative"
            sx={{ flexDirection: "column", alignItems: "center", padding: 2, borderRadius: 0 }}
        >
            <Typography variant={"caption"}>
                Desenvolvido por <Link link="https://www.instagram.com/nandoburgos/">@nandoburgos</Link>
            </Typography>
            <Typography variant={"caption"}>
                {new Date().getFullYear()} © Direitos Reservados - {version}
            </Typography>
        </AppBar>
    )
}
