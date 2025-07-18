import React, { useState } from "react"
import { Avatar, Box, Button, ClickAwayListener, Tooltip, Typography } from "@mui/material"
import type { Band } from "../types/server/class/Band"
import { BandTooltip } from "./BandTooltip"
import type { Artist } from "../types/server/class/Artist"
import { ArtistTooltip } from "./ArtistTooltip"

interface MiniPlayerProps {
    band?: Band
    artist?: Artist
}

export const MiniPlayer: React.FC<MiniPlayerProps> = (props) => {
    const player = props.artist || props.band
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <Tooltip
                title={props.band ? <BandTooltip band={props.band} /> : props.artist ? <ArtistTooltip artist={props.artist} /> : null}
                open={showTooltip}
                placement="auto"
                slotProps={{ tooltip: { sx: {} } }}
            >
                <Button
                    onClick={() => setShowTooltip(true)}
                    color="inherit"
                    sx={{ borderBottom: "1px solid", borderRadius: 0, gap: 1, justifyContent: "space-between", alignItems: 'flex-end' }}
                    fullWidth
                    size="small"
                >
                    <Box sx={{ gap: 1, alignItems: "center" }}>
                        <Avatar
                            variant={props.artist ? "circular" : "rounded"}
                            src={player?.image || undefined}
                            sx={{ width: props.artist ? 30 : 50, height: 30, marginLeft : props.artist ? 1.2 : undefined }}
                        />
                        {player?.name}
                    </Box>

                    <Typography variant="caption" fontSize={8}>Ver mais</Typography>
                </Button>
            </Tooltip>
        </ClickAwayListener>
    )
}
