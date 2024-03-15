import React, { useState, useEffect } from "react";
import { Autocomplete, Button, FormControl, InputLabel, TextField } from "@mui/material";
import { useClient } from "./ClientContext";
import ShortUniqueId from "short-unique-id";
import randomColor from 'randomcolor';
import axios from "axios";

export const Form = ({ scheduler,updateMeeting }) => {
    const [users, setUsers] = useState([]);

    const getClients = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clients/get`);
        setUsers(response.data);
    }

    useEffect(() => {
        getClients()
    }, []);


    const event = scheduler.edited;

    const [formData, setFormData] = useState({
        email: event?.title || '',
        start: scheduler.state.start.value || '',
        end: scheduler.state.end.value || '',
        date: event ? scheduler.state.start.value.toISOString().split('T')[0] : '',
        time: event ? scheduler.state.end.value.toISOString().split('T')[1].split('.')[0] : '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === "date" || name === "time") {
            setFormData(prevState => ({
                ...prevState,
                start: `${prevState.date}T${prevState.time}`
            }));
        }
    };

    const addMeeting = async (newMeeting) => {
        console.log(newMeeting)
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meetings/add`, {
            event_id: newMeeting.event_id,
            start: newMeeting.start,
            end: newMeeting.end,
            client: newMeeting.title,
            color: newMeeting.color,
        });
        console.log('here')
            console.log(response);
    }

    return (
        <form style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: 20,
        }}>
            <FormControl>
                <InputLabel id='selectName'></InputLabel>
                <Autocomplete
                    sx={{
                        zIndex: 1000,
                        minWidth: 400,
                    }}
                    value={formData.email}
                    disablePortal
                    id="email"
                    onInputChange={(e, newVal) => setFormData({ ...formData, email: newVal })}
                    options={users.map((option) => option.email)}
                    renderInput={(params) => <TextField {...params} label="E-mail" />}
                />
            </FormControl>
            <TextField
                label="Data"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
            />
            <TextField
                label="Koha"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
            />

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 20,
            }}>
                <Button variant="contained" color="error" onClick={scheduler.close}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={async () => {
                    const {randomUUID} = new ShortUniqueId({length: 10});
                    const color = randomColor({
                        luminosity: 'dark',
                    });
                    const start = formData.start ? new Date(formData.start) : null;
                    const end = new Date(start);
                    end.setHours(end.getHours() + 1);

                    const newEvent = {
                        event_id: randomUUID(),
                        start: start,
                        end: end,
                        title: formData.email,
                        color: color,
                    };

                    if (!event) {
                        await addMeeting(newEvent)
                    }else{
                        await updateMeeting({
                            ...newEvent,
                            client: newEvent.title,
                            _id: event._id
                        })
                    }
                    scheduler.onConfirm(newEvent, event ? "edit" : "create");
                    scheduler.close();
                }
                }>Ruaj</Button>
            </div>

        </form>
    )
};
