/**
 * Created by josh on 2/17/16.
 */
/**
 * Created by josh on 2/17/16.
 */


var pubnub = require("pubnub")({
    ssl           : true,  // <- enable TLS Tunneling over TCP
    publish_key   : "demo",
    subscribe_key : "demo"
});


var numbers = [100,100,100,100,100];
function publish() {
    var message = { eon: {}};
    for(var i=0; i<numbers.length; i++) {
        numbers[i] += (Math.random() - 0.5);
        message.eon["value"+i] = numbers[i];
    }

    console.log("sending",message);
    pubnub.publish({
        channel   : 'josh_hello_world_5',
        message   : message,
    });
}
setInterval(publish,3*1000); //every three seconds


