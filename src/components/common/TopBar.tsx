import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import {styled} from "@mui/material/styles";
import {Link as RouterLink} from "react-router-dom"
import Link from "@mui/material/Link"
import {useAppSelector} from "../../hooks";


const CustomDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    width: 20%;
  }
`

const TopBar = () => {
    const tabs = useAppSelector(state => state.tabs.tabs)
    console.log(tabs)
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
            <Link component={RouterLink} to={"/"} style={{ textDecoration: 'none' }}>
                <div className={"text-white text-xl font-bold"}>Youtube DVR</div>
            </Link>
        </Toolbar>
        <CustomDrawer
            anchor={"left"}
            open={isDrawerOpen}
            onClose={toggleDrawer}
            color={"primary"}
        >
            <div className={"w-full h-full flex flex-col text-center space-y-5 text-white text-xl"}>
                {tabs.map(({title, youtubeId}) => <div className={"w-full"}>
                    <Link component={RouterLink} to={`/player/${youtubeId}`}>
                        {title}
                    </Link>
                    </div>)
                }
            </div>
        </CustomDrawer>
    </AppBar>
}

export default TopBar
