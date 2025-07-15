import React, { useContext, useEffect, useState } from "react"
import { Avatar, Box, Button, CircularProgress, Dialog, IconButton, Skeleton, TextField, Typography } from "@mui/material"
import { Title } from "../../components/Title"
import { BrokenImage, Close, Edit } from "@mui/icons-material"
import { useFormModal } from "../../hooks/useFormModal"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import { useFileDialog } from "@mantine/hooks"
import type { BandForm } from "../../types/server/class/Band"

interface BandFormModalProps {}

const endpoint = "/band"

export const BandFormModal: React.FC<BandFormModalProps> = (props) => {
    const [loading, setLoading] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)

    const context = useFormModal()
    const { adminApi: api } = useUser()

    const handleImageChange = async (files: FileList | null) => {
        if (files && context.band) {
            setImageLoading(true)
            try {
                const formData = new FormData()
                formData.append("image", files[0])
                const response = await api.patch(endpoint, formData, { params: { band_id: context.band.id } })
                context.setBand(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setImageLoading(false)
            }
        }
    }
    const fileDialog = useFileDialog({ accept: "image/*", multiple: false, onChange: handleImageChange })

    const formik = useFormik<BandForm>({
        initialValues: context.band
            ? {
                  name: context.band.name,
                  description: context.band.description || undefined,
                  image: context.band.image || undefined,
                  instagram: context.band.instagram || undefined,
                  artists: context.band.artists || [],
              }
            : { name: "" },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            try {
                setLoading(true)

                const response = context.band
                    ? await api.patch(endpoint, values, { params: { band_id: context.band.id } })
                    : await api.post(endpoint, values)

                if (context.band) {
                    context.close()
                } else {
                    context.setBand(response.data)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        },
        enableReinitialize: true,
    })

    useEffect(() => {
        return () => {
            formik.resetForm()
            fileDialog.reset()
        }
    }, [context.isOpen])

    return (
        <Dialog
            open={context.isOpen === "band"}
            onClose={context.close}
            slotProps={{ paper: { sx: { maxWidth: "100vw", display: "flex", padding: 2, flexDirection: "column", gap: 2 }, elevation: undefined } }}
        >
            <Title
                name={context.band?.name ? `Editar ${context.band.name}` : "Cadastrar banda"}
                right={
                    <IconButton onClick={context.close}>
                        <Close />
                    </IconButton>
                }
            />

            <Box sx={{ flexDirection: "column", gap: 2 }}>
                <form onSubmit={formik.handleSubmit}>
                    {context.band && (
                        <IconButton onClick={() => fileDialog.open()} sx={{ width: "min-content", alignSelf: "center", position: "relative" }}>
                            {imageLoading ? (
                                <Skeleton variant="rounded" width={150} height={150} animation="wave" sx={{ borderRadius: "100%" }} />
                            ) : (
                                <Avatar src={context.band.image || undefined} sx={{ width: 150, aspectRatio: 1, height: "auto" }}></Avatar>
                            )}
                            <Edit
                                sx={{
                                    position: "absolute",
                                    top: 10,
                                    right: 10,
                                    color: "background.default",
                                    bgcolor: "primary.main",
                                    borderRadius: "100%",
                                    width: 30,
                                    height: "auto",
                                    padding: 0.5,
                                }}
                            />
                        </IconButton>
                    )}
                    <TextField label="Nome" value={formik.values.name} name="name" onChange={formik.handleChange} size="small" />

                    {context.band && (
                        <>
                            <TextField
                                label="Descrição"
                                multiline
                                value={formik.values.description}
                                name="description"
                                onChange={formik.handleChange}
                                size="small"
                                minRows={3}
                                maxRows={5}
                            />
                            <TextField
                                label="Instagram"
                                value={formik.values.instagram}
                                name="instagram"
                                onChange={formik.handleChange}
                                size="small"
                                placeholder="Insira a URL do perfil"
                                type="url"
                            />
                        </>
                    )}

                    <Button variant="contained" type="submit" sx={{ alignSelf: "flex-end" }}>
                        {loading ? <CircularProgress /> : context.band ? "Salvar" : "Continuar"}
                    </Button>
                </form>
            </Box>
        </Dialog>
    )
}
