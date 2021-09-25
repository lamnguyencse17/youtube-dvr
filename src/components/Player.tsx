import React from "react"
import {useParams} from "react-router-dom";

interface YoutubeIdParams {
    youtubeId: string;
}

const Player = () => {
    const { youtubeId } = useParams<YoutubeIdParams>();
    return <div className={"mx-auto flex flex-col md:w-11/12 lg:w-full mt-16 space-y-5 h-full"}>
        <div className={"mx-auto flex flex-row w-10/12 mt-5 h-3/4"}>
            {youtubeId === "" ? <></> : <>
                <webview
                    src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player"
                    allowFullScreen
                    style={{width: "80%", height: "100%"}}
                />
                <webview
                    src={`https://www.youtube.com/live_chat?v=${youtubeId}`} title="YouTube video player"
                    allowFullScreen
                    style={{width: "20%", height: "100%"}}
                />
            </>}
        </div>
    </div>
}

export default Player
