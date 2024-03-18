import {useState, useContext, useEffect} from 'react';
import {useNavigate} from "react-router-dom";

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
    DialogActions, useTheme, useMediaQuery, IconButton,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import {SideBar} from "../Components/sideBar"; // Import axios for HTTP requests

import { useClient } from '../Components/ClientContext';
import MenuIcon from "@mui/icons-material/Menu";





const Staff = () => {

    const navigate = useNavigate()

    const checkUserAuthentication = () => {
        const user = localStorage.getItem('gntcuser');
        if (!user) {
            navigate('/login');
        }
    };
    const checkUserRole = () => {
        const user = localStorage.getItem('gntcuserrole');
        console.log('test role',user)
        if (user !== '"editor"') {
            console.log('jere')
            navigate('/kalendari');
        }
    };
    useEffect(() => {
        checkUserAuthentication();
        checkUserRole();
    }, []);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(15);
    const [searchTerm, setSearchTerm] = useState('');
    const [editedIndex, setEditedIndex] = useState(null); // Track currently edited client index
    const { clients,setClients, updateClients, deleteClients } = useClient();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


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
        <div style={!isMobile? {
            marginLeft: 250,
            transition: 'margin-left 0.5s',
            padding: '20px'
        }:{

        }}>
            {isMobile && <IconButton
                onClick={() => setOpen(true)}
                style={{}}
            >
                <MenuIcon/>
            </IconButton>}            <SideBar open={open} setOpen={setOpen}/>
            <Container>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <h1>Personat</h1>
                    <div style={{
                        display: 'flex',
                        gap: 20,
                    }}>
                        <TextField
                            sx={{width: 300, mt: 2}}
                            size={'small'}
                            label="Kërko"
                            variant="outlined"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button
                            sx={{
                                color: '#000000',
                                height: 38,
                                mt: 2,
                                backgroundColor: '#00cc00',
                                '&:hover': {
                                    backgroundColor: '#00cc00',
                                },
                            }}
                            variant="contained"
                            startIcon={<AddIcon/>}
                            onClick={handleFormOpen}
                        >
                            Shto Stafin
                        </Button>
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID-ja e Stafit</TableCell>
                                <TableCell>Emri</TableCell>
                                <TableCell>Kompania</TableCell>
                                <TableCell>E-mail</TableCell>
                                <TableCell>Numri i Telefonit</TableCell>
                                <TableCell>Ndrysho</TableCell> {/* Added Position column */}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                                <TableRow key={index}>
                                <TableCell>{index+1}</TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.company}</TableCell>
                                    <TableCell>{row.email}</TableCell>
                                    <TableCell>{row.phoneNumber}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" color="primary" onClick={()=>handleEditClient(index)} ><Edito></Button>
                                    <Button variant="outlined" color="error" style={{ marginLeft: '8px' }} onClick={() => handleDeleteClient(index)}><Fshij> </Button>
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
                            label="Emri"
                            fullWidth
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Kompania"
                            fullWidth
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                        />
                     
                        <TextField
                            margin="dense"
                            label="E-mail"
                            fullWidth
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                        <TextField
                            margin="dense"
                            label="Numri i Telefonit"
                            fullWidth
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color='error' onClick={handleFormClose}>Anulo</Button>
                        <Button onClick={handleFormSubmit}>Ruaj</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </div>
    );
};

export default Staff;
