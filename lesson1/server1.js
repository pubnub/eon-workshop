/**
 * Created by josh on 2/17/16.
 */


var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo"
});


var number = 100;
function publish() {
    number += Math.random();
    var message = { eon: {"value" : number} };
    console.log("sending",message);
    pubnub.publish({
        channel   : 'josh_hello_world_1',
        message   : message,
    });
}
setInterval(publish,3*1000); //every three seconds


