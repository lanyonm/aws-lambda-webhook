'use strict';

var http = require('https');
var config = require('./config.js');

exports.pingdomToHipchat = function(event, context, callback) {
  context.callbackWaitsForEmptyEventLoop = false;
  // the contents of event is dependent on the configuration of API Gateway
  // console.log('the message is', event.message);

  // there some things that the decodeURI method doesn't clean up for us
  var msg = JSON.parse(decodeURI(event.message).replace(/\+/g, ' ').replace(/%3A/g, ':').replace(/%2C/g, ','));
  console.log('the message json is:\n', msg);

  var hc_msg = {
    color: msg.description === 'down' ? 'red' : 'green',
    message: msg.checkname + ' is ' + msg.description + ' (' + msg.host + ')',
    notify: false,
    message_format: 'text',
  };

  console.log('hipchat message:\n', hc_msg);

  var http_opts = {
    host: 'api.hipchat.com',
    port: 443,
    method: 'POST',
    path: '/v2/room/' + config.hipchat.room + '/notification?auth_token=' + config.hipchat.token,
    headers: {
      'Content-Type': 'application/json',
    }
  };

  var req = http.request(http_opts, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      console.log('BODY:', chunk);
    });
    res.on('end', function () {
      if (res.statusCode === 204) {
        console.log('success - message delivered to hipchat');
        callback(null, 'message delivered to hipchat');
      } else {
        console.log('failed with', res.statusCode);
        callback(res.statusCode, 'hipchat API returned an error');
      }
    });
  });

  req.on('error', function(e) {
    console.log('problem with request:', e.message);
    callback(e, 'failed to deliver message to hipchat: ' + e.message);
  });

  req.write(JSON.stringify(hc_msg));
  req.end();
};
