// pages/search/search.js
const { default: myAjax } = require("../../utils/myAjax");
// 定义一个防抖 、、、节流函数的参数
let isSend = true;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    default:"",
    HotList:[],
    searchStr:"",
    searchList:[],
    historyArr:[]
  },
  // 清空搜索历史记录
  handleDelete(){
    wx.showModal({
      cancelColor: 'cancelColor',
      content:"是否确定清空",
      success:(res)=>{
        console.log(res);
        if(res.confirm){
          wx.removeStorageSync('historyArr')
          //wx.setStorageSync('historyArr', [] );
          this.setData({
            historyArr:[]
          })
        }
      }
    })
    
  },
  //输入搜索功能的回调
  async handleChange(e){
    //console.log(e.detail); 
    if(!e.detail.trim()){
      this.setData({
        searchList:[]
      })
      return;
    };
    if(!isSend){
      return
    } 
    isSend = false;
    let res = await myAjax("/search",{keywords:e.detail.trim(),limit:10});
    //console.log(res);
    this.setData({
      searchStr:e.detail.trim(),
      searchList:res.result.songs
    });
    setTimeout(()=>{
      isSend = true;
    },200)
    let { searchStr,historyArr } = this.data;
    // 添加关键字到搜索历史中
    if(historyArr.indexOf(searchStr) !== -1){
      historyArr.splice(historyArr.indexOf(searchStr),1)
    }
    if(historyArr.length > 8){
      historyArr.pop(historyArr.length-1)
    }
    historyArr.unshift(searchStr);
    this.setData({
      historyArr
    })
    wx.setStorageSync('historyArr', historyArr);
  },

  // 获取初始化的数据
  async getInitData(){
    let res = await myAjax("/search/default");
    let HotListRes = await myAjax("/search/hot/detail")
    this.setData({
      default:res.data.showKeyword,
      HotList:HotListRes.data
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getInitData();
    let historyArr = wx.getStorageSync('historyArr');
    if(historyArr){
      this.setData({
        historyArr
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