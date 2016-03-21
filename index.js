var
  _ = require('underscore'),
  superagent = require('superagent'),
  config = require('solid-config'),
  csv = require('fast-csv')

var range = []

csv.fromPath(__dirname + './node_modules/data/ranges.csv').on('data', function (d) {range.push(d)})

module.exports = function () {
  var url = 'https://akura.co/telegram/' + require('./package').name + '/hook'
  console.log(url)
  superagent.get(config.url + config.token + '/setWebhook').query({url: url}).end(function (err) {
    if (err)
      console.log(err)
  })
  return function (req, res) {
    console.log(req.body)
    if (req.body.message) {
      var n = +req.body.message
      _.find(range, function (range) {
        if (n < range.iin_start)
          return
        if (range.iin_end && (n > range.iin_end))
          return
        res.json({method: 'sendMessage', chat_id: req.body.message.chat.id, text: JSON.stringify(range)})
        return true
      })
      return
    }
    res.end()
  })
}
