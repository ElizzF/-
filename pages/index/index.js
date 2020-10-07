
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goToPreparation() {
    wx.getStorage({
      key: 'token',
      success: () => {
        wx.navigateTo({
          url: '/pages/preparation/preparation' 
        })
      },
      fail: () => {
        wx.showModal({
          title: '提示',
          content: '您尚未进行登录授权，无法开始游戏',
          showCancel: false
        })
      }
    })
  },
  authorization() {
    wx.getStorage({
      key: 'token',
      success: () => {
        wx.showModal({
          title: '提示',
          content: '您已授权过，无需再次授权',
          showCancel: false
        })
      },
      fail: () => {
        wx.showLoading({title: '加载中', icon: 'loading', duration: 10000, mask: true});
        wx.login({
          complete: (res) => {
            wx.request({
              url: 'https://frp.leavessoft.cn:40001/api/user/session',
              method: 'POST',
              data: {
                code: res.code
            },
              success: (res) => {
                if(res.statusCode == 200) {
                  console.log(Date.now());
                  wx.setStorage({
                    data: Date.now(),
                    key: 'timestart',
                  })
                  wx.setStorage({
                    data: res.data.token,
                    key: 'token',
                  })
                  wx.showModal({
                    title: '提示',
                    content: '授权成功，可以点击开始游戏了',
                    showCancel: false
                  })
                }
                else {
                  wx.showModal({
                    title: '提示',
                    content: '授权失败，请稍后再试',
                    showCancel: false
                  })
                }
              },
              fail: () => {
                wx.showModal({
                  title: '提示',
                  content: '授权失败，请稍后再试',
                  showCancel: false
                })
              },
              complete: () => {
                wx.hideLoading();
              }
            });
          },
        });
      }
    })
    

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'timestart',
      success: (res) => {
        if(Date.now() - res.data > 86400000) {
          wx.showModal({
            title: '提示',
            content: '授权码有效时限已过，请重新登录授权',
            showCancel: false
          })
          wx.clearStorage({
            complete: (res) => {console.log(res)},
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
