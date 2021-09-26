import React, {useState} from "react"
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
const { ipcRenderer } = window.require('electron');
import {GET_YOUTUBE_INFO, SET_YOUTUBE_URL} from "../events";
import {useHistory} from "react-router-dom";
import {addTab} from "../reducers/tabs";
import {useAppDispatch} from "../hooks";
import {YoutubeInfo} from "../core/ytdl";

const UrlInput = styled(TextField)`
  width: 100%;
`

const Home = () => {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const [youtubeURL, setYoutubeURL] = useState("")
    const [isShowingSpinner, setSpinner] = useState(false)
    const handleSetYoutubeURL = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYoutubeURL(e.target.value)
    }

    const handleProcessYoutubeURL = () => {
        setSpinner(true)
        ipcRenderer.send(SET_YOUTUBE_URL, youtubeURL)
        ipcRenderer.once(GET_YOUTUBE_INFO, (event, youtubeInfo: YoutubeInfo) => {
            setSpinner(false)
            dispatch(addTab(youtubeInfo))
            history.push(`/player/${youtubeInfo.youtubeId}`)
        })
    }
    return <>
        <div className={"mx-auto flex flex-col w-10/12 mt-16 space-y-5 h-1/4"}>
            <h1 className={"text-3xl font-extrabold text-center"}>Enter a Youtube URL and start recording!</h1>
            <UrlInput id="youtube-url" label="A cool You-URL-tube" variant="filled" onChange={handleSetYoutubeURL}/>
            <Button variant="contained" onClick={handleProcessYoutubeURL}>Start!</Button>
            {isShowingSpinner && <div className={"mx-auto"}>
                <CircularProgress/>
            </div>}
        </div>
    </>
}

export default Home;
