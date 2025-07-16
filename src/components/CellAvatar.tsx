import React, { useState } from "react"
import { Avatar, Skeleton } from "@mui/material"
import { BrokenImage } from "@mui/icons-material"

interface CellAvatarProps {
    source?: string
}

export const CellAvatar: React.FC<CellAvatarProps> = (props) => {
    const [error, setError] = useState(false)

    return (
        <Avatar src={props.source} sx={{ width: 60, height: 60 }} variant="circular" onError={() => setError(true)}>
            {error ? <BrokenImage /> : <Skeleton variant="circular" width={60} height={60} animation="wave" />}
        </Avatar>
    )
}
