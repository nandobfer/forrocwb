import React, { useContext, useEffect, useState } from "react"
import {
    Autocomplete,
    Avatar,
    Box,
    Button,
    Checkbox,
    Chip,
    CircularProgress,
    Dialog,
    IconButton,
    MenuItem,
    Skeleton,
    TextField,
    Typography,
} from "@mui/material"
import { Title } from "../../components/Title"
import { AddPhotoAlternate, BrokenImage, Close, Edit, Groups } from "@mui/icons-material"
import { useFormModal } from "../../hooks/useFormModal"
import { useFormik } from "formik"
import { useUser } from "../../hooks/useUser"
import { useFileDialog, useMediaQuery } from "@mantine/hooks"
import type { EventForm } from "../../types/server/class/Event"
import { useQuery } from "@tanstack/react-query"
import { Artist } from "../../types/server/class/Artist"
import { getWeekNumber } from "../../tools/getWeekNumber"
import type { Band } from "../../types/server/class/Band"
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker"
import dayjs from "dayjs"

interface EventFormModalProps {}

const endpoint = "/event"

export const EventFormModal: React.FC<EventFormModalProps> = (props) => {
    const [loading, setLoading] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)

    const isMobile = useMediaQuery("(orientation: portrait)")
    const context = useFormModal()

    const { data: artists, isFetching: loadingArtists } = useQuery<Artist[]>({
        initialData: [],
        queryKey: ["artistsData"],
        queryFn: async () => (await api.get("/artist")).data,
    })
    const { data: bands, isFetching: loadingBands } = useQuery<Band[]>({
        initialData: [],
        queryKey: ["bandsData"],
        queryFn: async () => (await api.get("/band")).data,
    })
    const { adminApi: api } = useUser()

    const handleImageChange = async (files: FileList | null) => {
        if (files && context.event) {
            setImageLoading(true)
            try {
                const formData = new FormData()
                formData.append("image", files[0])
                const response = await api.patch(endpoint, formData, { params: { event_id: context.event.id } })
                context.setEvent(response.data)
            } catch (error) {
                console.log(error)
            } finally {
                setImageLoading(false)
            }
        }
    }
    const fileDialog = useFileDialog({ accept: "image/*", multiple: false, onChange: handleImageChange })

    const formik = useFormik<EventForm>({
        initialValues: context.event
            ? {
                  title: context.event.title,
                  description: context.event.description,
                  datetime: context.event.datetime,
                  location: context.event.location,
                  week: context.event.week,
                  price: context.event.price,
                  ticketUrl: context.event.ticketUrl,
                  artists: context.event.artists || [],
                  bands: context.event.bands || [],
                  image: context.event.image || undefined,
              }
            : {
                  title: "",
                  description: "",
                  datetime: new Date().getTime().toString(),
                  location: { cep: "", complement: "", district: "", number: "", street: "" },
                  artists: [],
                  bands: [],
                  price: 0,
                  ticketUrl: "",
                  week: getWeekNumber(new Date().getTime()),
              },
        async onSubmit(values, formikHelpers) {
            if (loading) return

            try {
                setLoading(true)

                const response = context.event
                    ? await api.patch(endpoint, values, { params: { event_id: context.event.id } })
                    : await api.post(endpoint, values)

                if (context.event) {
                    context.close()
                } else {
                    context.setEvent(response.data)
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
            open={context.isOpen === "event"}
            onClose={context.close}
            slotProps={{ paper: { sx: { maxWidth: "100vw", display: "flex", padding: 2, flexDirection: "column", gap: 2 }, elevation: undefined } }}
        >
            <Title
                name={context.event?.title ? `Editar ${context.event.title}` : "Cadastrar evento"}
                right={
                    <IconButton onClick={context.close}>
                        <Close />
                    </IconButton>
                }
            />

            <Box sx={{ flexDirection: "column", gap: 2, maxHeight: "60vh", overflowY: "auto", margin: -2, padding: 2 }}>
                <form onSubmit={formik.handleSubmit}>
                    {context.event && (
                        <Button onClick={() => fileDialog.open()} sx={{ width: 1, alignSelf: "center", position: "relative" }}>
                            {imageLoading ? (
                                <Skeleton variant="rounded" animation="wave" sx={{ flex: 1, height: "auto", aspectRatio: 2 }} />
                            ) : (
                                <Avatar
                                    variant="rounded"
                                    src={context.event.image || undefined}
                                    sx={{ flex: 1, height: "auto", aspectRatio: 2, bgcolor: "background.default", color: "primary.main" }}
                                >
                                    <AddPhotoAlternate sx={{ width: 1, height: 1 }} />
                                </Avatar>
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
                        </Button>
                    )}
                    <DateTimePicker
                        label="Data e hora"
                        slotProps={{ textField: { size: "small", required: true } }}
                        value={dayjs(Number(formik.values.datetime))}
                        onChange={(value) => formik.setFieldValue('datetime', value?.toDate().getTime().toString())}
                    />

                    <TextField label="Nome" value={formik.values.title} name="title" onChange={formik.handleChange} size="small" required />

                    {context.event && (
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
                            <Autocomplete
                                options={bands}
                                renderInput={({ inputProps, ...params }) => (
                                    <TextField {...params} label="Bandas" size="small" inputProps={{ ...inputProps, readOnly: true }} />
                                )}
                                getOptionKey={(option) => option.id}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                multiple
                                value={formik.values.bands || []}
                                onChange={(_, value) => formik.setFieldValue("bands", value)}
                                ChipProps={{ size: "small", color: "primary" }}
                                disableCloseOnSelect
                                renderOption={(props, option, { selected }) => {
                                    const { key, ...optionProps } = props
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                                            {option.name}
                                        </li>
                                    )
                                }}
                            />
                            <Autocomplete
                                options={artists}
                                renderInput={({ inputProps, ...params }) => (
                                    <TextField {...params} label="Artistas" size="small" inputProps={{ ...inputProps, readOnly: true }} />
                                )}
                                getOptionKey={(option) => option.id}
                                getOptionLabel={(option) => option.name}
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                multiple
                                value={formik.values.artists || []}
                                onChange={(_, value) => formik.setFieldValue("artists", value)}
                                ChipProps={{ size: "small", color: "primary" }}
                                disableCloseOnSelect
                                renderOption={(props, option, { selected }) => {
                                    const { key, ...optionProps } = props
                                    return (
                                        <li key={key} {...optionProps}>
                                            <Checkbox style={{ marginRight: 8 }} checked={selected} />
                                            {option.name}
                                        </li>
                                    )
                                }}
                            />
                        </>
                    )}

                    <Button variant="contained" type="submit" sx={{ alignSelf: "flex-end" }}>
                        {loading ? <CircularProgress /> : context.event ? "Salvar" : "Continuar"}
                    </Button>
                </form>
            </Box>
        </Dialog>
    )
}
