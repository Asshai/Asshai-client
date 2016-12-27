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
        let banner
        this.topicList = res.data.map(topic => {
          const title = topic.title
          if (title.length > 18) {
            topic.title = topic.title.substring(0, 18) + '...'
          }
          topic.photo_list = topic.photo_list.map(p => {
            p.alt = proxyImage(p.alt)
            if (!banner) banner = p.alt
            return p
          })
          return topic
        })
        if (!banner) banner = '../../resources/images/default-house.png'
        this.setData({ total: this.topicList.length, banner })
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
