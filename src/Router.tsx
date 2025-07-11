import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { Home } from './pages/Home/Home'

interface RouterProps {
    
}

export const Router:React.FC<RouterProps> = (props) => {
    
    return (
        <Routes>
            <Route index path='/' element={<Home />} />
        </Routes>
    )
}