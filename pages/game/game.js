const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: app.windowWidth,
    pictureData: [],
    step: 0,
    m: '00',
    s: '00',
    minStep: '',
    shortestM: '',
    shortestS: '',
  },
  sleep(d){
    for(let t = Date.now();Date.now() - t <= d;);
  },
  //自动处理，调换图片
  freeMove(e) {
    let numData = this.data.pictureData;
    let step = this.data.step;
    for(let i = 0; i < numData.length; i++) {
      if(numData[i].no == 9) {
        let x = i + e;
        [numData[i], numData[x]] = [numData[x], numData[i]];
         step++;
         break;
      }
    }
    this.setData({
      pictureData: numData,
      step: step
    });
    this.gameOver(1);
    this.sleep(300); 
  },
  //自动处理直到游戏结束
  free() {
    let state = '';
    for(let i = this.data.pictureData.length - 1; i >= 0; i--) {
      state += this.data.pictureData[i].no;
    }
    wx.getStorage({
      key: 'token',
      success: (res) => {
        wx.request({
          url: 'https://frp.leavessoft.cn:40001/api/klotski/problem',
          method: 'POST',
          header: {
            Authorization: 'Bearer ' + res.data,
          },
          data: {
            "state": parseInt(state),
            "step": 2000,
            'swap': [] 
          },
          success: (res) => {
            let operation = '';
            let ope = res.data.operations;
            let a = Date.now();
            
            for(let i = 0; i < ope.length; i++) {
              if(ope[i] == 'd') {
                this.freeMove(1);
              }
              else if(ope[i] == 'a') {
                this.freeMove(-1);
              }
              else if(ope[i] == 'w') {
                this.freeMove(-3);
              }
              else if(ope[i] == 's') {
                this.freeMove(3);
              }
             
            }
          
            // if(ope[0] == 'd') operation += '向左';
            // else if(ope[0] == 'a') operation += '向右';
            // else if(ope[0] == 'w') operation += '向下';
            // else if(ope[0] == 's') operation += '向上';
            
            // wx.showModal({
            //   title: '下一步',
            //   content: operation,
            //   showCancel: false,
            // })
          },
          fail: (res) => {
            console.log(res);
          }
        })
      }
    });
  },
  //询问下一步
  inquiry() {
    let state = '';
    for(let i = this.data.pictureData.length - 1; i >= 0; i--) {
      state += this.data.pictureData[i].no;
    }
    wx.getStorage({
      key: 'token',
      success: (res) => {
        wx.request({
          url: 'https://frp.leavessoft.cn:40001/api/klotski/problem',
          method: 'POST',
          header: {
            Authorization: 'Bearer ' + res.data,
          },
          data: {
            "state": parseInt(state),
            "step": 2000,
            'swap': [] 
          },
          success: (res) => {
            let operation = '';
            let ope = res.data.operations;
            if(ope[0] == 'd') operation += '向左';
            else if(ope[0] == 'a') operation += '向右';
            else if(ope[0] == 'w') operation += '向下';
            else if(ope[0] == 's') operation += '向上';
            
            wx.showModal({
              title: '下一步',
              content: operation,
              showCancel: false,
            })
          },
          fail: (res) => {
            console.log(res);
          }
        })
      }
    });
  },
  //初始化历史记录
  initHistory() {
    wx.getStorage({
      key: 'history',
      success: (res) => {
        let shm = parseInt(res.data.minTime / 60);
        let shs = res.data.minTime % 60;
        console.log(shm + " " + shs);
        this.setData({
          minStep: res.data.minStep,
          shortestM: shm < 10 ? '0' + shm : shm,
          shortestS: shs < 10 ? '0' + shs : shs
        })
      },
      fail: (res) => {
        console.log(res);
      }
    })
  },
  //初始化九宫格
  initPicture() {
    wx.getStorage({
      key: 'pictures',
      success: (res) => {
        this.setData({
          pictureData: res.data,
          m: '00', 
          s: '00',
          step: 0,
        }) 
      }
    })
    clearInterval(this.timer);
    this.timer = null;
    this.time = 0;
    this.countdown();
  },

  goMove(e) {
    
    // console.log(e);
    let index = e.currentTarget.dataset.index;
    let numData = this.data.pictureData;
    let step = this.data.step;
    for (let i in numData) {
      if (index == i && numData[index].no != 9) {
        let x = '';
        // 当前点击的 上下左右 方向如果有空位的话，就互换位置
        if (numData[index - 3] && numData[index - 3].no == 9) {  // 下
          x = index - 3;
        } else if (numData[index + 3] && numData[index + 3].no == 9) {  // 上
          x = index + 3;
        } else if (numData[index - 1] && numData[index - 1].no == 9) {  // 左
          // 如果是在最左边的话，禁止向左移动
          for (let h = 1; h < 3; h++) {
            if (index == 3 * h) return;
          }
          x = index - 1;
        } else if (numData[index + 1] && numData[index + 1].no == 9) {  // 右
          // 如果是在最右边的话，禁止向右移动
          for (let h = 1; h < 3; h++) {
            if (index == 3 * h - 1) return;
          }
          x = index + 1;
        } else {
          return; // 没有空位不做任何操作
        }

        // Es6 解构赋值
        [numData[i], numData[x]] = [numData[x], numData[i]];
        step++;
        break;
      }
    }
    this.setData({
      pictureData: numData,
      step: step
    });
    this.gameOver(0);
  },
  gameOver(e) {
    let numData = this.data.pictureData;
    let count = 0;
    for(let i in numData) {
      if(i == numData[i].no) count++;
    }
    if(count == 8) {
      if(e != 1) {
        let stepss = this.data.step;
        let timess = parseInt(this.data.m) * 60 + parseInt(this.data.s);
        wx.getStorage({
          key: 'token',
          success: (res) => {
            wx.request({
              url: 'https://frp.leavessoft.cn:40001/api/klotski/user/history',
              method: 'POST',
              header: {
                Authorization: 'Bearer ' + res.data,
              },
              data: {
                "step": stepss,
                "time": timess
              },
              success: (res) => { 
                console.log(res);
                console.log(stepss);
                console.log(timess);
              },
              fail: (res) => {
                console.log(res);
              }
            })
          }
        })
      }
      wx.showModal({
        title: '提示',
        content: '您已过关啦！',
        showCancel: false,
        success: () => {
          wx.redirectTo({
            url: '/pages/index/index',
          })
       },
      })
    }
  },
  restart() {
    wx.redirectTo({
      url: '/pages/preparation/preparation',
    })
  },
  reset() {
    this.initPicture();
  },
  // 定时器
  timer: null,
  time: 0,
  countdown() {
    let that = this;
    clearInterval(that.timer);
    that.timer = null;
    that.timer = setInterval(function () {
      that.time += 1;

      // 超过1小时，游戏也结束
      if (that.time > 3600) {
        clearInterval(that.timer);
        that.timer = null;
        that.time = 0;
        wx.showModal({
          title: '超时提示',
          content: '您的游戏时间已超时，请重新开始游戏',
          showCancel: false,
          success: () => {
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        })
        return;
      }

      // 更新分、秒数
      if (that.time < 60) {
        that.setData({
          s: that.time < 10 ? '0' + that.time : that.time,
          m: '00'
        })
      } else {
        let mm = parseInt(that.time / 60);
        let ss = that.time - (mm * 60);
        that.setData({
          m: mm < 10 ? '0' + mm : mm,
          s: ss < 10 ? '0' + ss : ss,
        })
      }
    }, 1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initHistory();
    this.initPicture();
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
