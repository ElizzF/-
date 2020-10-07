
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originImg: "https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=4113145072,3870813761&fm=26&gp=0.jpg",
  },
  goToGame() {
    wx.redirectTo({
      url: '/pages/game/game',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({title: '加载中', icon: 'loading', duration: 10000, mask: true});
    wx.getStorage({
      key: 'token',
      success: (res) => {
        wx.request({
          url: 'https://frp.leavessoft.cn:40001/api/klotski/user/history',
          method: 'GET',
          header: {
            Authorization: 'Bearer ' + res.data,
          },
          success: (res) => {
            let history =  res.data;
            let minStep = history[0].step;
            let minTime = history[0].time;
            for(let i = 1; i < history.length; i++) {
              if(history[i].step < minStep) minStep = history[i].step;
              if(history[i].time < minTime) minTime = history[i].time;
            }
            let arr = {
              minStep: minStep,
              minTime: minTime
            };
            wx.setStorage({
              data: arr,
              key: 'history',
            })
          },
          fail: (res) => {
            console.log(res);
          }
        }),
        wx.request({
          url: 'https://frp.leavessoft.cn:40001/api/klotski/pictures',
          method: 'GET',
          header: {
            Authorization: 'Bearer ' + res.data
          },
          success: (res) => {
            if(res.statusCode == 200) {
              wx.setStorage({
                data: res.data.pictures,
                key: 'pictures',
              })
              this.setData({
                originImg:  res.data.origin
              })
            }
            else {
              wx.showModal({
                title: '提示',
                content: '由于网络异常等原因，图片加载失败，请稍后再试',
                showCancel: false
              })
            }
          },
          fail: (res) => {
            console.log(res);
            wx.showModal({
              title: '提示',
              content: '由于网络异常等原因，图片加载失败，请稍后再试',
              showCancel: false
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        });
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
