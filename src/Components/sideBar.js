import {useEffect, useState} from 'react';
import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import logo from '../Assets/logo.png'
import {useLocation, useNavigate, useRoutes} from "react-router-dom";

export const SideBar = ({open, setOpen }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [activeItem, setActiveItem] = useState('kalendria');
    const navigate = useNavigate()
    const path = useLocation().pathname;

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
        navigate(`/${itemName.toLowerCase()}`)
    };

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
                            mb:2,
                            borderRadius: 20,
                            '&:hover': {
                                backgroundColor: '#FFEE0D',
                            },
                            backgroundColor: activeItem === 'kalendari' ? '#FFEE0D' : 'inherit',
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
                            mb:2,
                            borderRadius: 20,
                            '&:hover': {
                                backgroundColor: '#FFEE0D',
                            },
                            backgroundColor: activeItem === 'clients' ? '#FFEE0D' : 'inherit',
                        }}
                        disablePadding
                    >
                        <ListItemButton onClick={() => handleItemClick('clients')}>
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary='Clients' />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}
