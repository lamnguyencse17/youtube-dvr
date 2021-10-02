import React, {useRef, useState} from "react"
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import CircularProgress from '@mui/material/CircularProgress';
import {GET_YOUTUBE_INFO, SET_YOUTUBE_URL} from "../events";
import {useHistory} from "react-router-dom";
import {addTab} from "../reducers/tabs";
import {useAppDispatch} from "../hooks";
import {YoutubeInfo} from "../core/ytdl";
import RecordModal from "./common/RecordModal";

const {ipcRenderer} = window.require('electron');

const UrlInput = styled(TextField)`
  width: 100%;
`

export const getYoutubeInfo = (youtubeURL: string): Promise<YoutubeInfo> => new Promise((resolve, _) => {
    ipcRenderer.send(SET_YOUTUBE_URL, youtubeURL)
    ipcRenderer.once(GET_YOUTUBE_INFO, (event, youtubeInfo: YoutubeInfo) => {
        resolve(youtubeInfo)
    })
})

const Home = () => {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const inputFile = useRef<HTMLInputElement | null>(null);
    const [youtubeURL, setYoutubeURL] = useState("")
    const [isShowingSpinner, setSpinner] = useState(false)
    const [isRecordModalOpen, setRecordModalOpen] = useState(false)
    const handleCloseRecordModal = () => {
        setRecordModalOpen(false)
    }
    const handleOpenRecordModal = () => {
        setRecordModalOpen(true)
    }
    const handleSetYoutubeURL = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYoutubeURL(e.target.value)
    }
    const handleWatchYoutube = async () => {
        setSpinner(true)
        const youtubeInfo = await getYoutubeInfo(youtubeURL)
        dispatch(addTab({...youtubeInfo, isRecording: false}))
        history.push(`/player/${youtubeInfo.youtubeId}`)
    }
    return <>
        <div className={"mx-auto flex flex-col w-10/12 mt-16 space-y-5 h-1/4"}>
            <h1 className={"text-3xl font-extrabold text-center"}>Enter a Youtube URL and start recording!</h1>
            <UrlInput id="youtube-url" label="A cool You-URL-tube" variant="filled" onChange={handleSetYoutubeURL}/>
            <div className={"grid grid-cols-2"}>
                <Button variant="contained" onClick={handleWatchYoutube}>Start Watching</Button>
                <Button variant="contained" onClick={handleOpenRecordModal}>Start Recording And Watching</Button>
            </div>
            <input type='file' id='file' ref={inputFile} style={{display: 'none'}}/>
            <RecordModal isRecordModalOpen={isRecordModalOpen} handleCloseRecordModal={handleCloseRecordModal}
                         youtubeURL={youtubeURL} getYoutubeInfo={getYoutubeInfo}/>
            {isShowingSpinner && <div className={"mx-auto"}>
                <CircularProgress/>
            </div>}
        </div>
    </>
}

export default Home;
