// pages/scancode/scancode.js

import Dialog from '../../dist/dialog/dialog';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: {},
    addbookerr: '',
    ISBN:0
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

  },

  scanCode: function (event) {
    var _that = this;
    console.log(event);
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success: res => {
        console.log(res.result);
        _that.setData({ ISBNL: res.result});
        wx.cloud.callFunction({
          name: 'bookinfo',

          // 传递给云函数的参数
          data: {
            isbn: res.result
          },
          success: res => {
            const db = wx.cloud.database();
            const book = db.collection('mybook');

            var bookstring = res.result;
            var booinfo = JSON.parse(bookstring);
            this.setData({ book: JSON.parse(bookstring) });
          
            var bookisbn = booinfo.isbn13;
            console.log("bookISBN " + booinfo.isbn13);
            const _ = db.command;
            book.where(_.or([
              {
                isbn13: _.eq(bookisbn),
                isbn10: _.eq(booinfo.isbn10)
              }
            ])).get({
              success: function (res) {
                console.log(res.data);
                if (res.data.length >= 1) {

                  Dialog.alert({
                    title: '提示',
                    message: '<<' + res.data[0].title+'>>，已经存在书库中'
                  }).then(() => {
                    // on close
                  });

                } else{
                  console.log('添加图书');
                  book.add({
                    // data 字段表示需新增的 JSON 数据
                    data: JSON.parse(bookstring)
                  })
                    .then(res => {
                      console.log(res)
                    }).catch(err => {
                      console.log(err);
                    })
                }
              }
            })
          },
          fail: err => {
            console.log(err);
          }
        })
      },
      fail: err => {

        console.log(err);
        this.setData({ addbookerr: err.errMsg, book: {} , ISBN :0});
      }
    })

  }

  //https://api.douban.com/v2/book/isbn
})