import React from "react"
import {useParams} from "react-router-dom";
import PlayerInfo from "./player/PlayerInfo";
import {getLiveTab} from "../utils/tabs";
import {useAppSelector} from "../hooks";
import DownloadInfo from "./player/DownloadInfo";

interface YoutubeIdParams {
    youtubeId: string;
}

const Player = () => {
    const {youtubeId} = useParams<YoutubeIdParams>();
    const {tabs, activeTab} = useAppSelector(state => state.tabs)
    const currentTab = getLiveTab(tabs, activeTab)
    const {isShowingLiveChat} = useAppSelector(state => state.configs)
    if (isShowingLiveChat) {
        return <div className={"mx-auto flex flex-col w-full mt-2 h-full"}>
            {youtubeId === "" ? <></> : <div className={"flex flex-row h-full"}>
                <DownloadInfo currentTab={currentTab}/>
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
            {youtubeId === "" ? <></> : <PlayerInfo currentTab={currentTab}/>}
        </div>
    }
    return <div className={"mx-auto flex flex-col w-full mt-2 h-full"}>
        {youtubeId === "" ? <></> : <>
            <DownloadInfo currentTab={currentTab}/>
            <webview
                src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube video player"
                allowFullScreen
                style={{width: "100%", height: "80%"}}
            />
            <PlayerInfo currentTab={currentTab}/>
        </>}
    </div>
}

export default Player
