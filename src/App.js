import './App.css';
import {Calendar} from "./Pages/calendar";
import Staff from "./Pages/staff";
import Login from "./Pages/login";
import {createBrowserRouter, RouterProvider, useNavigate} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClientProvider } from './Components/ClientContext';
import {History} from "./Pages/history";

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
        },
        {
            path: '/history',
            element: <History />
        }
    ])

    return (
        <ClientProvider> {/* Wrap your entire application with the ClientProvider */}
            <>
                <ToastContainer/>
            <RouterProvider router={router}></RouterProvider>
            </>
        </ClientProvider>
    );
}

export default App;
