import React, { useState } from "react"
import { Avatar, Box, Button, ClickAwayListener, IconButton, Paper, Tooltip, Typography } from "@mui/material"
import type { Band } from "../types/server/class/Band"
import { Reply, Visibility } from "@mui/icons-material"
import { BandTooltip } from "./BandTooltip"

interface MiniBandProps {
    band: Band
}

export const MiniBand: React.FC<MiniBandProps> = ({ band }) => {
    const [showTooltip, setShowTooltip] = useState(false)

    return (
        <ClickAwayListener onClickAway={() => setShowTooltip(false)}>
            <Tooltip
                title={<BandTooltip band={band} />}
                open={showTooltip}
                placement="auto"
                slotProps={{ tooltip: { sx: {} } }}
            >
                <Box sx={{ width: 1, gap: 1, alignItems: "center" }} onClick={() => setShowTooltip(true)}>
                    <Avatar variant="rounded" src={band.image || undefined} sx={{ width: 100, height: 60 }} />

                    <Box sx={{ flexDirection: "column" }}>
                        <Typography variant="subtitle2">{band.name}</Typography>

                        <Button
                            size="small"
                            color="primary"
                            onClick={() => setShowTooltip(true)}
                            sx={{ borderBottom: "1px solid", borderRadius: 0, marginRight: "auto" }}
                        >
                            Ver banda
                        </Button>
                    </Box>
                </Box>
            </Tooltip>
        </ClickAwayListener>
    )
}
