const { default: myAjax } = require("../../../utils/myAjax");
import PubSub from "pubsub-js";
import moment from "moment"

// pages/songDetail/songDetail.js



Page({

  /**
   * 页面的初始数据
   */
  data: {
    slider1: 50,
    isPlay:false,
    songs:[],
    id:"",
    musicLink:"",
    currentTime:"00:00", //实时时长
    durationTime:"00:00", //总时长
    currentWidth: 0,
    durationTimeMM:0 //当前总时长未转化日期
  },

  onChange(event) {
    wx.showToast({
      icon: 'none',
      title: `当前值：${event.detail}`,
    });
  },
 
  // 点击进度条切到指定进度条位置的歌曲时间
  handelToBar(e){
    //console.log(e);
    let pyl = e.changedTouches[0].clientX - e.currentTarget.offsetLeft;//偏移量
    let currentTime = pyl*2/450 * this.data.durationTimeMM*1 ;
    // console.log(currentTime)
    // console.log(pyl);
    this.bgAudio.seek(currentTime/1000)
    this.setData({
      currentTime:moment(currentTime).format("mm:ss"),
      currentWidth:pyl*2-12
    });
    
    //let currentTime = pyl*2/450 * this.data.durationTime
  },
  // handelStert(e){
  //   let pyl = e.changedTouches[0].clientX - e.currentTarget.offsetLeft;
  //   let currentTime = pyl*2/450 * this.data.durationTimeMM*1;
  //   currentTime > this.data.durationTimeMM && (currentTime = this.data.durationTimeMM);
  //   pyl > 225 && (pyl = 225); 
  //   console.log(pyl);
  //   this.bgAudio.seek(currentTime/1000)
  //   this.setData({
  //     currentTime:moment(currentTime).format("mm:ss"),
  //     currentWidth:pyl*2
  //   });
  // },
  //获取切歌的函数
  handleSwitch(e){
    //onsole.log(e);
    let type = e.currentTarget.id;
    // 订阅歌单消息拿取歌单id
    PubSub.subscribe("musicId",(msg,data)=>{
      //console.log(data);
      // 播放下一曲时停止当前音乐
      this.bgAudio.stop();
      // 获取音乐详情
      this.getSongDetail(data);
      // 切歌时播放音乐
      this.playAudio(true,data);
      PubSub.unsubscribe("musicId")
    })
    //发布消息 给歌单页面
    PubSub.publish("switchType",type);
  },
  handelPlay(){
    let isPlay = !this.data.isPlay;
    // this.setData({
    //   isPlay
    // });
    this.playAudio(isPlay,this.data.id,this.data.musicLink);
  },
  async playAudio(isPlay,id,musicLink){
    this.bgAudio = wx.getBackgroundAudioManager();
    if(isPlay){
      if(!musicLink){
        //获取音乐播放连接
        let musicLinkData = await myAjax("/song/url",{id});
        musicLink = musicLinkData.data[0].url;

        this.setData({
          musicLink
        })
      }
      this.bgAudio.src = musicLink;
      this.bgAudio.title = this.data.songs[0].al.name;
    }else{
      this.bgAudio.pause();
    }
  },
  play(){
    let query = wx.createSelectorQuery()
    let an = query.select("#an");
    an.boundingClientRect((res)=>{
      console.log(res)
    })
    //console.log(an)
  },
 
  // 获取歌曲详情
  async getSongDetail(id){
    let res = await myAjax("/song/detail",{ids:id});
    //console.log(res);
    let durationTime = moment(res.songs[0].dt).format("mm:ss");
    let durationTimeMM = res.songs[0].dt;
    this.setData({
      songs:res.songs,
      durationTime,
      durationTimeMM
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.songs[0].al.name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.id);
    this.getSongDetail(options.id);
    this.setData({
      id:options.id
    });
    // 获取全局状态的id和播放状态
    let yyId = getApp().globalData.yyId;
    let isGlobalPlay = getApp().globalData.isGlobalPlay;
    console.log(getApp().globalData.isGlobalPlay)
    if(isGlobalPlay && yyId == this.data.id){
      this.setData({
        isPlay:true
      })
    }
    // 监听音乐播放和暂停
    this.bgAudio = wx.getBackgroundAudioManager();
    this.bgAudio.onPlay(()=>{
      getApp().globalData.yyId = this.data.id;
      this.changePlayState(true)
      // this.setData({
      //   isPlay:true
      // })
    });
    this.bgAudio.onPause(()=>{
      this.changePlayState(false)
      // this.setData({
      //   isPlay:false
      // })
    });
    // 监听音乐停止
    this.bgAudio.onStop(()=>{
      this.changePlayState(false)
      //  this.setData({
      //    isPlay:false
      //  })
    });
    // 监听音乐实时播放的进度
    this.bgAudio.onTimeUpdate(()=>{
      // console.log("总时长",this.bgAudio.duration);
      // console.log("当前时长",this.bgAudio.currentTime);
      let currentTime = moment(this.bgAudio.currentTime * 1000).format("mm:ss");
      let currentWidth = this.bgAudio.currentTime/this.bgAudio.duration * 450;
      this.setData({
        currentTime,
        currentWidth
      })
    })
    // 监听音乐播放自然结束自动播放下一曲
    this.bgAudio.onEnded(()=>{
      PubSub.publish("switchType","next");
      this.setData({
        currentWidth:0,
        currentTime:"00:00"
      })
    })
  },

  // 修改播放状态
  changePlayState(isPlay){
    // 修改全局播放状态
    //console.log(getApp().globalData)
    getApp().globalData.isGlobalPlay = isPlay;
    this.setData({
      isPlay
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