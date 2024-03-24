import { useEffect, useState } from 'react';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Import the ExitToAppIcon
import logo from '../Assets/logo.png';
import { useLocation, useNavigate, useRoutes } from "react-router-dom";
import PersonIcon from '@mui/icons-material/Person';
import HistoryIcon from '@mui/icons-material/History';

export const SideBar = ({ open, setOpen }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [activeItem, setActiveItem] = useState('kalendria');
    const navigate = useNavigate();
    const path = useLocation().pathname;

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
        navigate(`/${itemName.toLowerCase()}`);
    };

    const handleLogout = () => {
        localStorage.removeItem('gntcuserrole');
        localStorage.removeItem('gntcuser');
        navigate('/login');
    };

    const userRole = localStorage.getItem('gntcuserrole');

    useEffect(() => {
        setActiveItem(path.split('/')[1] || 'kalendria');
    }, [path]);

    return (
        <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            anchor="left"
            open={open}
            onClose={toggleDrawer(false)}
            ModalProps={{ keepMounted: true }}
        >
            <img src={logo} alt="logo" style={{ width: 150, paddingLeft: 30, marginBottom: 30, marginTop: 30 }} />

            <Box sx={{ width: isMobile ? '100%' : 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
                <List>
                    <ListItem
                        key='kalendari'
                        sx={{
                            mb: 2,
                            borderRadius: 20,
                            '&:hover': {
                                backgroundColor: '#00cc00',
                            },
                            backgroundColor: activeItem === 'kalendari' ? '#00cc00' : 'inherit',
                        }}
                        disablePadding
                    >
                        <ListItemButton onClick={() => handleItemClick('Kalendari')}>
                            <ListItemIcon>
                                <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText primary='Kalendari' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        key='clients'
                        sx={{
                            mb: 2,
                            borderRadius: 20,
                            '&:hover': {
                                backgroundColor: '#00cc00',
                            },
                            backgroundColor: activeItem === 'clients' ? '#00cc00' : 'inherit',
                        }}
                        disablePadding
                    >
                        <ListItemButton onClick={() => handleItemClick('clients')}>
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary='Personat' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        key='history'
                        sx={{
                            mb: 2,
                            borderRadius: 20,
                            '&:hover': {
                                backgroundColor: '#00cc00',
                            },
                            backgroundColor: activeItem === 'history' ? '#00cc00' : 'inherit',
                        }}
                        disablePadding
                    >
                        <ListItemButton onClick={() => handleItemClick('history')}>
                            <ListItemIcon>
                                <HistoryIcon />
                            </ListItemIcon>
                            <ListItemText primary='Historia' />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List sx={{ marginTop: 'auto' }}>
                    <ListItem
                        key="user"
                        sx={{ borderRadius: 20 }}
                    >
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText primary={localStorage.getItem('gntcuser')} />
                    </ListItem>
                </List>
                <Divider />
                <List sx={{ marginTop: 'auto' }}>
                    <ListItem
                        button
                        key="logout"
                        onClick={handleLogout}
                        sx={{ borderRadius: 20 }}
                    >
                        <ListItemIcon>
                            <ExitToAppIcon />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    );
};
