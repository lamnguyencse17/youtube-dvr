# YOUTUBE-DVR
This repo is the source code for the software with the same name allowing you to record youtube livestream or just youtube video

## What's working:
- Watch live youtube/archive/normal video with live chat embed
- Start/stop recording youtube video
- Choose file name and where to save
- Quality selection

## Keep in mind:
- Start and stop recording may or may not override existed (I remember that it will append to the video, hopefully)
- Weird stuff may happen with youtube-dl, you can just manually update the binary which locates in `resources` something 😄 
- It will always be the highest video/audio setting for now 😄
- Quality selection will default at 1080p in selecting. The priority will be:
  - Your desired quality
  - Best video + Best audio (youtube-dl config)
  - Best (youtube-dl config)
- There will be no 2K or 4K (for now, hopefully) as most Youtube livestream are at best 1080p

## What's not working:
- Sometimes youtube-dl will act weird throw out weird error, just press stop recording and start again!
- Annoying dev tool will pop up because I am lazy 😄 Could be helpful if you want me to solve some weird bugs. 

## Roadmap:
1. Quality selection <==== Done
2. Download info
3. Youtube info: channel name, subscriber(dunno), description
4. Timestamp save
5. Scheduler (it will fetch the livestream time and auto record the stuff)
6. Cut archive from timestamp
7. Holodex LiveTL (For hololive fans)

## Library/Binary in use:
- React
- Electron
- Material UI
- Youtube-dl
- FFMPEG


## Author
**Nguyen Quang Lam** - [lamnguyencse17](https://github.com/lamnguyencse17)

See also the list of [contributors](https://github.com/lamnguyencse17/youtube-dvr/graphs/contributors) who participated in this project.

## Contacts
- For urgent contact, please message me on [Facebook](https://www.facebook.com/zodiac3011/)
- For collaboration, please send an email to [nguyenquanglam3008@gmail.com](mailto:nguyenquanglam3008@gmail.com)
