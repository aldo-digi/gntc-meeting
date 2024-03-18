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

    const getMeetings = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/get`);
        const data = await response.json();
        setMeetings(data.map((meeting) => {
            return {
                _id: meeting._id,
                title: meeting.title,
                event_id: meeting.event_id,
                clients: meeting.clients,
                start: new Date(meeting.start),
                end: new Date(meeting.end),
                color: meeting.approve==='none'?meeting.color:meeting.approve==='true'?'green':'red',
                approve: meeting.approve
            }
        }));
        setMeetingsBackup(data.map((meeting) => {
            return {
                _id: meeting._id,
                event_id: meeting.event_id,
                title: meeting.title,
                clients: meeting.clients,
                start: new Date(meeting.start),
                end: new Date(meeting.end),
                color: meeting.approve==='none'?meeting.color:meeting.approve==='true'?'green':'red',
                approve: meeting.approve
            }
        }));
    }

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
                    end: newMeeting.end
                }
            }
            return meeting;
        }))
        setMeetingsBackup(meetingsBackup.map((meeting) => {
            if (meeting._id === newMeeting._id) {
                return {
                    ...meeting,
                    start: newMeeting.start,
                    end: newMeeting.end
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

    useEffect(() => {
        console.log(meetings)
    })


    return (
        <div style={!isMobile ? {
            marginLeft: 250,
            transition: 'margin-left 0.5s',
            padding: '20px',
        } : {}}>
            {isMobile && <IconButton
                onClick={() => setOpen(true)}
                style={{}}
            >
                <MenuIcon/>
            </IconButton>}
            <SideBar open={open} setOpen={setOpen}/>
            <Container>
                <h1>Agjenda Ditore e Takimeve</h1>
                <Scheduler
                    customEditor={(scheduler) => <Form scheduler={scheduler} updateMeeting={updateMeeting}/>}
                    view="week"
                    events={meetings}
                    viewerExtraComponent={(fields, event) => {
                        return (
                            <div>
                                <h3>Detajet e Takimit</h3>
                                <Button disabled={event.approve=='true'} onClick={() => {
                                    approveMeeting(event._id)
                                }}
                                        style={event.approve!='true'?{backgroundColor: 'green', color: 'white', margin: 5}:{
                                            backgroundColor: 'gray', color: 'white', margin: 5
                                        }}>Prezent</Button>
                                <Button disabled={event.approve=='false'} onClick={() => disApproveMeeting(event._id)}
                                        style={event.approve!='false'?{backgroundColor: 'red', color: 'white', margin: 5}:{
                                            backgroundColor: 'gray', color: 'white', margin: 5
                                        }}>Jo Prezent</Button>
                                <p><strong>Përshkrimi:</strong> {event.title}</p>
                                <p><strong>Kompania:</strong> {event.title}</p>
                                <p><strong>Fillo:</strong> {event.start.toLocaleString()}</p>
                                {
                                    event.clients.map((client, index) => {
                                            return <p key={index}><strong>Pjesmarësit:</strong> {client}</p>
                                        }
                                    )
                                }
                            </div>
                        );
                    }}
                    onEventDrop={async (newDate, newEvent, oldEvent) => {
                        await updateMeeting({
                            _id: newEvent._id,
                            clients: newEvent.clients,
                            start: newEvent.start,
                            end: newEvent.end,
                            color: newEvent.color,
                            event_id: newEvent.event_id,
                        });
                    }}
                    onDelete={async (event) => {
                        await deleteMeeting(event);
                    }}
                    translations={{
                        navigation: {
                            month: "Muaji",
                            week: "Java",
                            day: "Dita",
                            today: "Sot",
                            agenda: "Agjenda"
                        },
                        form: {
                            addTitle: "Shto një Takim",
                            editTitle: "Edito Takimin",
                            confirm: "Konfirmo",
                            delete: "Fshij",
                            cancel: "Anulo"
                        },
                        event: {
                            title: "Titulli",
                            start: "Fillo",
                            end: "Përfundo",
                            allDay: "Gjithë ditën"
                        },
                        validation: {
                            required: "Kërkohet",
                            invalidEmail: "Email i pavlefshëm",
                            onlyNumbers: "Vetëm numrat lejohen",
                            min: "Minimumi {{min}} i shkronjav",
                            max: "Maksimumi {{max}} i shkronjav"
                        },
                        moreEvents: "Më shumë...",
                        noDataToDisplay: "Nuk ka të dhëna për t'u shfaqur",
                        loading: "Loading..."
                    }}
                />
            </Container>
        </div>
    )
}
