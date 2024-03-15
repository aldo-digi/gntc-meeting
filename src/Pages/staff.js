import {useState, useContext, useEffect} from 'react';
import {
    Container,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
    TextField,
    Button,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {SideBar} from "../Components/sideBar"; // Import axios for HTTP requests

import { useClient } from '../Components/ClientContext';



const Staff = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState('');
    const [editedIndex, setEditedIndex] = useState(null); // Track currently edited client index
    const { clients,setClients, updateClients, deleteClients } = useClient();


    const handleDeleteClient = (index) => {

        const response = axios.delete(`${process.env.REACT_APP_BACKEND_URL}/clients/delete/${clients[index]._id}`);

        // Create a copy of the clients array
        const remaianingClients = [...clients];
        // Remove the client at the specified index
        remaianingClients.splice(index, 1);
        console.log(remaianingClients)
        // Update the clients array in the context
        deleteClients(index);
    };

    // State for managing form dialog
    const [open, setOpen] = useState(false);
    const [openForm, setOpenForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        city: '',
        email: '',
        phoneNumber: '',
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFormOpen = () => {
        setOpenForm(true);
    };

    const handleFormClose = () => {
        setOpenForm(false);
        setFormData({
            name: '',
            company: '',
            city: '',
            email: '',
            phoneNumber: '',
        });
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleEditClient = (index) => {
        setEditedIndex(index); // Set the index of the client being edited
        setOpenForm(true); // Open the form dialog
        // Populate form data with the client being edited
        setFormData({
            ...clients[index],
        });
    };

    const handleFormSubmit = async () => {
        try {
            if(editedIndex !== null) {
                // Send PUT request to update client
                const clientId = clients[editedIndex]._id;
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/clients/update/${clientId}`, formData);
                const updatedClient = response.data;
                const updatedRows = [...clients];
                updatedRows[editedIndex] = updatedClient;
                setClients(updatedRows); // Update table with updated client
                setEditedIndex(null); // Reset editedIndex
                setFormData({
                    name: '',
                    company: '',
                    city: '',
                    email: '',
                    phoneNumber: '',
                });
                setOpenForm(false); // Close the form dialog
                return;
            }

            // Send POST request to add client
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/clients/add`, formData);
            const newClient = response.data;
            setClients([...clients, newClient]); // Update table with new client
            setFormData({
                name: '',
                company: '',
                city: '',
                email: '',
                phoneNumber: '',
            })
            setOpenForm(false); // Close the form dialog
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    const filteredRows = clients.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const getClients = ()=> {
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/clients/get`).then((response)=>{
            console.log(response.data);
            setClients(response.data);
        }).catch((error)=>{
            console.log(error);
        })
    }

    useEffect(() => {
        getClients();
    }, []);

    useEffect(()=>{
        console.log('test',clients)
    })

    return (
        <>
            <Button onClick={() => setOpen(true)}>Open drawer</Button>
            <SideBar open={open} setOpen={setOpen}/>
            <Container>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h1>Clients</h1>
                    <div style={{
                        display: 'flex',
                        gap: 20,
                    }}>
                        <TextField
                            sx={{width: 300, mt: 2}}
                            size={'small'}
                            label="Search"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            sx={{
                                color: '#000000',
                                height: 38,
                                mt: 2,
                                backgroundColor: '#FFEE0D',
                                '&:hover': {
                                    backgroundColor: '#FFEE0D',
                                },
                            }}
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={handleFormOpen}
                        >
                            Add Client
                        </Button>
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Client ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Company</TableCell>
                                <TableCell>City</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>Phone Number</TableCell>
                                <TableCell>Actions</TableCell> {/* Added Position column */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.company}</TableCell>
                                <TableCell>{row.city}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phoneNumber}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={()=>handleEditClient(index)} >Edit</Button>
                                    <Button variant="outlined" color="error" style={{ marginLeft: '8px' }} onClick={() => handleDeleteClient(index)}>Delete</Button>
                                </TableCell>
                            </TableRow>

                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[15, 25, 40]}
                    component="div"
                    count={filteredRows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {/* Add Client Form Dialog */}
                <Dialog open={openForm} onClose={handleFormClose}>
                    <DialogTitle>Add Client</DialogTitle>
                    <DialogContent>
                        <TextField
                            margin="dense"
                            label="Name"
                            fullWidth
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Company"
                            fullWidth
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="City"
                            fullWidth
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Email"
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Phone Number"
                            fullWidth
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color='error' onClick={handleFormClose}>Cancel</Button>
                        <Button onClick={handleFormSubmit}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default Staff;
