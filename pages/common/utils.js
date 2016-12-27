import { Promise } from '../../resources/js/bluebird';

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

// cfg 内容见https://mp.weixin.qq.com/debug/wxadoc/dev/api/network-request.html?t=20161222#wxrequestobject
// ajax({url: 'xx'}).then(res => {});
export function ajax( cfg ) {
    return new Promise( function ( resolve, reject ) {
        cfg.success = function ( res ) {
            resolve( res );
        }
        cfg.fail = function ( err ) {
            reject( err );
        }
        wx.request( cfg );
    });
}