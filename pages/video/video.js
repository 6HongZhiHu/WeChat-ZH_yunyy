// pages/video/video.js
import myAjax from "../../utils/myAjax"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList:[], //导航标签数据
    navId:0,
    videoList:[],
    videoId:"",
    vidUpdateTime:[],
    isTriggered:false
  },
  // 点击搜索跳转
  handleSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 上拉触低加载
  handleTolower(){
    console.log("sl")
  },
  // 自定义下拉刷新
  handleRefresh(){
    //console.log("xl");
    this.getVideoList(this.data.navId);

  },
  // 视频播放结束
  handleEnd(e){
    //console.log("end");
    //移除当前播放时长视频的对象
    let {vidUpdateTime} = this.data;
    //找到当前data里保存与当前视频播放结束一致的视频vid下标
    let endVid = vidUpdateTime.findIndex(item=>item.vid===e.currentTarget.id);
    vidUpdateTime.splice(endVid,1);
    this.setData({
      vidUpdateTime
    })
  },
  // 监听视频进度的函数
  handleUpdateTime(e){
    //console.log(e);
    let TimeObj = {vid:e.currentTarget.id,currentTime:e.detail.currentTime};
    let {vidUpdateTime} = this.data;
    let vidItem = vidUpdateTime.find(item=>item.vid===TimeObj.vid)
    //判断vidUpdateTime是否有当前视频的播放记录
    if(vidItem){
      //说明之前有当前视频的播放记录
      vidItem.currentTime = e.detail.currentTime
    }else{
      //没有
      vidUpdateTime.push(TimeObj)
    }
    this.setData({
      vidUpdateTime
    })

  },

  async getVideoGroupList(){
    let res = await myAjax("/video/group/list");
    this.setData({
      videoGroupList:res.data.slice(0,14),
      navId:res.data[0].id
    });
    this.getVideoList(this.data.navId)
  },

  //获取对应id的视频列表
  async getVideoList(id){
    // if(!this.data.navId){
    //   return
    // }
    let res = await myAjax("/video/group",{id});
    wx.hideLoading() //关闭提示框
    
    let index = 0;
    let videoList = res.datas.map(item=>{
      item.id = index++;
      return item
    })
    if(res.code == 200){
      //关闭下拉刷新
      //this.setData({})
      this.setData({
        videoList,
        isTriggered:false
      })
    }
    //console.log(res)
  },

  changeNav(e){
    console.log(e);
    //let navId = e.currentTarget.id;
    let navId = e.currentTarget.dataset.id
    this.setData({
      navId:navId
    });
    this.getVideoList(this.data.navId)
  },

  // 视频播放事件
  handlePlay(e){
    let vid = e.currentTarget.id;
    
    // this.vid !== vid && this.vidContext && this.vidContext.stop();
    // this.vid = vid; 
    this.vidContext = wx.createVideoContext(vid)
    this.setData({
      videoId:e.currentTarget.id
    })
    //判断当前视频之前是否播放过
    let vidItem = this.data.vidUpdateTime.find(item=>item.vid===vid);
    if(vidItem){
      this.vidContext.seek(vidItem.currentTime)
    }
    this.vidContext.play()
  },

  // 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupList();
    
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
    console.log("xlsx")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})