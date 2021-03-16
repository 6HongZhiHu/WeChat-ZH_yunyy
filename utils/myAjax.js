//发送ajax请求

import host from "./config"

export default (url,data={},method="GET",isLogin=false) => {
  return new Promise((resolve,reject)=>{
    //当我们一旦new Prommise 初始化promise实例的状态为pending
    wx.request({
      // http://localhost:3000/banner
      url:host.host + url,
      data,
      method,
      header:{
        cookie:wx.getStorageSync('cookies')?wx.getStorageSync('cookies').find(item=>item.indexOf("MUSIC_U")!==-1) : ""
      },
      success:(res)=>{
        if(data.isLogin){
          wx.setStorage({
            data: res.cookies,
            key: 'cookies',
          })
        }
        //console.log("请求成功",res);
        //resolve 的作用是修改promise的状态为成功状态
        resolve(res.data)
      },
      fail:(err)=>{
        //console.log("请求失败",err);
        reject(err)
      }
    })
  })
}