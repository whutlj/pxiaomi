var JPush = require('../jpush/lib/JPUSH.js');
var client = JPush.buildClient('c8d110dee77d4d84494023fc','a3e81832fe85008f08f4668a',5);


client.push().setPlatform('android','ios')
    .setAudience(JPush.tag('555', '666'), JPush.alias('666,777'))
    .setNotification(JPush.ios('开票成功'), JPush.android('开票成功', '票小秘', 1))
    .setOptions(null, 60)
    .send(function(err, res) {
        if (err) {
            console.log(err.message);
        } else {
            console.log('Sendno: ' + res.sendno);
            console.log('Msg_id: ' + res.msg_id);
        }
    });
  