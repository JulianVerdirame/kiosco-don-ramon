import { Outlet } from "react-router-dom"
import { Sidebar } from "../components/common/Sidebar"
import './MainLayout.css'

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