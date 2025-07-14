import { createContext, useState } from "react"
import React from "react"
import type { AccessToken, User } from "../types/server/class/User"
import { useLocalStorage } from "@mantine/hooks"

interface UserContextValue {
    user: User| null
    setUser: React.Dispatch<React.SetStateAction<User | null>>

    accessToken: AccessToken | null
    setAccessToken: React.Dispatch<React.SetStateAction<AccessToken | null>>
}

interface UserProviderProps {
    children: React.ReactNode
}

const UserContext = createContext<UserContextValue>({} as UserContextValue)

export default UserContext

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [user, setUser] = useLocalStorage<User | null>({ key: "forrocwb:user", defaultValue: null })
    const [accessToken, setAccessToken] = useState<AccessToken | null>(null)

    return <UserContext.Provider value={{ user, setUser, accessToken, setAccessToken }}>{children}</UserContext.Provider>
}
