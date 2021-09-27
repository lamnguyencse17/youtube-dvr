import React, {useEffect} from "react"
import {useParams} from "react-router-dom";
import {useAppSelector} from "../hooks";
import PlayerInfo from "./player/PlayerInfo";

interface YoutubeIdParams {
    youtubeId: string;
}

const Player = () => {
    const {isShowingLiveChat} = useAppSelector(state => state.configs)
    const { youtubeId } = useParams<YoutubeIdParams>();
    if (isShowingLiveChat) {
        return <div className={"mx-auto flex flex-col w-full mt-2 h-full"}>
            {youtubeId === "" ? <></> : <PlayerInfo />}
            {youtubeId === "" ? <></> : <div className={"flex flex-row h-full"}>
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
            </div>}
        </div>
    }
    return <div className={"mx-auto flex flex-col w-full mt-16 h-full"}>
        {youtubeId === "" ? <></> : <>
            <PlayerInfo/>
            <webview
                src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player"
                allowFullScreen
                style={{width: "100%", height: "80%"}}
            />
        </>}
    </div>

}

export default Player
