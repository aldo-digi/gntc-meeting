import {useState, useContext} from 'react';
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
    Select,
    MenuItem,
    InputLabel, FormControl
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {SideBar} from "../Components/sideBar"; // Import axios for HTTP requests

import { useClient } from '../Components/ClientContext';



const Staff = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState('');
    const [rows, setRows] = useState([
        {
            id: 1,
            name: 'John Doe',
            company: 'GNTC',
            city: 'New York',
            gender: 'Male',
            email: 'john@example.com',
            position: 'Staff'
        },
        {
            id: 2,
            name: 'Jane Smith',
            company: 'GNTC',
            city: 'Los Angeles',
            gender: 'Female',
            email: 'jane@example.com',
            position: 'Manager'
        },
        // Add more rows as needed
    ]);

    //client Context
    const { clients, updateClients, deleteClients } = useClient();

    const handleDeleteClient = (index) => {
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
        position: '', // No default position
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
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData({...formData, [name]: value});
    };

    const handleFormSubmit = async () => {
        try {
            updateClients(formData);

            // Send POST request to add client
            // const response = await axios.post('/api/clients', formData);
            // const newClient = response.data;
            setRows([...rows, formData]); // Update table with new client
            setOpenForm(false); // Close the form dialog
        } catch (error) {
            console.error('Error adding client:', error);
        }
    };

    const positions = ['Manager', 'Staff', 'Other']; // Available positions

    const filteredRows = clients.filter(row =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                <TableCell>Position</TableCell>
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
                                <TableCell>{row.position}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" >Edit</Button>
                                    <Button variant="outlined" color="secondary" style={{ marginLeft: '8px' }} onClick={() => handleDeleteClient(index)}>Delete</Button>
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
                        <FormControl fullWidth sx={{
                            mt: 1,
                            mb: 1
                        }}>
                            <InputLabel id="gender">Position</InputLabel>
                            <Select
                                margin="dense"
                                label="Position"
                                fullWidth
                                name="position"
                                value={formData.position}
                                onChange={handleInputChange}
                            >
                                {positions.map((position, index) => (
                                    <MenuItem key={index} value={position}>{position}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            margin="dense"
                            label="Email"
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleFormClose}>Cancel</Button>
                        <Button onClick={handleFormSubmit}>Submit</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
};

export default Staff;
