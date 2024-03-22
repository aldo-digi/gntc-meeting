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
    const [users, setUsers] = useState([]);

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
                end: new Date(meeting.end),
                color: meeting.color,
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
                end: new Date(meeting.end),
                color: meeting.color,
                approve: meeting.approve,
                createdBy: meeting.createdBy,
                editedBy: meeting.editedBy
            }
        }));
    }

    const getCompanies = async () => {
        for(var i=0; i<meetings.length; i++){
            const user = users.find((user) => user.email === meetings[i].clients[0])
            const names = []
            for(var j=0; j<meetings[i].clients.length; j++){
                const user = users.find((user) => user.email === meetings[i].clients[j])
                names.push(user.name)
            }
            const company =  user.company;
            meetingsBackup[i].company = company;
            meetings[i].company = company;
            meetings[i].names = names;
            meetingsBackup[i].names = names;
        }
        setMeetings([...meetings]);
        setMeetingsBackup([...meetingsBackup]);
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
                toast.warn(`Kanë mbetur vetëm 10 minuta për takimin: ${meeting.title}`, { variant: "info" });
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


    const getClients = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clients/get`);
        setUsers(response.data);
    }

    useEffect(() => {
        getClients();
    }, []);

    useEffect(() => {
        if(users.length>0 && meetings.length>0)
           if(meetings[0].company===undefined)
                getCompanies();
    },[users,meetings])

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
                    hourFormat="24"
                    events={meetings}
                    week={{
                        startHour: 7,
                        endHour: 21,
                        step: 60,
                    }}
                    eventRenderer={({event,...props}) => {
                        return (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: event.color,
                                borderRadius: 5,
                                color: event.color === '#ADD8E6' ? 'black' : 'black',
                            }} {...props}>
                                <p style={{
                                    backgroundColor: event.approve==='none'?'gray':event.approve==='true'?'green':'red',
                                    fontSize: 12,
                                    margin:0,
                                    padding:2,
                                }}>{event.start.toLocaleTimeString()}</p>
                                <p style={{
                                }}>{event.title}</p>
                            </div>
                        )
                    }}
                    viewerExtraComponent={(fields, event) => {
                        return (
                            <div>
                                <h3>Detajet e Takimit</h3>
                                <Button disabled={event.approve == 'true'} onClick={() => {
                                    approveMeeting(event._id)
                                }}
                                        style={event.approve != 'true' ? {
                                            backgroundColor: 'green',
                                            color: 'white',
                                            margin: 5
                                        } : {
                                            backgroundColor: 'gray', color: 'white', margin: 5
                                        }}>Prezent</Button>
                                <Button disabled={event.approve == 'false'} onClick={() => disApproveMeeting(event._id)}
                                        style={event.approve != 'false' ? {
                                            backgroundColor: 'red',
                                            color: 'white',
                                            margin: 5
                                        } : {
                                            backgroundColor: 'gray', color: 'white', margin: 5
                                        }}>Jo Prezent</Button>
                                <p><strong>Përshkrimi:</strong> {event.title}</p>
                                <p><strong>Kompania:</strong> {event.company}</p>
                                <p><strong>Fillo:</strong> {event.start.toLocaleDateString('en-GB')}</p>
                                <p><strong>Pjesmarrësit:</strong> {event.names ? event?.names?.join(','): ""}</p>
                                <p><strong>Krijuar nga:</strong> {event.createdBy}</p>
                                {event.editedBy && <p><strong>Edituar nga:</strong> {event.editedBy}</p>}
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
                            title: newEvent.title,
                            editedBy: localStorage.getItem('gntcuser')
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
