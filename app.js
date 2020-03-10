//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力,不同页面可以共享
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    
    //openid
    //var openid = ''
    //var that = this
    var code = ''
    // 登录
    wx.login({
      success: res => {
        console.log('第六步 here code-->',res.code)
        code = res.code
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
       console.log('第一步 app getsetting',res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // wx.getUserInfo({
          //   success: res => {
          //     // 可以将 res 发送给后台解码出 unionId
          //    console.log('第三步 app getuserinfo',res)
          //     console.log('第四步 this.userInfoReadyCallback', this.userInfoReadyCallback)
          //     this.globalData.userInfo = res.userInfo
          //     let that = this
          //     //后台保存用户信息
          //     wx.request({
          //       url: 'https://bdsc.szu.edu.cn/saveuserinfo',
          //       method: 'POST',
          //       data: {
          //         'userinfo': res.userInfo,
          //         'code':code
          //       },
          //       header: {
          //         'content-type': 'application/json'
          //       },
          //       success: res => {
          //         if (res.statusCode == 200) {
          //           console.log('第七不 save userinfo success',res)
          //           that.globalData.userInfo.openid = res.data.openid
          //           that.globalData.notice = res.data.notice
          //           console.log('第九步 globaldata ---->', that.globalData)
          //         } else {
          //           console.log('check error---->', res)
          //         }
          //       }
          //     })
          //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          //     // 所以此处加入 callback 以防止这种情况
          //     if (this.userInfoReadyCallback) {
          //       this.userInfoReadyCallback(res)
          //     }
          //   }
          // })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    notice:null
  }
})