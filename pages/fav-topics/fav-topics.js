import { proxyImage, loadSysInfo } from '../common/utils'
import { initFloatMenu } from '../float-menu/float-menu'
import { FAV_LIST } from '../common/consts'

Page({
  data: {
    topicList: [],
    start: 0,
    count: 20,
    total: 0,
  },
  onLoad(options) {
    loadSysInfo(this)
    wx.getStorage({
      key: FAV_LIST,
      success: (res) => {
        this.topicList = res.data.map(topic => {
          const title = topic.title
          if (title.length > 18) {
            topic.title = topic.title.substring(0, 18) + '...'
          }
          return topic
        })
        this.setData({ total: this.topicList.length })
        this.loadFavTopics()
      },
      fail: (res) => {},
    })
  },
  loadFavTopics() {
    const { start, count, total, topicList } = this.data
    if (start >=  total) return
    this.setData({
      topicList: topicList.concat(this.topicList.slice(start, start + count)),
      start: start + count
    })
  }
});
