import { Route, Routes } from "react-router-dom"
import { PATH } from "@/constants/usePath"
import Home from "@/pages/dashboard/Home/Home"

export const DashboardRouter = () =>
      <Routes>
        {/* Home sahifasi: foydalanuvchilar ro'yxati */}
        <Route path={PATH.home} element={<Home />} />

        {/* Chat sahifasi: tanlangan user bilan chat */}
        <Route path={PATH.homeChat} element={<Home />} />
      </Routes>
