import { Route, Routes } from "react-router-dom"
import { PATH } from "@/constants/usePath"
import Home from "@/pages/dashboard/Home/Home"

export const DashboardRouter = () => <Routes><Route path={PATH.home} element={<Home/>} /></Routes>
