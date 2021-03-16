// pages/pensonal/pensonal.js
let startY = 0; //点击元素的Y轴坐标值
let moveY = 0; //点击元素移动后的坐标值
let moveDistance = 0; //点击元素后在Y轴上移动的距离 既移动后的Y轴坐标 - 初始Y轴坐标

import myAjax from "../../utils/myAjax" 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:"",
    coverTransition:"",
    userInfo:{},
    playList:[]
  },
  //获取用户播放记录
  async getUserPlayList(userId){
    let res = await myAjax("/user/record",{uid:userId,type:1})
    
    let successRes;
    if(res.code == 200){
      wx.setStorageSync('playList', res.weekData)
      successRes = res.weekData
    }else if(res.code = -2){
      successRes = wx.getStorageSync('playList')
    }
    console.log(res);

    let index = 0; 
    let mapRes = successRes.map(item=>{
      //console.log(item);
      item.id = index++;
      return item
    })
    //console.log(mapRes,res)
    this.setData({
      playList:mapRes
    })
  },
  //初次点击元素
  handleTouchStart(e){
    
    //获取初始手指的坐标
    startY = e.touches[0].clientY;
    this.setData({
      coverTransition:""
    })
    //console.log("1",startY)
  },
  //点击元素移动
  handleTouchMove(e){
    //获取移动后手指坐标
    moveY = e.touches[0].clientY;
    moveDistance = moveY - startY;
    //console.log("2",moveY,moveDistance)
    //如果 moveDistance < 0 是往上移动 反之
    if(moveDistance <= 0){
      return;
    }
    if(moveDistance >= 80){
      moveDistance = 80;
    }

    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
   
  },
  //点击结束离开元素
  handleToundEnd(){
    //console.log("3")
    this.setData({
      coverTransform:`translateY(0rpx)`,
      coverTransition:"transform 0.1s linear"
    })
  },
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //读取用户的基本信息
    let userInfo = wx.getStorageSync('userInfo');
    //console.log(userInfo)
    if(userInfo){
      //如果用户信息不为空
      this.setData({
        userInfo
      })
      this.getUserPlayList(this.data.userInfo.userId);
    }
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