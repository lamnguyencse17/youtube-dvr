import React from "react"
import {useParams} from "react-router-dom";

interface YoutubeIdParams {
    youtubeId: string;
}

const Player = () => {
    const { youtubeId } = useParams<YoutubeIdParams>();
    return <div className={"mx-auto flex flex-row w-full mt-16 h-full"}>
            {youtubeId === "" ? <></> : <>
                <webview
                    src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player"
                    allowFullScreen
                    style={{width: "80%"}}
                />
                <webview
                    src={`https://www.youtube.com/live_chat?v=${youtubeId}`} title="YouTube video player"
                    allowFullScreen
                    style={{width: "20%"}}
                />
            </>}
    </div>
}

export default Player
