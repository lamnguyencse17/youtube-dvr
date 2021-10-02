# youtube-dvr
This repo is the source code for the software with the same name allowing you to record youtube livestream

## What's working:
- Watch live youtube/archive/normal video with live chat embed
- Start/stop recording youtube video
- Choose file name and where to save!

## Keep in mind:
- Start and stop recording may or may not override existed (I remember that it will append to the video, hopefully)
- Weird stuff may happen with youtube-dl, you can just manually update the binary which locates in `resources` something 😄 
- It will always be the highest video/audio setting for now 😄

## What's not working:
- Sometimes youtube-dl will act weird throw out weird error, just press stop recording and start again!
- Annoying dev tool will pop up because I am lazy 😄 Could be helpful if you want me to solve some weird bugs. 

## Roadmap:
1. Quality selection
2. Download info
3. Youtube info: channel name, subscriber(dunno), description
4. Timestamp save
5. Cut archive from timestamp
6. Holodex LiveTL (For hololive fans)
