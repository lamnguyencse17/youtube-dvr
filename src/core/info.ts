// frame= 1110 fps= 31 q=-1.0 size=    3072kB time=00:00:36.98 bitrate= 680.4kbits/s speed=1.03x

export const handleDownloadInfo = (log: string): void => {
    if (!log.includes("frame")) {
        return;
    }
    const downloadLog = log.replace(/ +(?= )/g, '').split(" ")
    console.log(downloadLog)
    let valueHolder = ""
    const logValues: string[] = []
    downloadLog.forEach(value => {
        if (value === '\r') {
            return
        }
        const equalPos = value.indexOf("=")
        if (equalPos !== value.length - 1 && equalPos !== -1) {
            logValues.push(value)
            return
        }
        valueHolder = valueHolder + value
        if (equalPos === -1) {
            logValues.push(valueHolder)
            valueHolder = ""
            return;
        }
    })
    console.log(logValues)
}
