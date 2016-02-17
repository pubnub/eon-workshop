/**
 * Created by josh on 2/17/16.
 */

var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo"
});


var temp = 75;
var light = 30;
var pot = 0;
var potdir = -1;
function publish() {
    temp += Math.random()-0.5;
    light += Math.random()-0.5;
    if(pot < -10) potdir = 1;
    if(pot > 10) potdir = -1;
    pot += potdir;
    var message = { eon: {
        "temperature" : temp,
        "light":light,
        "potentiometer":pot
    } };
    console.log("sending",message);
    pubnub.publish({
        channel   : 'fake_device',
        message   : message,
    });
}
setInterval(publish,3*1000); //every three seconds


