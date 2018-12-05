
import Dialog from '../../dist/dialog/dialog';
const db = wx.cloud.database();
const book = db.collection('mybook');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    booklist: [],
    openid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var _that = this;

    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log(res.result.openid);
        var openid = res.result.openid;
        console.log(openid);
        this.setData({
          openid: openid
        });

        var booknum = this.data.booklist.length;
        if (booknum == 0) {
          book.where({
            _openid: this.data.openid
          }).limit(8).get({
            success: res => {
              // res.data 是包含以上定义的两条记录的数组
              console.log(res.data);
              console.log(_that);
              this.setData({
                booklist: res.data
              })

            }
          })
        }
    
        },
        fail: err => {
          console.log(err);
        }
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
    // var _that = this;
    // book.get({
    //   success: res => {
    //     // res.data 是包含以上定义的两条记录的数组
    //     console.log(res.data);
    //     console.log(_that);
    //     this.setData({
    //       booklist: res.data
    //     })

    //   }
    // })
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

    var _that = this;
    var books = _that.data.booklist;
    var booknum = books.length;
    console.log(booknum);
    if (booknum > 0) {
      book.where({
        _openid: this.data.openid
      }).skip(booknum).limit(8).get({
        success: res => {
          console.log('结果： ');
          console.log(res.data);
          this.setData({
            booklist: books.concat(res.data)
          });

          console.log(_that.data.booklist);
          _that.onLoad();

        }
      })
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareobj = {
      title: '分享图书',
      path: '/pages/index/index',
      success: res => {
        if (res.errMsg == 'shareAppMessage:ok') {
        }
      },
      fail: err => {
        console.log(err);

      }
    }

    return shareobj;
  },

  viewbook: function (event) {
    console.log(event.currentTarget.dataset.id);
    var bookid = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../bookdetail/bookdetail?id=' + bookid
    })
  },

  delbook: function (event) {

    var _that = this;

    Dialog.confirm({
      title: '删除',
      message: '删除图书'
    }).then(() => {
      var bookid = event.currentTarget.dataset.id;
      book.doc(bookid).remove({
        success: function (res) {
          _that.setData({
            booklist: []
          });
          _that.onLoad();
        }
      })
    }).catch((err) => {
      console.log(err);
    });

  }

})