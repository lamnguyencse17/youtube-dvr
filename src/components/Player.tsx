import React from "react"
import {useParams} from "react-router-dom";
import {useAppSelector} from "../hooks";

interface YoutubeIdParams {
    youtubeId: string;
}

const Player = () => {
    const {isShowingLiveChat} = useAppSelector(state => state.configs)
    const { youtubeId } = useParams<YoutubeIdParams>();
    if (isShowingLiveChat) {
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
    return <div className={"mx-auto flex flex-row w-full mt-16 h-full"}>
        {youtubeId === "" ? <></> : <>
            <webview
                src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player"
                allowFullScreen
                style={{width: "100%"}}
            />
        </>}
    </div>

}

export default Player
