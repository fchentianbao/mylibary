var rq = require('request-promise')
exports.main = async (event, context) => {
  
  var res = rq('https://api.douban.com/v2/book/isbn/' + event.isbn)
    .then( htmlString => {
      return htmlString;
    })
    .catch(function (err) {
      console.log(err);
    });

  return res;
}