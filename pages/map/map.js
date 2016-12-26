import { proxyImage } from '../common/utils'

const app = getApp();

Page({
    switchTap: function () {
        this.setData( { hpState: this.data.hpState === 'half' ? 'tiny' : 'half' } );
    },

    switchCommunity: function ( e ) {
        let that = this;

        this.setData( {
            showHousesView: true,
            showCloseBtn: true,
            showHvLoading: true
        });

        wx.request( {
            url: 'http://doubandev2.intra.douban.com:20110/topic/hot/',
            data: {
                location_id: e.target.dataset.cid
            },
            success: function ( res ) {
                that.setData( {
                    showHvLoading: false,
                    houses: res.data.results.map( e => {
                        let d = new Date( e.create_time );
                        e.create_time = d.toLocaleDateString();
                        e.cover = proxyImage(e.cover)
                        return e;
                    })
                });
            }
        })
    },

    closeHouseView: function () {
        this.setData( {
            showHousesView: false,
            showCloseBtn: false,
            houses: []
        });
    },

    // 高亮当前小区的位置
    highlightMarker: function ( e ) {
        let latitude, longitude;
        let m = this.data.markers.map(( ele, i ) => {
            let ds = e.currentTarget.dataset;
            if ( i === ds.index ) {
                ele.iconPath = '../../resources/images/marker-blue.png';
                // 将高亮的marker上移
                latitude = ds.latitude - 0.006;
                longitude = ds.longitude;
            } else {
                ele.iconPath = '../../resources/images/marker.png';
            }
            return ele;
        })

        this.setData( {
            markers: m,
            latitude: latitude,
            longitude: longitude
        })
    },

    goTopic(e) {
        wx.navigateTo( {
            url: `../topic/topic?id=${e.currentTarget.dataset.doubanid}`
        });
    },

    data: {
        // 面板状态
        hpState: 'tiny',

        // 显示社区的房子列表视图
        showHousesView: false,

        // 地图的标记点
        markers: [],

        // 经纬度固定为兆维地区
        longitude: 116.4986866,
        latitude: 39.9735833,

        // 社区列表
        communities: [],

        // 社区内的房子列表
        houses: [],

        // 房子界面的loading
        showHvLoading: true,

        // 显示关闭房子列表的按钮
        showCloseBtn : false
    },
    onLoad: function ( options ) {
        let that = this;

        wx.request( {
            url: 'http://doubandev2.intra.douban.com:20110/location/nearby/',
            data: {
                longitude: that.data.longitude,
                lantitude: that.data.latitude
            },
            success: function ( res ) {
                // 过滤topics为0的小区
                let r = res.data.results.filter( e => e.topics )
                    .map( e => {
                        e.title = e.name;
                        e.iconPath = '../../resources/images/marker.png';
                        return e;
                    });


                that.setData({
                    markers: r,
                    communities: r,
                    hpState: 'half'
                });
            }
        });

    }
})
