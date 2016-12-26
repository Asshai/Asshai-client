import { proxyImage, loadSysInfo, formatDate } from '../common/utils'
import { FAV_LIST } from '../common/consts'
import { initFloatMenu } from '../float-menu/float-menu'


Page({
  data: {
    topic: {
      author: {}
    },
    popular_comments: [],
    comments: [],
    commentStart: 0,
    commentTotal: 0,
    commentCount: 20,
  },
  onLoad(options) {
    this.topicId = options.id || 94574223
    loadSysInfo(this, sysInfo =>
      this.loadTopic(sysInfo))
    this.loadComments()
    initFloatMenu({
      context: this ,
      subItems: [
        { url: '../../resources/images/star.png', handleTap: (e) => this.favTopic() },
        { url: '../../resources/images/list.png', handleTap: (e) => this.goToFavList() },
      ]
    })
  },
  favTopic() {
    wx.getStorage({
      key: FAV_LIST,
      success: (res) => this.saveFav(res),
      fail: (res) => this.saveFav(res),
    })
  },

  saveFav(res) {
    if (!this.data.topic.title) return
    console.log(res)
    let favList = res.data || []
    let msg = '收藏成功'
    const filtered = favList.filter(
      t => String(t.douban_id) !== String(this.topicId))
    if (filtered.length === favList.length) {
      favList.push(this.data.topic)
    } else {
      favList = filtered
      msg = '已取消收藏'
    }
    wx.setStorage({
      key: FAV_LIST,
      data: favList,
      fail: e => console.error(e),
      success: res => wx.showToast({
        title: msg,
        icon: 'success',
        duration: 1500,
      })
    })
  },

  goToFavList() {
    wx.navigateTo({
      url: '../fav-topics/fav-topics'
    })
  },

  loadTopic(sysInfo) {
    wx.request({
      url: `http://doubandev2.intra.douban.com:20110/topic/${this.topicId}/`,
      data: {},
      method: 'GET',
      success: res => {
        console.log(res.data)
        const data = res.data
        data.create_time = formatDate(data.create_time)
        this.setData({
          topic: data
        })
        const imgMaxWidth = sysInfo.windowWidth - 18 * 2
        const IMG_RE = /<图片(\d+)>/g
        let elements = []
        let images = []
        let match = null
        let lastEnd = 0
        while (match = IMG_RE.exec(data.content)) {
          elements.push({
            type: 'text',
            content: data.content.substring(lastEnd, match.index)
          })
          const photo = data.photo_list[match[1] - 1]
          let imgUrl = proxyImage(photo.alt)
          elements.push({
            type: 'image',
            width: imgMaxWidth,
            height: photo.size.height / photo.size.width * imgMaxWidth,
            src: imgUrl,
          })
          images.push({
            url: imgUrl
          })
          lastEnd = match.index + match[0].length
        }
        elements.push({
          type: 'text',
          content: data.content.substring(lastEnd)
        })
        this.setData({
          contentElements: elements,
          images
        })
      },
      fail: data => {
        console.error(data)
      },
    })
  },

  loadComments() {
    const {
      commentStart: start,
      commentCount: count,
      commentTotal: total,
    } = this.data
    const isLoading = this.isLoadingComments
    if (total && start >= total || isLoading) return
    this.isLoadingComments = true
    wx.request({
      url: `https://m.douban.com/rexxar/api/v2/group/topic/${this.topicId}/comments`,
      data: {start, count},
      method: 'GET',
      success: (res) => {
        const { popular_comments, comments, total } = res.data
        this.setData({
          popular_comments: this.data.popular_comments.concat(popular_comments),
          comments: this.data.comments.concat(comments),
          commentStart: start + count,
          commentTotal: total
        })
        this.isLoadingComments = false
      },
      fail: err => {
        console.error(err)
        this.isLoadingComments = false
      },
    })
  },
  previewImage(e) {
    wx.previewImage({
      current: e.target.src, // 当前显示图片的http链接
      urls: this.data.images.map(img => img.url) // 需要预览的图片http链接列表
    })
  },
});
