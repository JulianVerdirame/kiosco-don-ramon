import { Outlet } from "react-router-dom"
import './MainLayout.css'
import { Sidebar } from "../components/Sidebar"

export const MainLayout = () => {
    return (
        <div className="main-layout">
            <Sidebar />
            <main className="main-layout__content">
                <Outlet />
            </main>
        </div>
    )
}