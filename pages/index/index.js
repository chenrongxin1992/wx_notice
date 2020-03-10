//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    //判断小程序API，回调，参数，组件是否在当前版本可用
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hastitle: true,
    hascontent: false,
    notice: {},
    hasuser:false,//是否有该用户信息wx_userinfo1表
    cardno:null,
    showTip:false,//弹框提示
    clicksubmit:false//tijiao 
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //提交
  formSubmit: function (e) {
    console.log('e.detail.value--->', e.detail.value)
    if (!e.detail.value.cardno) {
      wx.showModal({
        title: '提示',
        content: '请输入校园卡号',
        showCancel: false,
        confirmText: "好的",
        success: function (res) {
          if (res.confirm) {
            console.log('确定')
            return false
          }
        }
      })
    } else {
      //通过表单元素name属性获取值
      //提交
      wx.showLoading({
        title: '提交中...',
      })
      let posturl = 'add_qd_1', wxinfo={}
      if(app.globalData.userInfo){
        wxinfo = app.globalData.userInfo
        posturl = 'wx_add_qd_1'
        console.log('有用户信息，url--》', posturl)
      }else{
        //posturl = 'wx_add_qd_1'
        console.log('无用户信息，url--》', posturl)
      }
      wx.request({
        url: 'https://bdsc.szu.edu.cn/'+posturl,
        method: 'POST',
        data: {
          'cardno': e.detail.value.cardno,
          'code': app.globalData.notice.code,
          'wxinfo':wxinfo
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log('save qd success', res)
          if (res.data.code == 0) {
            console.log('save qdconfirm success', res)
            wx.hideLoading()
            wx.showToast({
              title: '已确认',
              duration:2000,
              success: function () {
                console.log('跳转到列表')
                //跳转下级页面的app.json中的书写应该紧挨着上级页面
                wx.navigateTo({
                  url: '../viewqdstate/viewqdstate?code=' + app.globalData.notice.code,
                })
              }
            })
          } else {
            console.log('确认失败---->', res)
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              success:function(){
                return false
              }
            })
          }
        }
      })
    }
  },
  onLoad: function () {
    console.log('获取通知')
    let that = this,openid = ''
    if (app.globalData.userInfo) {
      openid = app.globalData.userInfo.openid
    }
    wx.request({
      url: 'https://bdsc.szu.edu.cn/wx_newqd',
      method: 'POST',
      data: {
        'openid':openid
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.statusCode == 200) {
          console.log('get notice success', res)
          app.globalData.notice = res.data.notice
          wx.setStorageSync('notice', res.data.notice)
          that.setData({
            notice: res.data.notice
          })
          console.log('check globaldata', app.globalData)
          if (res.data.notice.content) {
            that.setData({
              hascontent: true
            })
          }
          if(res.data.wxdoc){
            console.log('用户已绑定')
            that.setData({
              hasuser: true,
              cardno: res.data.wxdoc.cardno
            })
          }else{
            console.log('用户未绑定')
          }
        } else {
          console.log('check error---->', res)
        }
      }
    })
    if (app.globalData.userInfo) {
      console.log('已有用户信息', app.globalData)
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log('第五步 app.userInfoReadyCallback', res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理 暂忽略
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  
  getUserInfo: function (e) {
    //点击授权进入到这里
    
    let self = this
    wx.login({
      success: res => {
        var usercode = res.code; //登录凭证
        if (usercode) {
          app.globalData.usercode = usercode;
          // 获取用户信息
          wx.getSetting({
            success: res => {
              console.log('111 res', res)
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  success: res => {
                    //console.log(res);
                    app.globalData.userInfo = res.userInfo
                    wx.request({
                      url: 'https://bdsc.szu.edu.cn/saveuserinfo',
                      method: 'POST',
                      data: {
                        'userinfo': res.userInfo,
                        'code': usercode
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      success: res => {
                        if (res.statusCode == 200) {
                          console.log('save userinfo success', res)
                          app.globalData.userInfo.openid = res.data.openid
                          app.globalData.notice = res.data.notice
                          let noticecode = res.data.notice.code
                          wx.setStorageSync('noticecode', noticecode)
                          console.log('globaldata ---->', app.globalData)
                          console.log('已获取到信息，关闭弹窗,跳转')
                          self.setData({
                            hasUserInfo:true,
                            showTip: false
                          })
                          // wx.navigateTo({
                          //   url: '../index/index?code=' + app.globalData.notice.code,
                          // })


                        } else {
                          console.log('check error---->', res)
                        }
                      }
                    })
                  }
                })
              } else {
                console.log('index没有用户信息，弹框')
                // console.log('self-->', self)
                // self.setData({
                //   showTip: true
                // });
              }
            },
            fail: function () {
              console.log('获取用户信息失败')
            }
          })
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })

  },
  gotobind: function (e) {
    console.log('lailema')
    this.setData({
      showTip: true
    })
    console.log('showtip---',this.data.showTip)
  },
  exit: function (e) {
    console.log('取消了授权,关闭提示')
    this.setData({
      showTip: false
    })
  }
})
