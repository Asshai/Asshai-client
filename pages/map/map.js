import { ajax, proxyImage } from '../common/utils';

const deflongitude = 116.4986866;
const deflatitude = 39.9735833;

Page({
    data: {
        // 经纬度固定为兆维地区
        longitude: deflongitude,
        latitude: deflatitude,

        scale: 14,

        // 地图的标记点
        markers: [],

        // 小区
        communities: [],

        houses: [],

        // 'tiny' or 'full'
        swipFull: 'tiny',

        communityFull: 'tiny',

        hideHouseList: true,
        hideHouseLoading: false
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
                let r = that.filterCommunity( res.data.results );

                that.setData({
                    communities: r,
                    markers: r
                });
            }
        });
    },

    // 过滤社区列表
    filterCommunity: function (arr) {
        return arr.map( (e, i) => {
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
    },

    // 左右切换社区
    communitychange: function ( cur ) {
        let curIndex = cur.detail.current;
        let curCommunity = this.data.communities[curIndex];
        this.setData( {
            markers: this.data.markers.map( function ( e, i ) {
                if ( i === curIndex ) {
                    e.iconPath = '../../resources/images/marker-blue.png';
                } else {
                    e.iconPath = '../../resources/images/marker.png';
                }
                return e;
            }),
            latitude: curCommunity.latitude,
            longitude: curCommunity.longitude
        });
        if ( this.data.swipFull === 'full' ) {
            let id = this.data.markers[ curIndex ].id;
            this.setData( {
                hideHouseList: true,
                hideHouseLoading: false
            })
            this.renderHouseList( id );
        }
    },

    // 展开二级列表
    openhouses: function ( e ) {
        let id = e.currentTarget.dataset.id;
        this.setData( {
            swipFull: this.data.swipFull === 'full' ? 'tiny' : 'full'
        });
        // 展开
        if ( this.data.swipFull === 'full' ) {
            this.setData( {
                hideHouseList: true,
                hideHouseLoading: false,
                communityFull: 'full'
            });
            this.renderHouseList( id );
        } else {
            this.setData( {
                houses: [],
                communityFull: 'tiny'
            });
        }
    },

    // 渲染房子列表
    renderHouseList: function ( id ) {
        let that = this;
        ajax( {
            url: 'http://doubandev2.intra.douban.com:20110/topic/hot/',
            data: {
                location_id: id
            }
        }).then( function (res) {
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
                }),
                hideHouseList: false,
                hideHouseLoading: true
            })
        })
    },

    // 搜索
    inputComfirm: function ( e ) {
        let that = this;
        if ( !e.detail.value ) return;
        ajax( {
            url: 'http://doubandev2.intra.douban.com:20110/location/search/',
            data: {
                longitude: that.data.longitude,
                lantitude: that.data.latitude,
                q: e.detail.value
            }
        }).then( function ( res ) {
            let r = that.filterCommunity( res.data.results );

            that.setData({
                communities: r,
                markers: r
            });
        })
    },

    go: function ( e ) {
        wx.navigateTo( {
            url: `../topic/topic?id=${e.currentTarget.dataset.doubanid}`
        });
    }
})