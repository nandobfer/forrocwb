import { useContext } from "react"
import UserContext from "../contexts/UserContext"
import { jwtDecode } from "jwt-decode"
import type { User } from "../types/server/class/User"

export const useUser = () => {
    const context = useContext(UserContext)

    const logout = () => {
        context.setUser(null)
        context.setAccessToken(null)
    }

    const handleLogin = (token: string) => {
        const decryped = jwtDecode<{ user: User; exp: number; iat: number }>(token)
        context.setUser(decryped.user)
        context.setAccessToken({ ...decryped, value: token })
    }

    return { ...context, logout,  handleLogin }
}
