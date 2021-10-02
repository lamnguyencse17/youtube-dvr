import React, {useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import {styled} from "@mui/material/styles";
import {Link as RouterLink} from "react-router-dom"
import Link from "@mui/material/Link"
import {useAppSelector} from "../../hooks";
import Util from "./Util";
import {isLiveTab} from "../../utils/tabs";


const CustomDrawer = styled(Drawer)`
  & .MuiDrawer-paper {
    width: 20%;
  }
`

const TopBar = () => {
    const {tabs, activeTab} = useAppSelector(state => state.tabs)
    const isLive = isLiveTab(tabs, activeTab)
    const [isDrawerOpen, setDrawer] = useState(false)
    const toggleDrawer = () => setDrawer(!isDrawerOpen)
    return <AppBar position="static">
        <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{mr: 2}}
                onClick={toggleDrawer}
            >
                <MenuIcon/>
            </IconButton>
            <Link component={RouterLink} to={"/"} style={{textDecoration: 'none'}}>
                <div className={"text-white text-xl font-bold"}>Youtube DVR</div>
            </Link>
            <Util isLive={isLive}/>
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
