import {Scheduler} from "@aldabil/react-scheduler";
import {Form} from "../Components/form";
import {Button, Container} from "@mui/material";
import {SideBar} from "../Components/sideBar";
import {useState} from "react";

export const Calendar = () => {
    const [open, setOpen] = useState(false);

    return (
        <>

            <Button onClick={()=>setOpen(true)}>Open drawer</Button>
            <SideBar open={open} setOpen={setOpen}/>
        <Container>
            <h1>Gorenje Calendar</h1>
            <Scheduler
                customEditor={(scheduler) => <Form scheduler={scheduler}/> }
                view="week"
                events={[
                    {
                        event_id: 1,
                        title: "Event 1",
                        start: new Date("2024/5/2 09:30"),
                        end: new Date("2024/5/2 10:30"),
                    },
                    {
                        event_id: 2,
                        title: "Event 2",
                        start: new Date("2024/5/4 10:00"),
                        end: new Date("2024/5/4 11:00"),
                    },
                ]}
                viewerExtraComponent={(fields, event) => {
                    return (
                        <div>
                            <p>Useful to render custom fields...</p>
                            <p>Description: {event.title || "Nothing..."}</p>
                        </div>
                    );
                }}
                onEventDrop={(newDate,newEvent,oldEvent)=>console.log(newDate,newEvent,oldEvent)}
            />
        </Container>
            </>
    )
}