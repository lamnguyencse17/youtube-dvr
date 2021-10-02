import React, {useState} from 'react';
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Box from '@mui/material/Box';
import {styled} from "@mui/material/styles";
import {SAVE_FILE_PATH} from "../../events";
import {addTab, startRecording} from "../../reducers/tabs";
import {useHistory} from "react-router-dom";
import {YoutubeInfo} from "../../core/ytdl";
import {useAppDispatch} from "../../hooks";

const {ipcRenderer} = window.require('electron');

const ModalBox = styled(Box)`
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  background-color: white;
  margin: auto;
  height: 300px;
  width: 400px;
  padding: 10px;
`

const FullHeightTextField = styled(TextField)`
  height: 35px;
  flex-grow: 1;
  & .MuiTextField-root{
    height: 100%
  }
  & .MuiOutlinedInput-root{
    height: 100%
  }
  
  & .MuiInputLabel-root{
    top: -10px
  }
  
  & .MuiTextField-root{
    margin-left: auto;
  }
`

const FullWidthSelect = styled(Select)`
width: 100%
`

interface RecordModalProps {
    isRecordModalOpen: boolean;
    handleCloseRecordModal: React.Dispatch<React.SetStateAction<null>>;
    youtubeURL: string;
    getYoutubeInfo: (youtubeURL: string) => Promise<YoutubeInfo>
}

const RecordModal = ({isRecordModalOpen, handleCloseRecordModal, youtubeURL, getYoutubeInfo}: RecordModalProps) => {
    const dispatch = useAppDispatch()
    const history = useHistory()
    const [quality, setQuality] = useState("1080")
    const [youtubeInfo, setYoutubeInfo] = useState<YoutubeInfo>()
    const [path, setPath] = useState("")
    const handleChangeQuality = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuality(event.target.value);
    };
    const handleBrowseButton = async () => {
        const fetchedYoutubeInfo = await getYoutubeInfo(youtubeURL)
        setYoutubeInfo(fetchedYoutubeInfo)
        const defaultFileName = fetchedYoutubeInfo.title + ".mp4"
        ipcRenderer.send(SAVE_FILE_PATH, defaultFileName)
        ipcRenderer.once(SAVE_FILE_PATH, (event, filePath) => {
            setPath(filePath)
        })
    };
    const handleRecordButton = async () => {
        dispatch(addTab({...youtubeInfo, isRecording: true}))
        dispatch(startRecording({youtubeId: youtubeInfo.youtubeId, filePath: path}))
        history.push(`/player/${youtubeInfo.youtubeId}`)
    }
    return (
        <Modal open={isRecordModalOpen} onClose={handleCloseRecordModal}>
            <ModalBox>
                <div className={"align-middle flex"}>
                    <FullHeightTextField label="Outlined" variant="outlined" value={path}/>
                    <Button variant="contained" onClick={handleBrowseButton}>Browse</Button>
                </div>
                <div className={"text-center"}>
                    <InputLabel id="demo-simple-select-label">Quality</InputLabel>
                    <FullWidthSelect
                        value={quality}
                        label="Quality"
                        onChange={handleChangeQuality}
                    >
                        <MenuItem value={"144"}>144p</MenuItem>
                        <MenuItem value={"240"}>240p</MenuItem>
                        <MenuItem value={"360"}>360p</MenuItem>
                        <MenuItem value={"480"}>480p</MenuItem>
                        <MenuItem value={"720"}>720p</MenuItem>
                        <MenuItem value={"1080"}>1080p</MenuItem>
                    </FullWidthSelect>
                </div>
                <Button variant="outlined" onClick={handleRecordButton}>Start Recording</Button>
            </ModalBox>
        </Modal>
    );
}

export default RecordModal;
