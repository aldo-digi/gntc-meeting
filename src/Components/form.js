import {Autocomplete, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import {useState, useEffect} from "react";
import ShortUniqueId from "short-unique-id";
import { useClient } from "./ClientContext";

export const Form = ({scheduler}) => {

    const { clients, updateClients } = useClient();
    const [users, setUsers] = useState([]);
    useEffect(() => {
        setUsers(clients);
        console.log(clients);
    }, []);

    const event = scheduler.edited;

    console.log(scheduler.state.start.value, scheduler.state.end.value);
    const [formData, setFormData] = useState({
        email: event?.title || '',
        start: scheduler.state.start.value ||  '',
        end: scheduler.state.end.value || '',
    });

    const handleChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value});
        console.log(formData);
    }

    const date = new Date(scheduler.state.start.value );

// Adjusting time for the local timezone
    const localTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    const localDate = new Date(localTime);

// Formatting the date for input value
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

    // const users = [
    //     {email: 'hello@mail.com'},
    //     {email: 'hello1@mail.com'},
    //     {email: 'hello2@mail.com'},
    // ]

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
                    }}
                    value={formData.email}
                    disablePortal
                    id="email"
                    onInputChange={(e,newVal)=>setFormData({
                        ...formData,
                        email:newVal
                    })}
                    options={users.map((option) => option.email)}
                    renderInput={(params) => <TextField {...params} label="Email"  />}
                />
            </FormControl>
            <TextField
                label="Date"
                type="date"
                name="start"
                value={formData.start}
                onChange={handleChange}
            />
            <TextField
                label="Time"
                type="time"
                name="end"
                value={formData.end}
                onChange={handleChange}
            />

            <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 20,
            }}>
                <Button variant="contained" color="error" onClick={scheduler.close}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={() => {
                    const { randomUUID } = new ShortUniqueId({ length: 10 });
                    const newEvent = {
                        event_id:randomUUID(),
                        start: formData.start,
                        end: formData.end,
                        title: formData.email,
                    }
                    scheduler.onConfirm(newEvent,event?"edit":"create");
                    scheduler.close();
                }
                }>Save</Button>
            </div>

        </form>
    )
}