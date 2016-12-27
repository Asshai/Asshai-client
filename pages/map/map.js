// import { Promise } from '../../resources/js/bluebird';
import { ajax, proxyImage } from '../common/utils';

Page({
    data: {
        // 经纬度固定为兆维地区
        longitude: 116.4986866,
        latitude: 39.9735833,

        scale: 14,

        // 地图的标记点
        markers: [],

        // 小区
        communities: [],

        houses: [],

        // 'tiny' or 'full'
        swipFull: 'tiny'
    },
    onLoad: function () {
        let that = this;
        wx.request( {
            url: 'http://doubandev2.intra.douban.com:20110/location/nearby/',
            data: {
                longitude: that.data.longitude,
                lantitude: that.data.latitude
            },
            success: function ( res ) {
                // 过滤topics为0的小区
                let r = res.data.results.map( (e, i) => {
                    e.distance = e.distance.toFixed();
                    e.address = e.address.split( '市' ).join( ', ' );
                    e.cover = proxyImage( e.cover );
                    // 用于markers
                    e.iconPath = '../../resources/images/marker.png';
                    if ( i === 0 ) {
                        e.iconPath = '../../resources/images/marker-blue.png';
                    }
                    e.width = 35;
                    e.height = 35;
                    return e;
                });

                that.setData({
                    communities: r,
                    markers: r,
                    hpState: 'half'
                });
            }
        });
    },
    // 切换时高亮当前标记点
    communitychange: function ( cur ) {
        let curIndex = cur.detail.current;
        this.setData( {
            markers: this.data.markers.map( function (e, i) {
                if (i === curIndex){
                    e.iconPath = '../../resources/images/marker-blue.png';
                } else {
                    e.iconPath = '../../resources/images/marker.png';
                }
                return e;
            })
        })
    },

    // 展开二级列表
    openhouses: function ( e ) {
        let id = e.currentTarget.dataset.id;
        let that = this;
        this.setData( {
            swipFull: this.data.swipFull === 'full' ? 'tiny' : 'full'
        });
        if ( this.data.swipFull === 'full' ) {
            ajax( {
                url: 'http://doubandev2.intra.douban.com:20110/topic/hot/',
                    data: {
                    location_id: id
                }
            }).then( function ( res ) {
                that.setData( {
                    houses: res.data.results.map( e => {
                        if (!e.cover){
                            e.cover = '../../resources/images/default-house.png';
                        } else {
                            e.cover = proxyImage( e.cover );
                        }
                        e.author_avatar = proxyImage( e.author_avatar );
                        e.create_time = ( new Date( e.create_time ) ).toLocaleDateString();
                        return e;
                    })
                })
            })
        }
    }
})