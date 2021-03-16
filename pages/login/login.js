// pages/login/login.js
import myAjax from "../../utils/myAjax"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:"",
    password:""
  },
  async login(){
    console.log(11);
    let {user,password} = this.data;
    if(!user){
      wx.showToast({
        title: '用户名/手机号不能为空',
        icon:"none"
      });
      return
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon:"none"
      });
      return
    }
    //定义用户名正则表达式
    let userReg = /^1[0-9]d{9}$/;
    if(userReg.test(user)){
      wx.showToast({
        title: '手机号格式错误',
        icon:"none"
      })
      return
    }
    //发送请求
    let result = await myAjax("/login/cellphone",{phone:user,password,isLogin:true});
    if(result.code == 200){
      //请求成功
      wx.showToast({
        title: '登录成功',
      });
      wx.reLaunch({
        url: '/pages/pensonal/pensonal',
      });
      //本地存储
      wx.setStorageSync('userInfo', result.profile)
    }else if(result.coede === 400){
      wx.showToast({
        title: '手机号错误',
        icon:'none'
      });
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon:"none"
      })
    }else{
      wx.showToast({
        title: '登录错误',
        icon:"none"
      })
    }
  },
  handleInput(e){
    //console.log(e.detail.value,e.currentTarget.id)
    // 通过id来去值 let type = e.currentTarget.id;
    // 通过data-XX来取值 可以取多个值例如 data-YYY 在元素上定义 key为XX value为后面的值
    
    let type = e.currentTarget.dataset.type;
    this.setData({
      [type]:e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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