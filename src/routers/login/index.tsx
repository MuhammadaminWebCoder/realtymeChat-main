import { PATH } from "@/constants/usePath"
import Login from "@/pages/login"
import { Route, Routes } from "react-router-dom"

export const LogInRouter = () =><Routes><Route path={PATH.logIn} element={<Login/>} /></Routes>
