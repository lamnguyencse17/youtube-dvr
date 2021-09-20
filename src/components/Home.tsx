import React, {useState} from "react"
import TextField from "@mui/material/TextField";
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import ytdl from "ytdl-core"

const UrlInput = styled(TextField)`
  width: 100%;
`

const Home = () => {
    const [youtubeURL, setYoutubeURL] = useState("")
    const [youtubeId, setYoutubeId] = useState("")
    const handleSetYoutubeURL = (e: React.ChangeEvent<HTMLInputElement>) => {
        setYoutubeURL(e.target.value)
    }

    const handleProcessYoutubeURL = () => {
        setYoutubeId(ytdl.getVideoID(youtubeURL))
    }
    return <div className={"mx-auto flex flex-col w-10/12 mt-16 space-y-5"}>
        <h1 className={"text-3xl font-extrabold text-center"}>Enter a Youtube URL and start recording!</h1>
        <UrlInput id="youtube-url" label="A cool You-URL-tube" variant="filled" onChange={handleSetYoutubeURL}/>
        <Button variant="contained" onClick={handleProcessYoutubeURL}>Start!</Button>
        {youtubeId === "" ? <></> : <div className={"w-full h-64"}>
            <webview
                src={`https://youtube.com/live_chat?v=${youtubeId}`}
                style={{width: "100%", height: "100%"}}
            />
        </div>}
    </div>
}

export default Home;
