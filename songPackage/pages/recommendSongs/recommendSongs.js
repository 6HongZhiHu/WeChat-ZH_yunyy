// pages/recommendSongs/recommendSongs.js
import myAjax from "../../../utils/myAjax";
import PubSub from "pubsub-js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day:'',
    mouth:"",
    recommendList:[],
    index:0, //歌单数组下标
  },

  // 跳转至歌曲详情页
  handleToSongDetail(e){
    console.log(e)
    let {item,index} = e.currentTarget.dataset;
    this.setData({
      index
    })
    
    //console.log(songid)
    wx.navigateTo({
      url: '/songPackage/pages/songDetail/songDetail?id=' + item.id,
    })
  },
  // 获取用户推荐歌曲
  async getRecommend(){
    let res = await myAjax('/recommend/songs');
    this.setData({
      recommendList:res.recommend
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      day:new Date().getDate(),
      mouth:new Date().getMonth()+1
    });
    // 判断用户登录
    let userInfo = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:"none",
        success:()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }else{
      this.getRecommend();
    };
    //订阅消息
    PubSub.subscribe("switchType",(msg,type)=>{
      //console.log(msg,type);
      let {recommendList,index} = this.data;
      if(type === "pre"){
        (index === 0) && (index = recommendList.length);
        index -= 1;
      }else{
        (index === recommendList.length-1) && (index =-1);
        index += 1;
      };
      
      // if(index < 0){
      //   index = recommendList.length -1
      // }else if(index >= recommendList.length){
      //   index = 0
      // }

      // 更新下标
      this.setData({
        index
      })
      //console.log("vvv",index)
      let musicId = recommendList[index].id
      //发布消息给歌曲详情页传递id
      PubSub.publish("musicId",musicId)
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