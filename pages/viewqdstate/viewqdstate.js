// pages/viewqdstate/viewqdstate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yqd:[],
    wqd:[],
    hasyqd:false,
    haswqd:false,
    yqdlength:0,
    wqdlength:0,
    notice:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      notice: wx.getStorageSync('notice')
    })
    let noticecode = wx.getStorageSync('noticecode'),
        that = this
    console.log('noticecode-->',noticecode)
    wx.request({
      url: 'https://bdsc.szu.edu.cn/wx_viewqdstate?code='+noticecode,
      method: 'GET',
      data: {
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        console.log('get list success', res)
        if (res.statusCode == 200) {
          console.log('save qdconfirm success', res)
          if(res.data.yqd){
            console.log('here')
            that.setData({
              yqd:res.data.yqd,
              hasyqd:true,
              yqdlength:res.data.yqd.length
            })
          }
          if(res.data.wqd){
            that.setData({
              wqd:res.data.wqd,
              haswqd:true,
              wqdlength: res.data.wqd.length
            })
          }
          
        } else {
          console.log('check error---->', res)
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