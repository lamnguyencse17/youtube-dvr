# youtube-dvr
This repo is the source code for the software with the same name allowing you to record youtube livestream

## What's working:
- Watch live youtube/archive/normal video with live chat embed
- Start/stop recording youtube video

## Keep in mind:
- File name is always `youtubeID.mp4` in the folder of the software
- Start and stop recording may or may not override existed (I remember that it will append to the video, hopefully)
- Weird stuff may happen with youtube-dl, you can just manually update the binary which locates in `resources` something 😄 
- It will always be the highest video/audio setting for now 😄

## What's not working:
- Sometimes youtube-dl will act weird throw out weird error, just press stop recording and start again!
- Annoying dev tool pop up because I am lazy 😄 Could be helpful if you want me to solve some weird bugs. 
