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
                        key='Kalendria'
                        sx={{
                            mb:2,
                            borderRadius: 20,
                            '&:hover': {
                                backgroundColor: '#FFEE0D',
                            },
                            backgroundColor: activeItem === 'kalendria' ? '#FFEE0D' : 'inherit',
                        }}
                        disablePadding
                    >
                        <ListItemButton onClick={() => handleItemClick('Kalendria')}>
                            <ListItemIcon>
                                <CalendarMonthIcon />
                            </ListItemIcon>
                            <ListItemText primary='Kalendria' />
                        </ListItemButton>
                    </ListItem>
                    <ListItem
                        key='Staff'
                        sx={{
                            mb:2,
                            borderRadius: 20,
                            '&:hover': {
                                backgroundColor: '#FFEE0D',
                            },
                            backgroundColor: activeItem === 'staff' ? '#FFEE0D' : 'inherit',
                        }}
                        disablePadding
                    >
                        <ListItemButton onClick={() => handleItemClick('Staff')}>
                            <ListItemIcon>
                                <PeopleAltIcon />
                            </ListItemIcon>
                            <ListItemText primary='Staff' />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}
