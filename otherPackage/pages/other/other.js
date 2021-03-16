// pages/other/other.js
const { default: myAjax } = require("../../../utils/myAjax");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{
      user:"hzh",
      age:"18"
    }
  },
  handleLogin(){
    wx.login({
      success: async (res)=>{
        //获取登录凭证code
        console.log(res);
        let reslut = await myAjax("/getOpenId",{code:res.code});
        console.log(reslut)
      }
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