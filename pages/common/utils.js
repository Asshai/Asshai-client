
export function proxyImage(src) {
  return `http://doubandev2.intra.douban.com:20110/picture/?src=${encodeURIComponent(src)}`
}

export function loadSysInfo(context, callback) {
  wx.getSystemInfo({
    success: sysInfo => {
      context.setData({
        windowWidth: sysInfo.windowWidth,
        windowHeight: sysInfo.windowHeight,
        sysInfo,
      })
      callback && callback(sysInfo)
    }
  })
}

export function formatDate(dateStr) {
  return dateStr
    .replace('T', ' ')
    .replace('Z', '')
}
