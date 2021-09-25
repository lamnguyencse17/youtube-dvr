import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import {styled} from "@mui/material/styles";


const CustomDrawer = styled(Drawer)`width: 200px`

const TopBar = () => {
    const [isDrawerOpen, setDrawer] = useState(false)
    const toggleDrawer = () => setDrawer(!isDrawerOpen)
    return <AppBar position="static">
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={toggleDrawer}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Youtube DVR
            </Typography>
        </Toolbar>
        <CustomDrawer
            anchor={"left"}
            open={isDrawerOpen}
            onClose={toggleDrawer}
        >
            <div className={"w-full"}>
                <div className={"w-full"}>Test</div>
            </div>
        </CustomDrawer>
    </AppBar>
}

export default TopBar
