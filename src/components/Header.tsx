import React from 'react'
import {AppBar, Box, Typography} from '@mui/material'

interface HeaderProps {
    
}

export const Header:React.FC<HeaderProps> = (props) => {
    
    return (
        <AppBar  >
            <Typography>
                Forró CWB
            </Typography>
        </AppBar>
    )
}