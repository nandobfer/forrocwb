import React from 'react'
import { AppBar, Box, Paper, Typography, useMediaQuery } from "@mui/material"
import { version } from "../version"

interface FooterProps {}

const Link: React.FC<{ children: React.ReactNode; link: string }> = (props) => (
    <span className="link" style={{ fontWeight: "bold" }} onClick={() => window.open(props.link, "_new")}>
        {props.children}
    </span>
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
            <Typography variant={isMobile ? "caption" : undefined}>
                Desenvolvido por <Link link="https://www.instagram.com/nandoburgos/">@nandoburgos</Link>
            </Typography>
            <Typography variant={isMobile ? "caption" : undefined}>
                {new Date().getFullYear()} © Direitos Reservados - {version}
            </Typography>
        </AppBar>
    )
}
