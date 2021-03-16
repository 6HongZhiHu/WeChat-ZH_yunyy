// pages/index/index.js
import myAjax from '../../utils/myAjax'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg:[], //轮播图
    recommendList:[], //推荐歌单
    topList:[],//排行榜
  },
  handleTest(){
    wx.navigateTo({
      url: '/otherPackage/pages/other/other',
    })
  },

  handleTui(){
    wx.navigateTo({
      url: '/songPackage/pages/recommendSongs/recommendSongs',
    })
  },

  // 获取banner轮播图
  getBannerImg : async function(){
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    let banners = await myAjax("/banner",{type:2});
    if(banners.code == 200){
      this.setData({
        bannerImg:banners.banners
      })
    }
    let tuijianListData = await myAjax("/personalized",{limit:10})
    console.log(tuijianListData)
    if(tuijianListData.code == 200){
      this.setData({
        recommendList:tuijianListData.result
      })
    };
    // 获取排行榜数据\
    /**idx的取值范围是0-20 需要5个排行榜对象里面包含一个排行榜name属性和一个
     * tracks排行榜数组
     * 需要发送5次请求
     * 先++和后++的区别是先看到运算符就先运算在赋值，反之
     */
    //需要装到data里的排行榜空数组
    let reslutArr = [];
    for(let i = 0;i<5;i++){
      
        let topListData = await myAjax("/top/list",{idx:i+1})
        //splice 和 slice 的区别 是前者可以修改原数组后者则不会
        
        //对请求的数据进行处理截取只取请求来的排行榜数据前3个数据
        let topListItem = {name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)};
        reslutArr.push(topListItem);
        //给一次数据渲染一次页面
        this.setData({
          topList:reslutArr
        })
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