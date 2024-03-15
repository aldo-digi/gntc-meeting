import logo from './logo.svg';
import './App.css';
import {Scheduler} from "@aldabil/react-scheduler";
import {Button} from "@mui/material";
import {useState} from "react";
import {SideBar} from "./Components/sideBar";
import {Calendar} from "./Pages/calendar";
import Staff from "./Pages/staff";
import Login from "./Pages/login";
import {createBrowserRouter, RouterProvider, useNavigate} from "react-router-dom";

import { ClientProvider } from './Components/ClientContext';

function App() {

    const router = createBrowserRouter([
        {
            path: '/',
            element: <Calendar />
        },
        {
            path: '/kalendari',
            element: <Calendar />
        },
        {
            path: '/clients',
            element: <Staff />
        },
        {
            path: '/login',
            element: <Login />
        }
    ])

    return (
        <ClientProvider> {/* Wrap your entire application with the ClientProvider */}
            <>
            <RouterProvider router={router}></RouterProvider>
            </>
        </ClientProvider>
    );
}

export default App;
