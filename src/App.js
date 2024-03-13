import logo from './logo.svg';
import './App.css';
import {Scheduler} from "@aldabil/react-scheduler";
import {Button} from "@mui/material";
import {useState} from "react";
import {SideBar} from "./Components/sideBar";
import {Calendar} from "./Pages/calendar";
import Staff from "./Pages/staff";
import {createBrowserRouter, RouterProvider, useNavigate} from "react-router-dom";

function App() {

    const router = createBrowserRouter([
        {
            path: '/Kalendria',
            element: <Calendar />
        },
        {
            path: '/staff',
            element: <Staff />
        }
    ])

    return (
        <>
            <RouterProvider router={router}>
            </RouterProvider>
        </>
    );
}

export default App;
