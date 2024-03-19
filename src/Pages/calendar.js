import {Scheduler} from "@aldabil/react-scheduler";
import {Form} from "../Components/form";
import {Button, Container, IconButton, useMediaQuery, useTheme} from "@mui/material";
import {SideBar} from "../Components/sideBar";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import BlobIcon from '../Assets/blob.png'
import {useClient} from '../Components/ClientContext';
import axios from "axios";
import MenuIcon from "@mui/icons-material/Menu";
import {toast} from "react-toastify";

export const Calendar = () => {

    const navigate = useNavigate()

    const checkUserAuthentication = () => {
        const user = localStorage.getItem('gntcuser');
        if (!user) {
            navigate('/login');
        }
    };
    useEffect(() => {
        checkUserAuthentication();
    }, []);

    const [open, setOpen] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [meetingsBackup, setMeetingsBackup] = useState([]);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [companyCheck, setCompanyCheck] = useState(null);

    const getMeetings = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/get`);
        const data = await response.json();

        const meetings = []
        for (const meeting of data) {
            meetings.push({
                _id: meeting._id,
                event_id: meeting.event_id,
                title: meeting.title,
                clients: meeting.clients,
                start: new Date(meeting.start),
                color: meeting.approve==='none'?meeting.color:meeting.approve==='true'?'green':'red',
                approve: meeting.approve,
                createdBy: meeting.createdBy,
                editedBy: meeting.editedBy
            })
        }
        setMeetings(meetings);

        setMeetingsBackup(data.map((meeting) => {
            return {
                _id: meeting._id,
                event_id: meeting.event_id,
                title: meeting.title,
                clients: meeting.clients,
                start: new Date(meeting.start),
                color: meeting.approve==='none'?meeting.color:meeting.approve==='true'?'green':'red',
                approve: meeting.approve,
                createdBy: meeting.createdBy,
                editedBy: meeting.editedBy
            }
        }));

        setCompanyCheck(false)
    }

    const getCompanies = async () => {
        for(var i=0; i<meetings.length; i++){
            const company = await getCompany(meetings[i].clients[0]);
            meetingsBackup[i].company = company;
            meetings[i].company = company;
        }
        setMeetings(meetings);
        setMeetingsBackup(meetingsBackup);
        setCompanyCheck(true)
    }

    useEffect(() => {
        if (meetings.length > 0 && companyCheck === false) {
            getCompanies();
        }
    }, [companyCheck]);

    const updateMeeting = async (newMeeting) => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/update/${newMeeting._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMeeting)
        });
        const data = await response.json();
        setMeetings(meetingsBackup.map((meeting) => {
            if (meeting._id === newMeeting._id) {
                return {
                    ...meeting,
                    start: newMeeting.start,
                }
            }
            return meeting;
        }))
        setMeetingsBackup(meetingsBackup.map((meeting) => {
            if (meeting._id === newMeeting._id) {
                return {
                    ...meeting,
                    start: newMeeting.start,
                }
            }
            return meeting;
        }))
    }

    const approveMeeting = async (id) => {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/meetings/approve/${id}`);
        if (response.status === 200) {
            setMeetings(meetings.map((meeting) => {
                if (meeting.event_id === id) {
                    return {
                        ...meeting,
                        approve: 'true'
                    }
                }
                return meeting;
            }))
            setMeetingsBackup(meetingsBackup.map((meeting) => {
                if (meeting.event_id === id) {
                    return {
                        ...meeting,
                        approve: 'true'
                    }
                }
                return meeting;
            }))
        }
        document.location.reload();

    }

    const disApproveMeeting = async (id) => {
        const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/meetings/disapprove/${id}`);
        if (response.status === 200) {
            setMeetings(meetings.map((meeting) => {
                if (meeting.event_id === id) {
                    return {
                        ...meeting,
                        approve: 'false'
                    }
                }
                return meeting;
            }))
            setMeetingsBackup(meetingsBackup.map((meeting) => {
                if (meeting.event_id === id) {
                    return {
                        ...meeting,
                        approve: 'false'
                    }
                }
                return meeting;
            }))
        }
        document.location.reload();

    }

    const deleteMeeting = async (id) => {
        console.log(meetings, meetingsBackup)
        const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/meetings/delete/${id}`);
        if (response.status === 200) {
            console.log(meetings)
            setMeetings(meetingsBackup.filter((meeting) => meeting.event_id !== id));
            setMeetingsBackup(meetingsBackup.filter((meeting) => meeting.event_id !== id));
        }
        window.location.reload();

    }

    useEffect(() => {
        getMeetings();
    }, [])


    const checkTimeRemaining = () => {
        const currentTime = new Date();
        meetings.forEach((meeting) => {
            const timeDifference = meeting.start - currentTime;
            const minutesRemaining = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
            if (minutesRemaining === 10) {
                // Show a toast
                toast.warn(`Only 10 minutes remaining for the meeting: ${meeting.title}`, { variant: "info" });
            }
        });
    };

    useEffect(() => {
        // Check time remaining every minute
        const interval = setInterval(() => {
            checkTimeRemaining();
        }, 60000);

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []);

    const getCompany = async (email) => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clients/get/${email}`);
        return response.data.company;
    }


    return (
        <div style={!isMobile ? {
            marginLeft: 250,
            transition: 'margin-left 0.5s',
            padding: '20px',
        } : {}}>
            {isMobile && <IconButton
                onClick={() => setOpen
