import {YoutubeInfo} from "../core/ytdl";

export const getLiveTab = (tabs: YoutubeInfo[], activeTab: string): YoutubeInfo => {
    if (tabs.length === 0 || activeTab === ""){
        return null
    }
    return tabs.find(tab => tab.title === activeTab)
}

export const isLiveTab = (tabs: YoutubeInfo[], activeTab: string): boolean => {
    if (tabs.length === 0 || activeTab === ""){
        return false
    }
    const targetTab = tabs.find(tab => tab.title === activeTab);
    return targetTab.isLiveNow
}
