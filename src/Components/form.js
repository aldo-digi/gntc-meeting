import React, { useState, useEffect } from "react";
import { Autocomplete, Button, FormControl, InputLabel, TextField } from "@mui/material";
import { useClient } from "./ClientContext";
import ShortUniqueId from "short-unique-id";
import randomColor from 'randomcolor';
import axios from "axios";
import {toast} from "react-toastify";

export const Form = ({ scheduler, updateMeeting }) => {
    const [users, setUsers] = useState([]);

    const getClients = async () => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clients/get`);
        setUsers(response.data);
    }

    useEffect(() => {
        getClients();
    }, []);

    const event = scheduler.edited;
    const [selectedEmails, setSelectedEmails] = useState(event?event.clients:[]);

    const [formData, setFormData] = useState({
        emails: event? event.clients : [],
        title:event ? event.title : '',
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

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meetings/add`, {
            event_id: newMeeting.event_id,
            start: newMeeting.start,
            end: newMeeting.end,
            clients: newMeeting.clients,
            color: newMeeting.color,
            title:newMeeting.title,
            createdBy: newMeeting.createdBy
        });
    }

    const getCompany = async (email) => {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/clients/get/${email}`);
        return response.data.company;
    }

    // const

    return (
        <form style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20,
            padding: 20,
        }}>
            <TextField
                label="Përshkrimi"
                name="title"
                value={formData.title}
                onChange={handleChange}
                />
            <FormControl>
                <InputLabel id='selectName'></InputLabel>
                <Autocomplete
                    sx={{
                        zIndex: 1000,
                        minWidth: 400,
                    }}
                    value={selectedEmails}
                    multiple
                    disablePortal
                    id="emails"
                    onChange={(event, newValue) => setSelectedEmails(newValue)}
                    options={users.map((option) => option.email)}
                    renderInput={(params) => <TextField {...params} label="E-mails" />}
                />
            </FormControl>
            <TextField
                type="date"
                name="date"
                inputProps={{
                    min: new Date().toDateString(),
                }}
                value={formData.date}
                onChange={handleChange}
            />
            <TextField
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
                    const { randomUUID } = new ShortUniqueId({ length: 10 });
                    const company = await getCompany(selectedEmails[0]);
                    let color = '';
                        color = '#FEDD1F'
                    const start = formData.start ? new Date(formData.start) : null;
                    const end = new Date(start);
                    end.setHours(end.getHours() + 1);


                    const newEvent = {
                        event_id: randomUUID(),
                        start: start,
                        end: end,
                        title: formData.title,
                        clients: selectedEmails,
                        color: color,
                        approve:'none',
                        company: company,
                        createdBy: localStorage.getItem('gntcuser')
                    };


                    if(new Date(newEvent.start) < new Date()) {
                        toast.error('Ju nuk mund të krijojnë një takim përpara datës së sotme');
                        return;
                    }

                    if (!event) {
                        await addMeeting(newEvent)
                    } else {
                        await updateMeeting({
                            ...newEvent,
                            _id: event._id
                        })
                    }


                    scheduler.onConfirm(newEvent, event ? "edit" : "create");
                    scheduler.close();
                    window.location.reload();
                }}>Ruaj</Button>
            </div>

        </form>
    )
};
