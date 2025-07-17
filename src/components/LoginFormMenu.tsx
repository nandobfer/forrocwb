import React from "react"
import { Box, Button, CircularProgress, TextField, Typography } from "@mui/material"
import { useFormik } from "formik"
import { api } from "../backend/api"
import { useMutation } from "@tanstack/react-query"
import { useUser } from "../hooks/useUser"
import * as yup from "yup"
import type { AxiosError } from "axios"
import type { LoginForm } from "../types/server/class/User"

interface LoginFormMenuProps {}

export const LoginFormMenu: React.FC<LoginFormMenuProps> = (props) => {
    const { handleLogin } = useUser()
    const { mutate, isPending } = useMutation({
        mutationFn: async (credentials: LoginForm) => await api.post<string>("/login", credentials).then((response) => response.data),
        onSuccess: (token) => {
            handleLogin(token)
        },
        onError: (error: AxiosError) => {
            if (error.response?.status === 401) {
                formik.setFieldError("password", "credenciais inválidas.")
            }
        },
    })

    const formik = useFormik<LoginForm>({
        initialValues: { login: "", password: "" },
        async onSubmit(values) {
            if (isPending) return
            mutate(values)
        },
        validationSchema: yup.object().shape({
            login: yup.string().email().required(),
            password: yup.string().required(),
        }),
        validateOnChange: false,
        validateOnBlur: true,
    })

    return (
        <Box
            sx={{ flexDirection: "column", padding: "0 5vw", gap: 1 }}
            onKeyDown={(ev) => {
                if (ev.key === "Tab") {
                    ev.stopPropagation()
                }
            }}
        >
            <Typography>Acessar como administrador</Typography>
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    label="E-mail"
                    value={formik.values.login}
                    name="login"
                    onChange={formik.handleChange}
                    type="email"
                    size="small"
                    variant="standard"
                    disabled={isPending}
                    required
                    error={!!formik.errors.login}
                    helperText={formik.errors.login}
                    autoComplete="off"
                />
                <TextField
                    label="Senha"
                    value={formik.values.password}
                    name="password"
                    onChange={formik.handleChange}
                    type="password"
                    size="small"
                    variant="standard"
                    disabled={isPending}
                    required
                    error={!!formik.errors.password}
                    helperText={formik.errors.password}
                    autoComplete="off"
                />
                <Button type="submit" sx={{}}>
                    {isPending ? <CircularProgress color="primary" /> : "Entrar"}
                </Button>
            </form>
        </Box>
    )
}
