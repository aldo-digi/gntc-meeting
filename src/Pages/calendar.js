import {Scheduler} from "@aldabil/react-scheduler";
import {Form} from "../Components/form";
import {Button, Container} from "@mui/material";
import {SideBar} from "../Components/sideBar";
import {useEffect, useState} from "react";

import { useClient } from '../Components/ClientContext';
import axios from "axios";

export const Calendar = () => {
    const [open, setOpen] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [meetingsBackup, setMeetingsBackup] = useState([]);

    const getMeetings = async () => {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/meetings/get`);
        const data = await response.json();
        console.log(data);
        setMeetings(data.map((meeting) => {
            return {
                _id: meeting._id,
                event_id: meeting.event_id,
                title: meeting.client,
                start: new Date(meeting.start),
                end: new Date(meeting.end),
                color: meeting.color,
            }
        }));
        setMeetingsBackup(data.map((meeting) => {
            return {
                _id: meeting._id,
                event_id: meeting.event_id,
                title: meeting.client,
                start: new Date(meeting.start),
                end: new Date(meeting.end),
                color: meeting.color,
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

    const deleteMeeting = async (id) => {
        console.log(meetings,meetingsBackup)
        const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/meetings/delete/${id}`);
        if(response.status === 200){
            console.log(meetings)
            setMeetings(meetingsBackup.filter((meeting) => meeting.event_id !== id));
            setMeetingsBackup(meetingsBackup.filter((meeting) => meeting.event_id !== id));
        }
        window.location.reload();

    }

    useEffect(()=>{
        getMeetings();
    },[])

    useEffect(()=>{
        console.log(meetings)
    })


    return (
        <>

            <Button onClick={()=>setOpen(true)}>Open drawer</Button>
            <SideBar open={open} setOpen={setOpen}/>
        <Container>
            <h1>agjenda ditore e takimeve</h1>
            <Scheduler
                customEditor={(scheduler) => <Form scheduler={scheduler} updateMeeting={updateMeeting}/> }
                view="week"
                events={meetings}
                // viewerExtraComponent={(fields, event) => {
                //     return (
                //         <div>
                //             <p>Useful to render custom fields...</p>
                //             <p>Description: {event.title || "Nothing..."}</p>
                //         </div>
                //     );
                // }}
                onEventDrop={async (newDate, newEvent, oldEvent) => {
                    await updateMeeting({
                        _id: newEvent._id,
                        client: newEvent.title,
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
                        addTitle: "Shto një Mbledhje",
                        editTitle: "Edito Mbledhjen",
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
            </>
    )
}
